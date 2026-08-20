import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHmac, randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt = promisify(scryptCallback);
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 4173);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const DATABASE_URL = process.env.DATABASE_URL || '';
let Pool = null;
if (DATABASE_URL) {
  const pgModule = await import('pg');
  Pool = pgModule.default.Pool;
}
const SESSION_SECRET = process.env.SESSION_SECRET || randomBytes(32).toString('hex');
const MAX_BODY_BYTES = 28 * 1024 * 1024;
const MAX_SYNC_BYTES = 3 * 1024 * 1024;
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const AUTH_WINDOW_MS = 15 * 60 * 1000;
const AUTH_MAX_ATTEMPTS = 15;

const pool = DATABASE_URL
  ? new Pool({
      connectionString: DATABASE_URL,
      ssl: /[?&]sslmode=require(?:&|$)/i.test(DATABASE_URL) || process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
      max: 8
    })
  : null;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

const authAttempts = new Map();

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'same-origin'
  });
  res.end(JSON.stringify(payload));
}

async function readJson(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const error = new Error('Request is too large');
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    const error = new Error('Invalid JSON body');
    error.statusCode = 400;
    throw error;
  }
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function publicUser(row) {
  return { id: row.id, email: row.email, name: row.name, createdAt: row.created_at || row.createdAt };
}

async function hashPassword(password) {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, 64);
  return `scrypt:${salt.toString('base64url')}:${Buffer.from(derived).toString('base64url')}`;
}

async function verifyPassword(password, stored) {
  const [scheme, saltText, hashText] = String(stored || '').split(':');
  if (scheme !== 'scrypt' || !saltText || !hashText) return false;
  const expected = Buffer.from(hashText, 'base64url');
  const derived = Buffer.from(await scrypt(password, Buffer.from(saltText, 'base64url'), expected.length));
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}

function signSession(user) {
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    sub: user.id,
    email: user.email,
    name: user.name,
    iat: now,
    exp: now + SESSION_TTL_SECONDS
  })).toString('base64url');
  const signature = createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verifySession(token) {
  try {
    const [payload, signature] = String(token || '').split('.');
    if (!payload || !signature) return null;
    const expected = createHmac('sha256', SESSION_SECRET).update(payload).digest();
    const actual = Buffer.from(signature, 'base64url');
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!parsed.sub || !parsed.exp || parsed.exp <= Math.floor(Date.now() / 1000)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function bearerToken(req) {
  const auth = String(req.headers.authorization || '');
  return auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
}

async function authenticatedUser(req) {
  if (!pool) return null;
  const session = verifySession(bearerToken(req));
  if (!session) return null;
  const result = await pool.query('SELECT id, email, name, created_at FROM users WHERE id = $1', [session.sub]);
  return result.rows[0] || null;
}

async function requireUser(req, res) {
  if (!pool) {
    sendJson(res, 503, { error: 'User accounts are not configured on this server.' });
    return null;
  }
  const user = await authenticatedUser(req);
  if (!user) {
    sendJson(res, 401, { error: 'Sign in is required.' });
    return null;
  }
  return user;
}

function clientIp(req) {
  return String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
}

function allowAuthAttempt(req) {
  const key = clientIp(req);
  const now = Date.now();
  const recent = (authAttempts.get(key) || []).filter(timestamp => now - timestamp < AUTH_WINDOW_MS);
  if (recent.length >= AUTH_MAX_ATTEMPTS) return false;
  recent.push(now);
  authAttempts.set(key, recent);
  return true;
}

function sanitizeCloudState(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const state = JSON.parse(JSON.stringify(value));
  state.photoCheckins = [];
  const encoded = JSON.stringify(state);
  if (Buffer.byteLength(encoded) > MAX_SYNC_BYTES) {
    const error = new Error('Workout data is too large to sync in one request. Export a backup and remove unnecessary coach history.');
    error.statusCode = 413;
    throw error;
  }
  return state;
}

async function initDatabase() {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY,
      email text UNIQUE NOT NULL,
      password_hash text NOT NULL,
      name text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS user_states (
      user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      state jsonb NOT NULL DEFAULT '{}'::jsonb,
      revision integer NOT NULL DEFAULT 0,
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);
}

async function handleAccountStatus(req, res) {
  if (!pool) return sendJson(res, 200, { available: false, user: null });
  const user = await authenticatedUser(req);
  sendJson(res, 200, { available: true, user: user ? publicUser(user) : null });
}

async function handleSignup(req, res) {
  if (!pool) return sendJson(res, 503, { error: 'User accounts are not configured on this server.' });
  if (!allowAuthAttempt(req)) return sendJson(res, 429, { error: 'Too many sign-in attempts. Try again later.' });
  const body = await readJson(req);
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');
  const name = String(body.name || '').trim().slice(0, 80) || 'Athlete';
  if (!validEmail(email)) return sendJson(res, 400, { error: 'Enter a valid email address.' });
  if (password.length < 8 || password.length > 128) return sendJson(res, 400, { error: 'Password must be 8 to 128 characters.' });
  const initialState = sanitizeCloudState(body.state || {});
  const passwordHash = await hashPassword(password);
  const user = { id: randomUUID(), email, name };
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('INSERT INTO users (id, email, password_hash, name) VALUES ($1, $2, $3, $4)', [user.id, user.email, passwordHash, user.name]);
    await client.query('INSERT INTO user_states (user_id, state, revision) VALUES ($1, $2::jsonb, 0)', [user.id, JSON.stringify(initialState)]);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    if (error.code === '23505') return sendJson(res, 409, { error: 'An account with that email already exists.' });
    throw error;
  } finally {
    client.release();
  }
  const created = { ...user, created_at: new Date().toISOString() };
  sendJson(res, 201, { token: signSession(user), user: publicUser(created), state: initialState, revision: 0 });
}

async function handleLogin(req, res) {
  if (!pool) return sendJson(res, 503, { error: 'User accounts are not configured on this server.' });
  if (!allowAuthAttempt(req)) return sendJson(res, 429, { error: 'Too many sign-in attempts. Try again later.' });
  const body = await readJson(req);
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');
  const result = await pool.query(`
    SELECT u.id, u.email, u.name, u.password_hash, u.created_at, s.state, s.revision, s.updated_at
    FROM users u
    LEFT JOIN user_states s ON s.user_id = u.id
    WHERE u.email = $1
  `, [email]);
  const row = result.rows[0];
  if (!row || !(await verifyPassword(password, row.password_hash))) {
    return sendJson(res, 401, { error: 'Email or password is incorrect.' });
  }
  sendJson(res, 200, {
    token: signSession(row),
    user: publicUser(row),
    state: row.state || {},
    revision: Number(row.revision || 0),
    updatedAt: row.updated_at || null
  });
}

async function handleGetSync(req, res) {
  const user = await requireUser(req, res);
  if (!user) return;
  const result = await pool.query('SELECT state, revision, updated_at FROM user_states WHERE user_id = $1', [user.id]);
  const row = result.rows[0];
  sendJson(res, 200, { state: row?.state || {}, revision: Number(row?.revision || 0), updatedAt: row?.updated_at || null });
}

async function handlePutSync(req, res) {
  const user = await requireUser(req, res);
  if (!user) return;
  const body = await readJson(req);
  const nextState = sanitizeCloudState(body.state);
  const revision = Number.isInteger(body.revision) ? body.revision : null;
  if (revision == null || revision < 0) return sendJson(res, 400, { error: 'A valid sync revision is required.' });
  const result = await pool.query(`
    UPDATE user_states
    SET state = $2::jsonb, revision = revision + 1, updated_at = now()
    WHERE user_id = $1 AND revision = $3
    RETURNING revision, updated_at
  `, [user.id, JSON.stringify(nextState), revision]);
  if (!result.rowCount) {
    const current = await pool.query('SELECT revision, updated_at FROM user_states WHERE user_id = $1', [user.id]);
    return sendJson(res, 409, {
      error: 'This account changed on another device. Reload cloud data before syncing this device.',
      revision: Number(current.rows[0]?.revision || 0),
      updatedAt: current.rows[0]?.updated_at || null
    });
  }
  sendJson(res, 200, { revision: Number(result.rows[0].revision), updatedAt: result.rows[0].updated_at });
}

async function handleDeleteAccount(req, res) {
  const user = await requireUser(req, res);
  if (!user) return;
  const body = await readJson(req);
  const password = String(body.password || '');
  const result = await pool.query('SELECT password_hash FROM users WHERE id = $1', [user.id]);
  if (!result.rows[0] || !(await verifyPassword(password, result.rows[0].password_hash))) {
    return sendJson(res, 401, { error: 'Password is incorrect.' });
  }
  await pool.query('DELETE FROM users WHERE id = $1', [user.id]);
  sendJson(res, 200, { deleted: true });
}

function extractResponseText(payload) {
  if (typeof payload.output_text === 'string' && payload.output_text.trim()) return payload.output_text.trim();
  return (payload.output || [])
    .flatMap(item => item.content || [])
    .filter(item => item.type === 'output_text' && typeof item.text === 'string')
    .map(item => item.text)
    .join('\n')
    .trim();
}

async function callOpenAI({ instructions, content, maxOutputTokens = 900 }) {
  if (!OPENAI_API_KEY) {
    const error = new Error('OPENAI_API_KEY is not configured');
    error.statusCode = 503;
    throw error;
  }
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: OPENAI_MODEL, instructions, input: [{ role: 'user', content }], max_output_tokens: maxOutputTokens })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload?.error?.message || `OpenAI request failed with status ${response.status}`);
    error.statusCode = response.status;
    throw error;
  }
  const text = extractResponseText(payload);
  if (!text) throw new Error('The model returned no text');
  return text;
}

function validateImageDataUrl(value) {
  return typeof value === 'string' && /^data:image\/(jpeg|png|webp);base64,/i.test(value) && value.length <= 9_000_000;
}

async function ensureAiAccess(req, res) {
  if (!pool) return true;
  const user = await requireUser(req, res);
  return Boolean(user);
}

async function handleCoach(req, res) {
  if (!(await ensureAiAccess(req, res))) return;
  const body = await readJson(req);
  const question = String(body.question || '').trim().slice(0, 2500);
  if (!question) return sendJson(res, 400, { error: 'A question is required.' });
  const contextText = JSON.stringify(body.context || {}).slice(0, 220_000);
  const answer = await callOpenAI({
    instructions: [
      'You are SetFlow Coach, a practical strength-and-conditioning assistant inside a workout tracker.',
      'Use only the supplied training log context and the user question. Clearly distinguish logged facts from inferences.',
      'Prioritize sustainable progressive overload, technique consistency, fatigue management, adherence and recovery.',
      'Do not diagnose injuries, prescribe rehabilitation, provide eating-disorder coaching, or make medical claims.',
      'For pain, neurological symptoms, fainting, chest pain or concerning symptoms, recommend stopping and seeking qualified care.',
      'Avoid extreme plans, shame, appearance judgments, guarantees and false precision.',
      'Give a direct answer first, followed by 2 to 5 concrete next steps. Keep the response under 450 words.'
    ].join(' '),
    content: [{ type: 'input_text', text: `User question:\n${question}\n\nSetFlow training context (JSON):\n${contextText}` }],
    maxOutputTokens: 850
  });
  sendJson(res, 200, { answer, model: OPENAI_MODEL });
}

async function handleProgressPhotos(req, res) {
  if (!(await ensureAiAccess(req, res))) return;
  const body = await readJson(req);
  const current = Array.isArray(body.photos) ? body.photos.slice(0, 3) : [];
  const baseline = Array.isArray(body.baselinePhotos) ? body.baselinePhotos.slice(0, 3) : [];
  if (!current.length || !current.every(photo => validateImageDataUrl(photo.dataUrl))) {
    return sendJson(res, 400, { error: 'One to three supported progress photos are required.' });
  }
  if (baseline.some(photo => !validateImageDataUrl(photo.dataUrl))) {
    return sendJson(res, 400, { error: 'A baseline photo is invalid or too large.' });
  }

  const content = [{
    type: 'input_text',
    text: [
      `Current check-in date: ${String(body.date || 'not supplied').slice(0, 40)}`,
      `Previous check-in date: ${String(body.baselineDate || 'none').slice(0, 40)}`,
      `User context note: ${String(body.note || 'none').slice(0, 1200)}`,
      `Training context: ${JSON.stringify(body.trainingContext || {}).slice(0, 90_000)}`,
      '',
      'The images that follow are labeled in text immediately before each image.'
    ].join('\n')
  }];

  for (const photo of baseline) {
    content.push({ type: 'input_text', text: `PREVIOUS check-in — ${String(photo.view || 'unspecified')} view` });
    content.push({ type: 'input_image', image_url: photo.dataUrl });
  }
  for (const photo of current) {
    content.push({ type: 'input_text', text: `CURRENT check-in — ${String(photo.view || 'unspecified')} view` });
    content.push({ type: 'input_image', image_url: photo.dataUrl });
  }

  const feedback = await callOpenAI({
    instructions: [
      'You are the visual progress-check-in component of SetFlow, a fitness tracking app.',
      'The user voluntarily supplied fitness progress photos for private feedback.',
      'Be neutral, respectful, non-sexual and appearance-safe. Do not identify the person or infer sensitive traits.',
      'Never estimate body-fat percentage, health status, diagnosis, eating-disorder status, fertility, hormone levels, drug use or exact measurements from photos.',
      'Do not score attractiveness, shame the user, or encourage extreme dieting or training.',
      'First assess photo comparability: lighting, camera height, distance, pose, clothing, sharpness and view matching.',
      'When previous and current matching views are present, describe only clearly visible, non-medical differences with uncertainty language. Say when conditions prevent a fair comparison.',
      'You may discuss neutral training-relevant observations such as posture consistency, apparent muscular definition, symmetry of posing and whether visual changes align with the supplied log trends, but do not claim causation.',
      'End with 3 practical recommendations for the next check-in or training-log focus. Keep the response under 500 words.'
    ].join(' '),
    content,
    maxOutputTokens: 950
  });
  sendJson(res, 200, { feedback, model: OPENAI_MODEL });
}

async function serveStatic(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/') pathname = '/index.html';
  const normalized = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.resolve(ROOT, `.${normalized}`);
  if (!filePath.startsWith(ROOT)) return sendJson(res, 403, { error: 'Forbidden' });

  try {
    const fileStat = await stat(filePath);
    const target = fileStat.isDirectory() ? path.join(filePath, 'index.html') : filePath;
    const data = await readFile(target);
    const ext = path.extname(target).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'same-origin',
      'Permissions-Policy': 'camera=(self)'
    });
    if (req.method === 'HEAD') return res.end();
    res.end(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      const index = await readFile(path.join(ROOT, 'index.html'));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
      res.end(index);
      return;
    }
    throw error;
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

    if (req.method === 'GET' && url.pathname === '/api/status') {
      return sendJson(res, 200, {
        enabled: Boolean(OPENAI_API_KEY),
        model: OPENAI_API_KEY ? OPENAI_MODEL : '',
        accounts: Boolean(pool)
      });
    }
    if (req.method === 'GET' && url.pathname === '/api/account-status') return await handleAccountStatus(req, res);
    if (req.method === 'POST' && url.pathname === '/api/auth/signup') return await handleSignup(req, res);
    if (req.method === 'POST' && url.pathname === '/api/auth/login') return await handleLogin(req, res);
    if (req.method === 'GET' && url.pathname === '/api/sync') return await handleGetSync(req, res);
    if (req.method === 'PUT' && url.pathname === '/api/sync') return await handlePutSync(req, res);
    if (req.method === 'DELETE' && url.pathname === '/api/account') return await handleDeleteAccount(req, res);
    if (req.method === 'POST' && url.pathname === '/api/coach') return await handleCoach(req, res);
    if (req.method === 'POST' && url.pathname === '/api/analyze-progress') return await handleProgressPhotos(req, res);
    if (url.pathname.startsWith('/api/')) return sendJson(res, 404, { error: 'API route not found.' });
    if (!['GET', 'HEAD'].includes(req.method || 'GET')) return sendJson(res, 405, { error: 'Method not allowed.' });
    return await serveStatic(req, res, url);
  } catch (error) {
    console.error(error);
    sendJson(res, error.statusCode || 500, { error: error.message || 'Unexpected server error.' });
  }
});

try {
  await initDatabase();
} catch (error) {
  console.error('Database initialization failed:', error);
  process.exit(1);
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`SetFlow is running at http://localhost:${PORT}`);
  console.log(pool ? 'User accounts and cloud sync enabled.' : 'User accounts disabled; add DATABASE_URL to enable multi-user sync.');
  console.log(OPENAI_API_KEY ? `Connected AI enabled with ${OPENAI_MODEL}` : 'Connected AI disabled; local coach mode remains available.');
  if (DATABASE_URL && !process.env.SESSION_SECRET) console.warn('SESSION_SECRET is not set. Sessions will be invalidated whenever the server restarts.');
});
