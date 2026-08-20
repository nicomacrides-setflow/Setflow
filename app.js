'use strict';

const APP_VERSION = 2;
const STORAGE_KEY = 'setflow-state-v1';
const AUTH_STORAGE_KEY = 'setflow-auth-v1';
const GUEST_MODE_KEY = 'setflow-guest-mode-v1';
const PHOTO_DB = 'setflow-photos-v1';
const PHOTO_STORE = 'photos';

const EXERCISES = [
  { id: 'barbell-bench', name: 'Barbell Bench Press', muscle: 'Chest', secondary: ['Triceps', 'Shoulders'], equipment: 'Barbell', pattern: 'Horizontal push', level: 'All', tracking: 'weight_reps', cue: 'Pin your shoulder blades, keep feet planted, and touch the lower chest with control.' },
  { id: 'incline-db-press', name: 'Incline Dumbbell Press', muscle: 'Chest', secondary: ['Shoulders', 'Triceps'], equipment: 'Dumbbells', pattern: 'Incline push', level: 'All', tracking: 'weight_reps', cue: 'Use a low incline, keep wrists stacked, and drive up and slightly inward.' },
  { id: 'push-up', name: 'Push-Up', muscle: 'Chest', secondary: ['Triceps', 'Core'], equipment: 'Bodyweight', pattern: 'Horizontal push', level: 'Beginner', tracking: 'bodyweight_reps', cue: 'Keep a straight line from head to heel and lower your chest between your hands.' },
  { id: 'cable-fly', name: 'Cable Fly', muscle: 'Chest', secondary: ['Shoulders'], equipment: 'Cable', pattern: 'Chest isolation', level: 'All', tracking: 'weight_reps', cue: 'Keep a soft elbow bend and bring your upper arms across your torso without shrugging.' },
  { id: 'dip', name: 'Dip', muscle: 'Chest', secondary: ['Triceps', 'Shoulders'], equipment: 'Bodyweight', pattern: 'Vertical push', level: 'Intermediate', tracking: 'bodyweight_reps', cue: 'Lean slightly forward for chest emphasis and stop before the shoulders roll forward.' },
  { id: 'deadlift', name: 'Conventional Deadlift', muscle: 'Back', secondary: ['Hamstrings', 'Glutes', 'Core'], equipment: 'Barbell', pattern: 'Hinge', level: 'Intermediate', tracking: 'weight_reps', cue: 'Brace before the pull, keep the bar close, and push the floor away.' },
  { id: 'barbell-row', name: 'Barbell Row', muscle: 'Back', secondary: ['Biceps', 'Core'], equipment: 'Barbell', pattern: 'Horizontal pull', level: 'Intermediate', tracking: 'weight_reps', cue: 'Hold a stable hinge, pull toward the lower ribs, and avoid jerking the torso.' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', muscle: 'Back', secondary: ['Biceps'], equipment: 'Cable', pattern: 'Vertical pull', level: 'All', tracking: 'weight_reps', cue: 'Drive elbows toward your pockets and keep your ribs stacked.' },
  { id: 'pull-up', name: 'Pull-Up', muscle: 'Back', secondary: ['Biceps', 'Core'], equipment: 'Bodyweight', pattern: 'Vertical pull', level: 'Intermediate', tracking: 'bodyweight_reps', cue: 'Start from a controlled hang, pull the chest upward, and avoid kicking.' },
  { id: 'seated-row', name: 'Seated Cable Row', muscle: 'Back', secondary: ['Biceps'], equipment: 'Cable', pattern: 'Horizontal pull', level: 'All', tracking: 'weight_reps', cue: 'Stay tall, lead with the elbows, and pause without overextending the lower back.' },
  { id: 'one-arm-row', name: 'One-Arm Dumbbell Row', muscle: 'Back', secondary: ['Biceps'], equipment: 'Dumbbell', pattern: 'Horizontal pull', level: 'All', tracking: 'weight_reps', cue: 'Keep hips square and pull the elbow toward the back pocket.' },
  { id: 'overhead-press', name: 'Overhead Press', muscle: 'Shoulders', secondary: ['Triceps', 'Core'], equipment: 'Barbell', pattern: 'Vertical push', level: 'Intermediate', tracking: 'weight_reps', cue: 'Brace your glutes and trunk, move your head around the bar, and finish stacked.' },
  { id: 'db-shoulder-press', name: 'Dumbbell Shoulder Press', muscle: 'Shoulders', secondary: ['Triceps'], equipment: 'Dumbbells', pattern: 'Vertical push', level: 'All', tracking: 'weight_reps', cue: 'Keep forearms vertical and stop before losing rib position.' },
  { id: 'lateral-raise', name: 'Lateral Raise', muscle: 'Shoulders', secondary: [], equipment: 'Dumbbells', pattern: 'Shoulder isolation', level: 'All', tracking: 'weight_reps', cue: 'Lead with the elbows, raise in the scapular plane, and avoid shrugging.' },
  { id: 'rear-delt-fly', name: 'Rear Delt Fly', muscle: 'Shoulders', secondary: ['Back'], equipment: 'Dumbbells', pattern: 'Shoulder isolation', level: 'All', tracking: 'weight_reps', cue: 'Keep the torso fixed and sweep the arms wide with a soft elbow bend.' },
  { id: 'face-pull', name: 'Face Pull', muscle: 'Shoulders', secondary: ['Back'], equipment: 'Cable', pattern: 'Upper-back pull', level: 'All', tracking: 'weight_reps', cue: 'Pull toward eye level and finish with hands apart without flaring the ribs.' },
  { id: 'back-squat', name: 'Back Squat', muscle: 'Quads', secondary: ['Glutes', 'Core'], equipment: 'Barbell', pattern: 'Squat', level: 'Intermediate', tracking: 'weight_reps', cue: 'Brace before descending, track knees over toes, and keep pressure through the whole foot.' },
  { id: 'front-squat', name: 'Front Squat', muscle: 'Quads', secondary: ['Glutes', 'Core'], equipment: 'Barbell', pattern: 'Squat', level: 'Intermediate', tracking: 'weight_reps', cue: 'Keep elbows high, torso tall, and sit between the hips.' },
  { id: 'goblet-squat', name: 'Goblet Squat', muscle: 'Quads', secondary: ['Glutes', 'Core'], equipment: 'Dumbbell', pattern: 'Squat', level: 'Beginner', tracking: 'weight_reps', cue: 'Hold the weight close, sit between your knees, and stay balanced over mid-foot.' },
  { id: 'leg-press', name: 'Leg Press', muscle: 'Quads', secondary: ['Glutes'], equipment: 'Machine', pattern: 'Squat', level: 'All', tracking: 'weight_reps', cue: 'Use a controlled depth that keeps the pelvis stable and drive evenly through both feet.' },
  { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', muscle: 'Quads', secondary: ['Glutes'], equipment: 'Dumbbells', pattern: 'Single-leg squat', level: 'Intermediate', tracking: 'weight_reps', cue: 'Use a stable stance, lower straight down, and keep the front foot fully planted.' },
  { id: 'walking-lunge', name: 'Walking Lunge', muscle: 'Quads', secondary: ['Glutes'], equipment: 'Dumbbells', pattern: 'Single-leg squat', level: 'All', tracking: 'weight_reps', cue: 'Take controlled steps, keep hips level, and push through the whole lead foot.' },
  { id: 'leg-extension', name: 'Leg Extension', muscle: 'Quads', secondary: [], equipment: 'Machine', pattern: 'Knee extension', level: 'All', tracking: 'weight_reps', cue: 'Align the knee with the machine axis and squeeze without slamming into lockout.' },
  { id: 'romanian-deadlift', name: 'Romanian Deadlift', muscle: 'Hamstrings', secondary: ['Glutes', 'Back'], equipment: 'Barbell', pattern: 'Hinge', level: 'All', tracking: 'weight_reps', cue: 'Push hips back, keep the bar close, and stop when the hamstrings limit the hinge.' },
  { id: 'leg-curl', name: 'Leg Curl', muscle: 'Hamstrings', secondary: [], equipment: 'Machine', pattern: 'Knee flexion', level: 'All', tracking: 'weight_reps', cue: 'Keep hips anchored and control both the squeeze and return.' },
  { id: 'hip-thrust', name: 'Hip Thrust', muscle: 'Glutes', secondary: ['Hamstrings'], equipment: 'Barbell', pattern: 'Hip extension', level: 'All', tracking: 'weight_reps', cue: 'Finish with ribs down and pelvis neutral rather than arching the lower back.' },
  { id: 'calf-raise', name: 'Standing Calf Raise', muscle: 'Calves', secondary: [], equipment: 'Machine', pattern: 'Plantar flexion', level: 'All', tracking: 'weight_reps', cue: 'Use a full stretch, pause at the top, and keep pressure through the big toe.' },
  { id: 'barbell-curl', name: 'Barbell Curl', muscle: 'Biceps', secondary: ['Forearms'], equipment: 'Barbell', pattern: 'Elbow flexion', level: 'All', tracking: 'weight_reps', cue: 'Keep elbows near your sides and avoid using hip drive.' },
  { id: 'incline-curl', name: 'Incline Dumbbell Curl', muscle: 'Biceps', secondary: [], equipment: 'Dumbbells', pattern: 'Elbow flexion', level: 'All', tracking: 'weight_reps', cue: 'Let the arms hang, keep shoulders back, and curl without moving the upper arm.' },
  { id: 'hammer-curl', name: 'Hammer Curl', muscle: 'Biceps', secondary: ['Forearms'], equipment: 'Dumbbells', pattern: 'Elbow flexion', level: 'All', tracking: 'weight_reps', cue: 'Keep a neutral wrist and finish without swinging.' },
  { id: 'triceps-pushdown', name: 'Triceps Pushdown', muscle: 'Triceps', secondary: [], equipment: 'Cable', pattern: 'Elbow extension', level: 'All', tracking: 'weight_reps', cue: 'Pin elbows near your ribs and fully extend without rolling the shoulders forward.' },
  { id: 'skull-crusher', name: 'Skull Crusher', muscle: 'Triceps', secondary: [], equipment: 'EZ Bar', pattern: 'Elbow extension', level: 'Intermediate', tracking: 'weight_reps', cue: 'Keep upper arms angled back and lower behind the forehead with control.' },
  { id: 'overhead-triceps', name: 'Overhead Triceps Extension', muscle: 'Triceps', secondary: [], equipment: 'Cable', pattern: 'Elbow extension', level: 'All', tracking: 'weight_reps', cue: 'Keep ribs down and elbows pointed forward while reaching a full stretch.' },
  { id: 'plank', name: 'Plank', muscle: 'Core', secondary: ['Glutes'], equipment: 'Bodyweight', pattern: 'Anti-extension', level: 'Beginner', tracking: 'time', cue: 'Squeeze glutes, pull ribs down, and maintain a straight line without holding your breath.' },
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', muscle: 'Core', secondary: ['Hip Flexors'], equipment: 'Bodyweight', pattern: 'Trunk flexion', level: 'Intermediate', tracking: 'bodyweight_reps', cue: 'Curl the pelvis upward and avoid swinging through the bottom.' },
  { id: 'cable-crunch', name: 'Cable Crunch', muscle: 'Core', secondary: [], equipment: 'Cable', pattern: 'Trunk flexion', level: 'All', tracking: 'weight_reps', cue: 'Move through the spine rather than sitting the hips back.' },
  { id: 'ab-wheel', name: 'Ab Wheel Rollout', muscle: 'Core', secondary: ['Lats'], equipment: 'Ab Wheel', pattern: 'Anti-extension', level: 'Intermediate', tracking: 'bodyweight_reps', cue: 'Keep the pelvis tucked and stop before the lower back extends.' },
  { id: 'farmer-carry', name: 'Farmer Carry', muscle: 'Core', secondary: ['Forearms', 'Traps'], equipment: 'Dumbbells', pattern: 'Loaded carry', level: 'All', tracking: 'time_distance', cue: 'Walk tall with level hips, quiet steps, and a firm grip.' },
  { id: 'treadmill-run', name: 'Treadmill Run', muscle: 'Cardio', secondary: ['Legs'], equipment: 'Treadmill', pattern: 'Cardio', level: 'All', tracking: 'time_distance', cue: 'Use a pace you can sustain, land under your center of mass, and increase gradually.' },
  { id: 'stationary-bike', name: 'Stationary Bike', muscle: 'Cardio', secondary: ['Legs'], equipment: 'Bike', pattern: 'Cardio', level: 'All', tracking: 'time_distance', cue: 'Set the seat for a slight knee bend and keep a smooth, controlled cadence.' },
  { id: 'rowing-machine', name: 'Rowing Machine', muscle: 'Cardio', secondary: ['Back', 'Legs'], equipment: 'Rower', pattern: 'Cardio', level: 'All', tracking: 'time_distance', cue: 'Drive with legs first, then lean and pull; reverse the order on the return.' },
  { id: 'stair-climber', name: 'Stair Climber', muscle: 'Cardio', secondary: ['Glutes', 'Quads'], equipment: 'Machine', pattern: 'Cardio', level: 'All', tracking: 'time', cue: 'Stand tall, use the rails lightly, and keep a steady step rhythm.' }
];

const DEFAULT_TEMPLATES = [
  { id: 'tpl-push', name: 'Push', description: 'Chest, shoulders and triceps', level: 'All', exerciseIds: ['barbell-bench', 'incline-db-press', 'overhead-press', 'lateral-raise', 'triceps-pushdown'] },
  { id: 'tpl-pull', name: 'Pull', description: 'Back, rear delts and biceps', level: 'All', exerciseIds: ['deadlift', 'lat-pulldown', 'barbell-row', 'face-pull', 'hammer-curl'] },
  { id: 'tpl-legs', name: 'Legs', description: 'Quads, hamstrings, glutes and calves', level: 'All', exerciseIds: ['back-squat', 'romanian-deadlift', 'leg-press', 'leg-curl', 'calf-raise'] },
  { id: 'tpl-full', name: 'Full Body', description: 'Balanced three-day foundation', level: 'Beginner', exerciseIds: ['goblet-squat', 'barbell-bench', 'lat-pulldown', 'romanian-deadlift', 'plank'] }
];

const ICONS = {
  logo: '<svg viewBox="0 0 24 24" fill="none"><path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12" stroke-width="2" stroke-linecap="round"/></svg>',
  dashboard: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>',
  dumbbell: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" stroke-linecap="round"/></svg>',
  history: '<svg viewBox="0 0 24 24" fill="none"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  progress: '<svg viewBox="0 0 24 24" fill="none"><path d="m4 17 5-5 4 3 7-8"/><path d="M15 7h5v5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" fill="none"><path d="m12 3 1.2 3.3L16.5 7.5l-3.3 1.2L12 12l-1.2-3.3-3.3-1.2 3.3-1.2L12 3ZM18.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2ZM5.5 13l.8 2.2 2.2.8-2.2.8L5.5 19l-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" stroke-linejoin="round"/></svg>',
  library: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 4h6v16H4zM14 4h6v16h-6z"/><path d="M7 8h0M17 8h0" stroke-linecap="round"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21h-4v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3.1 14H3v-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.5V3h4v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1v4h-.1a1.7 1.7 0 0 0-1.5 1Z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none"><path d="m8 5 11 7-11 7V5Z" stroke-linejoin="round"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none"><path d="m5 12 4 4L19 6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none"><path d="m6 6 12 12M18 6 6 18" stroke-linecap="round"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none"><path d="m4 16-1 5 5-1L19 9l-4-4L4 16Z"/><path d="m13 7 4 4"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4" stroke-linecap="round"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none"><path d="m9 6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" fill="none"><path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" stroke-linecap="round"/></svg>',
  flame: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 22c4 0 7-2.8 7-7.1 0-3.4-2.1-6.4-5.7-9.2.2 2.5-.6 4.3-2.1 5.3.1-3.8-1.7-6.5-4.4-9C7 6 5 8.7 5 13.2 5 18 8 22 12 22Z" stroke-linejoin="round"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none"><path d="M8 4h8v4a4 4 0 0 1-8 0V4Z"/><path d="M8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 12v5M8 21h8M9 17h6" stroke-linecap="round"/></svg>',
  scale: '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 9a4 4 0 0 1 8 0M12 9l2-2" stroke-linecap="round"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 7h3l2-3h6l2 3h3v13H4V7Z" stroke-linejoin="round"/><circle cx="12" cy="13" r="4"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 16V4M7 9l5-5 5 5M5 20h14" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 4v12M7 11l5 5 5-5M5 20h14" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none"><path d="M20 15.5A8 8 0 0 1 8.5 4 8 8 0 1 0 20 15.5Z" stroke-linejoin="round"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke-linecap="round"/></svg>',
  more: '<svg viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/></svg>',
  arrowUp: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 19V5M7 10l5-5 5 5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowDown: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M7 14l5 5 5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01" stroke-linecap="round"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
  message: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 5h16v12H8l-4 4V5Z" stroke-linejoin="round"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none"><path d="M20 7v5h-5M4 17v-5h5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 7a7 7 0 0 1 11.5 2M17 17A7 7 0 0 1 5.5 15" stroke-linecap="round"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18" stroke-linecap="round"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round"/></svg>'
};

const icon = (name, className = '') => `<span class="icon ${className}" aria-hidden="true">${ICONS[name] || ICONS.info}</span>`;
const uid = (prefix = 'id') => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const sum = arr => arr.reduce((acc, value) => acc + (Number(value) || 0), 0);
const avg = arr => arr.length ? sum(arr) / arr.length : 0;
const round = (n, digits = 1) => Number(Number(n || 0).toFixed(digits));
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const safeJsonClone = value => JSON.parse(JSON.stringify(value));

function toDate(value) {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function startOfDay(value = new Date()) {
  const date = toDate(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(value = new Date()) {
  const date = startOfDay(value);
  const day = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - day);
  return date;
}

function addDays(value, days) {
  const date = toDate(value);
  date.setDate(date.getDate() + days);
  return date;
}

function daysBetween(a, b) {
  return Math.round((startOfDay(b) - startOfDay(a)) / 86400000);
}

function isWithinDays(value, days, from = new Date()) {
  const time = toDate(value).getTime();
  return time >= addDays(from, -days).getTime() && time <= from.getTime() + 86400000;
}

function formatDate(value, options = { month: 'short', day: 'numeric' }) {
  return new Intl.DateTimeFormat(undefined, options).format(toDate(value));
}

function formatDateLong(value) {
  return formatDate(value, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatDuration(seconds) {
  const total = Math.max(0, Math.round(Number(seconds) || 0));
  const hours = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  return hours > 0 ? `${hours}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}` : `${mins}:${String(secs).padStart(2, '0')}`;
}

function formatCompactDuration(seconds) {
  const mins = Math.max(0, Math.round((Number(seconds) || 0) / 60));
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const rest = mins % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

function formatNumber(value, maxFraction = 0) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: maxFraction }).format(Number(value) || 0);
}

function kgToDisplay(kg) {
  return state.profile.units === 'lb' ? Number(kg || 0) * 2.2046226218 : Number(kg || 0);
}

function displayToKg(value) {
  return state.profile.units === 'lb' ? Number(value || 0) / 2.2046226218 : Number(value || 0);
}

function cmToDisplay(cm) {
  return state.profile.units === 'lb' ? Number(cm || 0) / 2.54 : Number(cm || 0);
}

function displayToCm(value) {
  return state.profile.units === 'lb' ? Number(value || 0) * 2.54 : Number(value || 0);
}

function weightUnit() {
  return state.profile.units === 'lb' ? 'lb' : 'kg';
}

function distanceUnit() {
  return state.profile.units === 'lb' ? 'mi' : 'km';
}

function kmToDisplay(km) {
  return state.profile.units === 'lb' ? Number(km || 0) * 0.621371 : Number(km || 0);
}

function displayToKm(value) {
  return state.profile.units === 'lb' ? Number(value || 0) / 0.621371 : Number(value || 0);
}

function volumeForWorkout(workout) {
  return sum((workout.exercises || []).flatMap(exercise => (exercise.sets || []).filter(set => set.done).map(set => (Number(set.weightKg) || 0) * (Number(set.reps) || 0))));
}

function completedSets(workout) {
  return sum((workout.exercises || []).map(exercise => (exercise.sets || []).filter(set => set.done).length));
}

function completedReps(workout) {
  return sum((workout.exercises || []).flatMap(exercise => (exercise.sets || []).filter(set => set.done).map(set => Number(set.reps) || 0)));
}

function estimatedOneRepMax(weightKg, reps) {
  const w = Number(weightKg) || 0;
  const r = Number(reps) || 0;
  if (!w || !r) return 0;
  if (r === 1) return w;
  return w * (1 + r / 30);
}

function bestSetForExercise(workouts, exerciseId) {
  let best = null;
  for (const workout of workouts) {
    for (const exercise of workout.exercises || []) {
      if (exercise.exerciseId !== exerciseId) continue;
      for (const set of exercise.sets || []) {
        if (!set.done) continue;
        const e1rm = estimatedOneRepMax(set.weightKg, set.reps);
        if (!best || e1rm > best.e1rm) best = { ...set, e1rm, date: workout.endedAt || workout.startedAt, workoutId: workout.id };
      }
    }
  }
  return best;
}

function defaultSet(tracking = 'weight_reps', copyFrom = null) {
  const base = {
    id: uid('set'),
    type: 'working',
    weightKg: copyFrom?.weightKg || 0,
    reps: copyFrom?.reps || (tracking === 'bodyweight_reps' ? 8 : 10),
    durationSec: copyFrom?.durationSec || (tracking === 'time' ? 60 : tracking === 'time_distance' ? 1200 : 0),
    distanceKm: copyFrom?.distanceKm || 0,
    rpe: copyFrom?.rpe || 7,
    done: false
  };
  return base;
}

function createWorkoutExercise(exerciseId, previousWorkouts = state.workouts) {
  const exercise = EXERCISES.find(item => item.id === exerciseId);
  if (!exercise) return null;
  const previous = [...previousWorkouts].reverse().flatMap(workout => workout.exercises || []).find(item => item.exerciseId === exerciseId);
  const previousWorking = previous?.sets?.filter(set => set.type !== 'warmup') || [];
  const sets = Array.from({ length: 3 }, (_, index) => defaultSet(exercise.tracking, previousWorking[index] || previousWorking.at(-1)));
  return {
    id: uid('we'),
    exerciseId: exercise.id,
    name: exercise.name,
    muscle: exercise.muscle,
    tracking: exercise.tracking,
    notes: '',
    sets
  };
}

function createDefaultState() {
  return {
    version: APP_VERSION,
    onboarded: false,
    profile: {
      name: 'Athlete',
      experience: 'beginner',
      goal: 'build-muscle',
      units: 'lb',
      bodyWeightKg: 0,
      weeklyGoal: 4
    },
    settings: {
      theme: 'dark',
      restTimerSec: 90,
      autoRestTimer: true,
      sounds: true,
      showRpe: true
    },
    templates: safeJsonClone(DEFAULT_TEMPLATES),
    workouts: [],
    bodyMetrics: [],
    photoCheckins: [],
    activeWorkout: null,
    coachMessages: [
      { id: uid('msg'), role: 'assistant', text: 'I am your SetFlow coach. Log a few sessions and I will turn your volume, effort, consistency, PRs and recovery signals into practical next steps.', createdAt: new Date().toISOString() }
    ]
  };
}

function loadStoredSession() {
  try {
    const session = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
    return session && session.token && session.user?.id ? session : null;
  } catch {
    return null;
  }
}

const cachedSession = loadStoredSession();
let auth = {
  initializing: true,
  available: Boolean(cachedSession),
  guestMode: localStorage.getItem(GUEST_MODE_KEY) === '1',
  user: cachedSession?.user || null,
  token: cachedSession?.token || '',
  revision: Number(cachedSession?.revision || 0),
  syncStatus: cachedSession ? 'offline' : 'local',
  lastSyncedAt: cachedSession?.lastSyncedAt || ''
};
let cloudSyncTimer = null;

function storageKeyForUser(user = auth.user) {
  return user?.id ? `setflow-state-user-${user.id}` : STORAGE_KEY;
}

function currentPhotoOwner() {
  return auth.user?.id || 'guest';
}

function loadState(storageKey = storageKeyForUser()) {
  const fallback = createDefaultState();
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (!stored || typeof stored !== 'object') return fallback;
    return {
      ...fallback,
      ...stored,
      profile: { ...fallback.profile, ...(stored.profile || {}) },
      settings: { ...fallback.settings, ...(stored.settings || {}) },
      templates: Array.isArray(stored.templates) && stored.templates.length ? stored.templates : fallback.templates,
      workouts: Array.isArray(stored.workouts) ? stored.workouts : [],
      bodyMetrics: Array.isArray(stored.bodyMetrics) ? stored.bodyMetrics : [],
      photoCheckins: Array.isArray(stored.photoCheckins) ? stored.photoCheckins : [],
      coachMessages: Array.isArray(stored.coachMessages) && stored.coachMessages.length ? stored.coachMessages : fallback.coachMessages
    };
  } catch (error) {
    console.warn('Could not load SetFlow state', error);
    return fallback;
  }
}

let state = loadState();
let ui = {
  onboardingStep: 1,
  authMode: 'signin',
  onboardingDraft: safeJsonClone(state.profile),
  route: (location.hash || '#/dashboard').replace('#/', '') || 'dashboard',
  historySearch: '',
  librarySearch: '',
  libraryMuscle: 'All',
  progressMetric: 'volume',
  coachTab: 'insights',
  pendingPhotos: [],
  photos: [],
  photoAnalysis: '',
  photoDraft: { date: new Date().toISOString().slice(0, 10), weight: '', note: '' },
  aiOnline: false,
  aiModel: '',
  activeTimerId: null,
  restTimer: null,
  restInterval: null,
  modalOpen: false
};

function saveState(skipSync = false) {
  try {
    state.version = APP_VERSION;
    localStorage.setItem(storageKeyForUser(), JSON.stringify(state));
    if (!skipSync) scheduleCloudSync();
  } catch (error) {
    console.error('Could not save SetFlow state', error);
    toast('Storage is full', 'Try exporting a backup and removing old photo check-ins.', 'error');
  }
}

function applyTheme() {
  document.documentElement.dataset.theme = state.settings.theme;
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.content = state.settings.theme === 'light' ? '#f3f5f1' : '#0b0d10';
}

function openPhotoDb() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) return reject(new Error('IndexedDB unavailable'));
    const request = indexedDB.open(PHOTO_DB, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PHOTO_STORE)) db.createObjectStore(PHOTO_STORE, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function dbPutPhoto(record) {
  const db = await openPhotoDb();
  const ownedRecord = { ...record, ownerKey: currentPhotoOwner() };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, 'readwrite');
    tx.objectStore(PHOTO_STORE).put(ownedRecord);
    tx.oncomplete = () => resolve(ownedRecord);
    tx.onerror = () => reject(tx.error);
  });
}

async function dbGetPhotos() {
  try {
    const db = await openPhotoDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(PHOTO_STORE, 'readonly');
      const request = tx.objectStore(PHOTO_STORE).getAll();
      request.onsuccess = () => resolve((request.result || []).filter(record => (record.ownerKey || 'guest') === currentPhotoOwner()));
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('Photo database unavailable', error);
    return [];
  }
}

async function dbDeletePhoto(id) {
  const db = await openPhotoDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, 'readwrite');
    tx.objectStore(PHOTO_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function dbClearPhotos() {
  const db = await openPhotoDb();
  const ownerKey = currentPhotoOwner();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, 'readwrite');
    const store = tx.objectStore(PHOTO_STORE);
    const request = store.openCursor();
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) return;
      if ((cursor.value.ownerKey || 'guest') === ownerKey) cursor.delete();
      cursor.continue();
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function dbReassignPhotos(fromOwner, toOwner) {
  if (!fromOwner || !toOwner || fromOwner === toOwner) return;
  const db = await openPhotoDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, 'readwrite');
    const store = tx.objectStore(PHOTO_STORE);
    const request = store.openCursor();
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) return;
      const owner = cursor.value.ownerKey || 'guest';
      if (owner === fromOwner) cursor.update({ ...cursor.value, ownerKey: toOwner });
      cursor.continue();
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function refreshPhotoCache() {
  for (const photo of ui.photos) {
    if (photo.url?.startsWith('blob:')) URL.revokeObjectURL(photo.url);
  }
  const records = await dbGetPhotos();
  ui.photos = records.map(record => ({ ...record, url: record.blob ? URL.createObjectURL(record.blob) : record.dataUrl }));
}

function fileToDataUrl(fileOrBlob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(fileOrBlob);
  });
}

async function compressPhoto(file, maxSide = 1600, quality = 0.84) {
  const originalUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = originalUrl;
    });
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(image, 0, 0, width, height);
    const stats = analyzeImageQuality(ctx, width, height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
    return { blob: blob || file, width, height, stats, previewUrl: URL.createObjectURL(blob || file) };
  } finally {
    URL.revokeObjectURL(originalUrl);
  }
}

function analyzeImageQuality(ctx, width, height) {
  const sampleWidth = Math.min(220, width);
  const sampleHeight = Math.max(1, Math.round(height * (sampleWidth / width)));
  const canvas = document.createElement('canvas');
  canvas.width = sampleWidth;
  canvas.height = sampleHeight;
  const sampleCtx = canvas.getContext('2d', { willReadFrequently: true });
  sampleCtx.drawImage(ctx.canvas, 0, 0, sampleWidth, sampleHeight);
  const { data } = sampleCtx.getImageData(0, 0, sampleWidth, sampleHeight);
  let brightnessSum = 0;
  let brightnessSquared = 0;
  let edgeSum = 0;
  let previous = 0;
  const values = [];
  for (let index = 0; index < data.length; index += 4) {
    const luminance = 0.2126 * data[index] + 0.7152 * data[index + 1] + 0.0722 * data[index + 2];
    values.push(luminance);
    brightnessSum += luminance;
    brightnessSquared += luminance * luminance;
    if (index > 0) edgeSum += Math.abs(luminance - previous);
    previous = luminance;
  }
  const mean = brightnessSum / values.length;
  const variance = Math.max(0, brightnessSquared / values.length - mean * mean);
  return {
    brightness: round(mean, 1),
    contrast: round(Math.sqrt(variance), 1),
    sharpness: round(edgeSum / Math.max(1, values.length - 1), 1),
    width,
    height
  };
}

function workoutsBetween(start, end = new Date()) {
  const startMs = toDate(start).getTime();
  const endMs = toDate(end).getTime();
  return state.workouts.filter(workout => {
    const time = toDate(workout.endedAt || workout.startedAt).getTime();
    return time >= startMs && time <= endMs;
  });
}

function weekWorkouts(offset = 0) {
  const start = addDays(startOfWeek(), offset * 7);
  const end = addDays(start, 7);
  return workoutsBetween(start, end);
}

function calculateStreak() {
  if (!state.workouts.length) return 0;
  const workoutDays = [...new Set(state.workouts.map(workout => startOfDay(workout.endedAt || workout.startedAt).toISOString()))]
    .map(value => new Date(value))
    .sort((a, b) => b - a);
  const today = startOfDay();
  const latestGap = daysBetween(workoutDays[0], today);
  if (latestGap > 1) return 0;
  let streak = 1;
  for (let index = 1; index < workoutDays.length; index += 1) {
    const gap = daysBetween(workoutDays[index], workoutDays[index - 1]);
    if (gap === 1) streak += 1;
    else if (gap > 1) break;
  }
  return streak;
}

function calculateWeeklyStreak() {
  if (!state.workouts.length) return 0;
  let streak = 0;
  for (let offset = 0; offset > -104; offset -= 1) {
    const count = weekWorkouts(offset).length;
    if (count >= 1) streak += 1;
    else if (offset === 0) continue;
    else break;
  }
  return streak;
}

function weeklyVolumeSeries(weeks = 8) {
  return Array.from({ length: weeks }, (_, index) => {
    const offset = index - (weeks - 1);
    const start = addDays(startOfWeek(), offset * 7);
    const workouts = weekWorkouts(offset);
    return {
      label: formatDate(start, { month: 'short', day: 'numeric' }),
      valueKg: sum(workouts.map(volumeForWorkout)),
      workouts: workouts.length
    };
  });
}

function workoutDuration(workout) {
  if (workout.durationSec) return Number(workout.durationSec) || 0;
  const start = toDate(workout.startedAt).getTime();
  const end = toDate(workout.endedAt || Date.now()).getTime();
  return Math.max(0, Math.round((end - start) / 1000));
}

function recentPrs(days = 30) {
  const sorted = [...state.workouts].sort((a, b) => toDate(a.endedAt || a.startedAt) - toDate(b.endedAt || b.startedAt));
  const bests = new Map();
  const prs = [];
  for (const workout of sorted) {
    for (const exercise of workout.exercises || []) {
      for (const set of exercise.sets || []) {
        if (!set.done || !set.weightKg || !set.reps) continue;
        const e1rm = estimatedOneRepMax(set.weightKg, set.reps);
        const previous = bests.get(exercise.exerciseId) || 0;
        if (e1rm > previous + 0.01) {
          if (previous > 0 && isWithinDays(workout.endedAt || workout.startedAt, days)) {
            prs.push({
              id: `${workout.id}-${exercise.id}-${set.id}`,
              exerciseId: exercise.exerciseId,
              name: exercise.name,
              weightKg: set.weightKg,
              reps: set.reps,
              e1rm,
              previous,
              date: workout.endedAt || workout.startedAt,
              workoutId: workout.id
            });
          }
          bests.set(exercise.exerciseId, e1rm);
        }
      }
    }
  }
  return prs.sort((a, b) => toDate(b.date) - toDate(a.date));
}

function muscleSetDistribution(days = 14) {
  const distribution = {};
  for (const workout of state.workouts.filter(item => isWithinDays(item.endedAt || item.startedAt, days))) {
    for (const exercise of workout.exercises || []) {
      distribution[exercise.muscle] = (distribution[exercise.muscle] || 0) + (exercise.sets || []).filter(set => set.done && set.type !== 'warmup').length;
    }
  }
  return distribution;
}

function averageRpe(days = 14) {
  const values = state.workouts
    .filter(item => isWithinDays(item.endedAt || item.startedAt, days))
    .flatMap(workout => (workout.exercises || []).flatMap(exercise => (exercise.sets || []).filter(set => set.done && Number(set.rpe) > 0).map(set => Number(set.rpe))));
  return avg(values);
}

function exerciseProgressSeries(exerciseId, limit = 10) {
  return state.workouts
    .map(workout => {
      let best = 0;
      for (const exercise of workout.exercises || []) {
        if (exercise.exerciseId !== exerciseId) continue;
        for (const set of exercise.sets || []) {
          if (!set.done) continue;
          best = Math.max(best, estimatedOneRepMax(set.weightKg, set.reps));
        }
      }
      return best ? { date: workout.endedAt || workout.startedAt, valueKg: best } : null;
    })
    .filter(Boolean)
    .sort((a, b) => toDate(a.date) - toDate(b.date))
    .slice(-limit);
}

function topExercises(limit = 5) {
  const counts = {};
  for (const workout of state.workouts) {
    for (const exercise of workout.exercises || []) {
      counts[exercise.exerciseId] = (counts[exercise.exerciseId] || 0) + (exercise.sets || []).filter(set => set.done).length;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id, count]) => ({ exercise: EXERCISES.find(item => item.id === id), count }))
    .filter(item => item.exercise);
}

function nextWorkoutSuggestion() {
  if (!state.workouts.length) {
    if (state.profile.experience === 'beginner') return { templateId: 'tpl-full', reason: 'A balanced full-body session is the best place to establish your baseline.' };
    return { templateId: 'tpl-push', reason: 'Start with a repeatable session and establish clean baseline sets.' };
  }
  const recentNames = state.workouts.slice(-3).map(workout => workout.templateId).filter(Boolean);
  const rotation = ['tpl-push', 'tpl-pull', 'tpl-legs'];
  const last = recentNames.at(-1);
  const index = rotation.indexOf(last);
  const templateId = index >= 0 ? rotation[(index + 1) % rotation.length] : 'tpl-full';
  const distribution = muscleSetDistribution(10);
  const lower = (distribution.Quads || 0) + (distribution.Hamstrings || 0) + (distribution.Glutes || 0);
  const upper = (distribution.Chest || 0) + (distribution.Back || 0) + (distribution.Shoulders || 0);
  if (lower + 4 < upper) return { templateId: 'tpl-legs', reason: 'Lower-body set volume is trailing your upper-body work over the last 10 days.' };
  return { templateId, reason: 'This keeps your recent movement pattern rotation balanced.' };
}

function buildCoachInsights() {
  const insights = [];
  const workouts28 = state.workouts.filter(workout => isWithinDays(workout.endedAt || workout.startedAt, 28));
  const workouts14 = state.workouts.filter(workout => isWithinDays(workout.endedAt || workout.startedAt, 14));
  const currentWeek = weekWorkouts(0);
  const previousWeek = weekWorkouts(-1);
  const currentVolume = sum(currentWeek.map(volumeForWorkout));
  const previousVolume = sum(previousWeek.map(volumeForWorkout));
  const rpe = averageRpe(14);
  const prs = recentPrs(21);

  if (!state.workouts.length) {
    insights.push({ icon: 'target', title: 'Establish your baseline', text: 'Complete your first session with honest weights and RPE. Your first goal is repeatability, not exhaustion.' });
    insights.push({ icon: 'clock', title: 'Leave room to progress', text: 'Keep most working sets around RPE 7–8 so you can add reps or load in future sessions.' });
    insights.push({ icon: 'camera', title: 'Standardize check-in photos', text: 'Use the same location, lighting, distance, pose and time of day. Consistency makes comparison more useful.' });
    return insights;
  }

  const adherence = state.profile.weeklyGoal ? currentWeek.length / state.profile.weeklyGoal : 0;
  if (adherence >= 1) {
    insights.push({ icon: 'flame', title: 'Weekly target reached', text: `You completed ${currentWeek.length} sessions against a goal of ${state.profile.weeklyGoal}. Keep the next session quality-focused rather than adding junk volume.` });
  } else {
    const remaining = Math.max(0, state.profile.weeklyGoal - currentWeek.length);
    insights.push({ icon: 'calendar', title: `${remaining} session${remaining === 1 ? '' : 's'} to weekly goal`, text: remaining ? 'Protect the next training slot and choose a session you can recover from.' : 'You are on target.' });
  }

  if (previousVolume > 0) {
    const change = ((currentVolume - previousVolume) / previousVolume) * 100;
    if (change > 25) insights.push({ icon: 'arrowUp', title: 'Training load jumped quickly', text: `Weekly volume is up ${Math.round(change)}%. Watch soreness, sleep and performance; avoid forcing another large increase next week.` });
    else if (change < -25 && currentWeek.length > 0) insights.push({ icon: 'refresh', title: 'Lower-load week detected', text: `Volume is down ${Math.abs(Math.round(change))}% from last week. That can be useful if fatigue was building; resume gradually when performance feels sharp.` });
    else insights.push({ icon: 'progress', title: 'Training load is controlled', text: `Weekly volume changed ${Math.round(change)}% versus last week, a manageable range for most lifters when recovery is good.` });
  }

  if (rpe >= 8.8 && workouts14.length >= 3) {
    insights.push({ icon: 'info', title: 'High effort is accumulating', text: `Your average logged RPE is ${rpe.toFixed(1)}. Keep at least one or two reps in reserve on most sets or consider a lighter session.` });
  } else if (rpe > 0 && rpe < 7) {
    insights.push({ icon: 'arrowUp', title: 'You may have room to progress', text: `Average RPE is ${rpe.toFixed(1)}. On stable lifts, add a rep or the smallest available load while keeping technique consistent.` });
  }

  if (prs.length) {
    insights.push({ icon: 'trophy', title: `${prs.length} recent performance PR${prs.length === 1 ? '' : 's'}`, text: `${prs[0].name} leads your recent progress. Repeat the movement before making a large jump so the gain becomes reliable.` });
  }

  const distribution = muscleSetDistribution(14);
  const trained = Object.entries(distribution).filter(([, sets]) => sets > 0).sort((a, b) => a[1] - b[1]);
  if (trained.length >= 3) {
    const [leastMuscle, leastSets] = trained[0];
    const [, mostSets] = trained.at(-1);
    if (mostSets >= leastSets * 2.5 && leastSets < 8) insights.push({ icon: 'target', title: `${leastMuscle} volume is lagging`, text: `You logged ${leastSets} direct sets for ${leastMuscle} in 14 days. Add a few quality sets only if that matches your goals and recovery.` });
  }

  return insights.slice(0, 5);
}

function coachSummaryText() {
  const insights = buildCoachInsights();
  return insights.map((item, index) => `${index + 1}. ${item.title}: ${item.text}`).join('\n');
}

function localCoachAnswer(question) {
  const q = question.toLowerCase();
  const suggestion = nextWorkoutSuggestion();
  const template = state.templates.find(item => item.id === suggestion.templateId) || state.templates[0];
  const rpe = averageRpe(14);
  const series = weeklyVolumeSeries(4);
  const latest = series.at(-1)?.valueKg || 0;
  const previous = series.at(-2)?.valueKg || 0;
  const top = topExercises(3);

  if (/next|today|session|workout/.test(q)) {
    return `Your next best session is ${template?.name || 'a balanced full-body workout'}. ${suggestion.reason}\n\nStart with 1–2 warm-up sets on the first compound lift. For working sets, aim to match your last clean performance, then add one rep or the smallest load only when the target RPE stays around 7–8.`;
  }
  if (/deload|fatigue|tired|recovery|sore/.test(q)) {
    const recommendation = rpe >= 8.7 ? 'Your recent RPE supports taking a lower-fatigue session or deload.' : 'Your logged RPE does not clearly require a deload, but performance, sleep and persistent soreness matter more than the app score.';
    return `${recommendation}\n\nA simple deload is 5–7 days at roughly half your normal hard sets, keeping technique crisp and avoiding failure. Stop and seek qualified care for sharp pain, weakness, numbness or symptoms that feel abnormal.`;
  }
  if (/volume|sets|too much|too little/.test(q)) {
    const change = previous > 0 ? ((latest - previous) / previous) * 100 : 0;
    return `This week you logged ${formatNumber(kgToDisplay(latest))} ${weightUnit()} of load volume${previous ? `, ${change >= 0 ? 'up' : 'down'} ${Math.abs(Math.round(change))}% from last week` : ''}. Use volume as a trend, not a score to maximize. Keep sets that are close enough to challenge you while technique stays repeatable.`;
  }
  if (/plateau|stuck|progress/.test(q)) {
    const focus = top[0]?.exercise;
    return `For a plateau, change one variable at a time. On ${focus?.name || 'your main lift'}, first try adding reps within a range for 2–3 exposures, then add the smallest load and return to the lower end of the range. If performance has fallen across several sessions, reduce fatigue before adding work.`;
  }
  if (/photo|picture|physique|body fat/.test(q)) {
    return 'Use progress photos to compare consistent visual conditions, not to diagnose health or chase a single body-fat estimate. Match lighting, camera height, distance, pose, clothing and time of day. Look for slow changes across 4–8 weeks alongside strength, measurements and how you feel.';
  }
  if (/nutrition|protein|calorie|diet/.test(q)) {
    return 'SetFlow focuses on training data. For general support, prioritize regular meals, adequate protein, fruits and vegetables, hydration and enough total energy to match your goal. A registered dietitian is the right person for medical conditions, eating-disorder concerns or a precise therapeutic plan.';
  }
  if (/pr|record|strong/.test(q)) {
    const prs = recentPrs(30);
    if (!prs.length) return 'No new estimated 1RM records are logged in the last 30 days yet. Keep load, reps and RPE accurate so the app can detect real progress.';
    const topPr = prs[0];
    return `Your latest detected performance PR is ${topPr.name}: ${formatNumber(kgToDisplay(topPr.weightKg), 1)} ${weightUnit()} × ${topPr.reps}. Repeat or slightly improve it with the same range of motion before making a large jump.`;
  }
  return `${coachSummaryText()}\n\nAsk about your next workout, progressive overload, fatigue, volume, plateaus, PRs or photo check-in consistency for a more focused answer.`;
}

function routeMeta(route) {
  const map = {
    dashboard: { title: 'Dashboard', subtitle: formatDateLong(new Date()) },
    workout: { title: state.activeWorkout ? 'Active Workout' : 'Start Workout', subtitle: state.activeWorkout ? 'Every clean set moves the trend.' : 'Choose a template or build your own session.' },
    history: { title: 'Workout History', subtitle: 'Every session, set and personal best.' },
    progress: { title: 'Progress', subtitle: 'Strength, volume, consistency and body metrics.' },
    coach: { title: 'SetFlow Coach', subtitle: 'Practical feedback from your training data.' },
    library: { title: 'Exercise Library', subtitle: `${EXERCISES.length} movements with simple form cues.` },
    settings: { title: 'Settings', subtitle: 'Your profile, preferences, privacy and backups.' }
  };
  return map[route] || map.dashboard;
}

function navButton(route, label, iconName, extra = '') {
  const active = ui.route === route;
  return `<button class="nav-btn ${active ? 'active' : ''}" type="button" data-route="${route}">${icon(iconName)}<span>${label}</span>${extra}</button>`;
}

function bottomNavButton(route, label, iconName) {
  return `<button type="button" class="${ui.route === route ? 'active' : ''}" data-route="${route}">${icon(iconName)}<span>${label}</span></button>`;
}

function renderShell() {
  const meta = routeMeta(ui.route);
  const initials = (state.profile.name || 'A').trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  const activeBadge = state.activeWorkout ? '<span class="nav-badge badge-accent">Live</span>' : '';
  return `
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">${icon('logo')}</div>
        <div class="brand-copy"><strong>SetFlow</strong><span>Train · Track · Evolve</span></div>
      </div>
      <nav class="side-nav" aria-label="Primary navigation">
        ${navButton('dashboard', 'Dashboard', 'dashboard')}
        ${navButton('workout', 'Workout', 'dumbbell', activeBadge)}
        ${navButton('history', 'History', 'history')}
        ${navButton('progress', 'Progress', 'progress')}
        ${navButton('coach', 'AI Coach', 'sparkles')}
        ${navButton('library', 'Exercise Library', 'library')}
      </nav>
      <div class="nav-spacer"></div>
      <div class="sidebar-footer">
        <div class="sidebar-tip">
          <strong>${calculateWeeklyStreak()} week streak</strong>
          <p>Consistency beats a perfect plan you cannot repeat.</p>
        </div>
        <nav class="side-nav">${navButton('settings', 'Settings', 'settings')}</nav>
      </div>
    </aside>
    <main class="main-shell">
      <header class="topbar">
        <div class="topbar-title"><h1>${escapeHtml(meta.title)}</h1><p>${escapeHtml(meta.subtitle)}</p></div>
        <div class="topbar-actions">
          <button class="btn btn-icon btn-ghost" type="button" data-action="toggle-theme" aria-label="Toggle theme">${icon(state.settings.theme === 'dark' ? 'sun' : 'moon')}</button>
          <button class="profile-chip" type="button" data-route="settings" aria-label="Open profile settings"><span class="avatar">${escapeHtml(initials)}</span><strong>${escapeHtml(state.profile.name)}</strong></button>
        </div>
      </header>
      <div id="page-root">${renderPage()}</div>
    </main>
    <nav class="bottom-nav" aria-label="Mobile navigation">
      ${bottomNavButton('dashboard', 'Home', 'dashboard')}
      ${bottomNavButton('history', 'History', 'history')}
      ${bottomNavButton('workout', 'Workout', 'dumbbell')}
      ${bottomNavButton('progress', 'Progress', 'progress')}
      ${bottomNavButton('coach', 'Coach', 'sparkles')}
    </nav>
    ${ui.route !== 'workout' ? `<button class="mobile-fab" type="button" data-route="workout" aria-label="Start a workout">${icon(state.activeWorkout ? 'play' : 'plus')}</button>` : ''}
  `;
}

function renderPage() {
  switch (ui.route) {
    case 'workout': return renderWorkoutPage();
    case 'history': return renderHistoryPage();
    case 'progress': return renderProgressPage();
    case 'coach': return renderCoachPage();
    case 'library': return renderLibraryPage();
    case 'settings': return renderSettingsPage();
    default: return renderDashboardPage();
  }
}

function authHeaders(extra = {}) {
  return auth.token ? { ...extra, Authorization: `Bearer ${auth.token}` } : { ...extra };
}

function cloudStateSnapshot() {
  const snapshot = safeJsonClone(state);
  snapshot.photoCheckins = [];
  return snapshot;
}

function persistAuthSession() {
  if (!auth.user || !auth.token) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
    user: auth.user,
    token: auth.token,
    revision: auth.revision,
    lastSyncedAt: auth.lastSyncedAt
  }));
}

function normalizeCloudState(incoming, localPhotoCheckins = []) {
  const fallback = createDefaultState();
  const source = incoming && typeof incoming === 'object' ? incoming : {};
  return {
    ...fallback,
    ...source,
    profile: { ...fallback.profile, ...(source.profile || {}) },
    settings: { ...fallback.settings, ...(source.settings || {}) },
    templates: Array.isArray(source.templates) && source.templates.length ? source.templates : fallback.templates,
    workouts: Array.isArray(source.workouts) ? source.workouts : [],
    bodyMetrics: Array.isArray(source.bodyMetrics) ? source.bodyMetrics : [],
    photoCheckins: Array.isArray(localPhotoCheckins) ? localPhotoCheckins : [],
    coachMessages: Array.isArray(source.coachMessages) && source.coachMessages.length ? source.coachMessages : fallback.coachMessages,
    customExercises: Array.isArray(source.customExercises) ? source.customExercises : []
  };
}

function scheduleCloudSync() {
  if (!auth.available || !auth.user || !auth.token || !navigator.onLine) return;
  auth.syncStatus = 'pending';
  clearTimeout(cloudSyncTimer);
  cloudSyncTimer = setTimeout(() => syncToCloud().catch(() => {}), 900);
}

async function syncToCloud(showResult = false) {
  if (!auth.available || !auth.user || !auth.token) {
    if (showResult) toast('Local mode', 'Sign in to sync this device to your account.', 'warning');
    return false;
  }
  if (!navigator.onLine) {
    auth.syncStatus = 'offline';
    if (showResult) toast('Offline', 'Your changes are saved on this device and will sync when you reconnect.', 'warning');
    return false;
  }
  auth.syncStatus = 'syncing';
  try {
    const response = await fetch('/api/sync', {
      method: 'PUT',
      headers: authHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' }),
      body: JSON.stringify({ state: cloudStateSnapshot(), revision: auth.revision })
    });
    const data = await response.json().catch(() => ({}));
    if (response.status === 409) {
      auth.syncStatus = 'conflict';
      if (showResult) toast('Cloud copy changed', 'Reload the cloud copy before syncing this device.', 'warning');
      return false;
    }
    if (!response.ok) throw new Error(data.error || `Sync failed (${response.status})`);
    auth.revision = Number(data.revision || auth.revision + 1);
    auth.lastSyncedAt = data.updatedAt || new Date().toISOString();
    auth.syncStatus = 'synced';
    persistAuthSession();
    if (showResult) toast('Synced', 'Your workout data is up to date in the cloud.');
    return true;
  } catch (error) {
    console.warn('Cloud sync failed', error);
    auth.syncStatus = navigator.onLine ? 'error' : 'offline';
    if (showResult) toast('Could not sync', error.message || 'Your local copy is still safe.', 'error');
    return false;
  }
}

async function pullCloudData({ showResult = false, render = true } = {}) {
  if (!auth.user || !auth.token) return false;
  const response = await fetch('/api/sync', { headers: authHeaders({ Accept: 'application/json' }) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Cloud load failed (${response.status})`);
  const localPhotos = state.photoCheckins;
  state = normalizeCloudState(data.state, localPhotos);
  auth.revision = Number(data.revision || 0);
  auth.lastSyncedAt = data.updatedAt || '';
  auth.syncStatus = 'synced';
  persistAuthSession();
  hydrateCustomExercises();
  saveState(true);
  ui.onboardingDraft = safeJsonClone(state.profile);
  if (render) renderApp();
  if (showResult) toast('Cloud data loaded', `${state.workouts.length} workouts are available on this device.`);
  return true;
}

async function initializeAccounts() {
  if (location.protocol === 'file:') {
    auth.initializing = false;
    auth.available = false;
    await refreshPhotoCache().catch(() => {});
    renderApp();
    return;
  }
  try {
    const response = await fetch('/api/account-status', { headers: authHeaders({ Accept: 'application/json' }) });
    if (!response.ok) throw new Error(`Account status ${response.status}`);
    const data = await response.json();
    auth.available = Boolean(data.available);
    if (!auth.available) {
      auth.syncStatus = auth.user ? 'offline' : 'local';
    } else if (auth.token && data.user) {
      auth.user = data.user;
      auth.guestMode = false;
      localStorage.removeItem(GUEST_MODE_KEY);
      try {
        await pullCloudData({ render: false });
      } catch (error) {
        console.warn('Using cached account data', error);
        auth.syncStatus = 'offline';
      }
    } else if (auth.token && !data.user) {
      auth.user = null;
      auth.token = '';
      auth.revision = 0;
      persistAuthSession();
    }
  } catch (error) {
    console.warn('Account service unavailable', error);
    auth.available = Boolean(auth.user && auth.token);
    auth.syncStatus = auth.user ? 'offline' : 'local';
  } finally {
    auth.initializing = false;
    renderApp();
    await refreshPhotoCache().catch(() => {});
  }
}

function renderAuthLoading() {
  return `<section class="onboarding"><div class="onboarding-card auth-card"><div class="onboarding-hero"><div class="brand"><div class="brand-mark">${icon('logo')}</div><div class="brand-copy"><strong>SetFlow</strong><span>Train · Track · Evolve</span></div></div><h1>Opening your training log.</h1><p>Checking this device and your SetFlow account.</p></div><div class="onboarding-form"><div class="auth-loading"><span class="status-dot online"></span> Securely connecting…</div></div></div></section>`;
}

function renderAuthGate() {
  const creating = ui.authMode === 'signup';
  return `
    <section class="onboarding">
      <div class="onboarding-card auth-card">
        <div class="onboarding-hero">
          <div class="brand"><div class="brand-mark">${icon('logo')}</div><div class="brand-copy"><strong>SetFlow</strong><span>Train · Track · Evolve</span></div></div>
          <h1>Your training. On every device.</h1>
          <p>Create an account to keep workouts, templates, measurements, settings and coaching history synced. Progress-photo files stay private on the device where you save them.</p>
          <div class="auth-benefits"><span>${icon('check')} Cloud workout sync</span><span>${icon('check')} Separate data for every athlete</span><span>${icon('check')} Offline-friendly local cache</span></div>
        </div>
        <div class="onboarding-form auth-form-wrap">
          <div class="segmented auth-tabs">
            <button type="button" class="${!creating ? 'active' : ''}" data-action="set-auth-mode" data-mode="signin">Sign in</button>
            <button type="button" class="${creating ? 'active' : ''}" data-action="set-auth-mode" data-mode="signup">Create account</button>
          </div>
          <form id="auth-form" class="form-grid">
            ${creating ? '<div class="form-group full"><label class="label" for="auth-name">Name</label><input id="auth-name" name="name" class="input" type="text" autocomplete="name" maxlength="80" placeholder="Alex" required></div>' : ''}
            <div class="form-group full"><label class="label" for="auth-email">Email</label><input id="auth-email" name="email" class="input" type="email" autocomplete="email" inputmode="email" placeholder="you@example.com" required></div>
            <div class="form-group full"><label class="label" for="auth-password">Password</label><input id="auth-password" name="password" class="input" type="password" autocomplete="${creating ? 'new-password' : 'current-password'}" minlength="8" maxlength="128" placeholder="At least 8 characters" required></div>
            <div class="form-group full"><button class="btn btn-primary btn-lg" style="width:100%" type="submit">${creating ? `${icon('plus')} Create my account` : `${icon('play')} Sign in`}</button></div>
          </form>
          <div class="auth-divider"><span>or</span></div>
          <button class="btn btn-secondary" style="width:100%" type="button" data-action="continue-guest">Continue on this device only</button>
          <p class="auth-fineprint">Passwords are one-way hashed on the server. SetFlow does not currently include email verification or password recovery, so use a password you can safely remember.</p>
        </div>
      </div>
    </section>`;
}

function renderAccountCard() {
  if (!auth.available && !auth.user) {
    return `<article class="card card-pad"><div class="card-header"><div><h3>SetFlow account</h3><p>Cloud accounts are not configured on this server</p></div></div><div class="privacy-note">${icon('info')}<p>Add a PostgreSQL <strong>DATABASE_URL</strong> and <strong>SESSION_SECRET</strong> to enable multi-user accounts and sync.</p></div></article>`;
  }
  if (!auth.user) {
    return `<article class="card card-pad"><div class="card-header"><div><h3>SetFlow account</h3><p>You are using guest mode on this device</p></div><div class="connection-status"><span class="status-dot"></span>Local only</div></div><p>Sign in or create an account to sync your workouts across devices.</p><button class="btn btn-primary" type="button" data-action="open-auth">Sign in or create account</button></article>`;
  }
  const syncLabel = auth.syncStatus === 'synced' ? 'Synced' : auth.syncStatus === 'syncing' ? 'Syncing' : auth.syncStatus === 'conflict' ? 'Needs attention' : auth.syncStatus === 'offline' ? 'Offline' : 'Pending';
  return `<article class="card card-pad"><div class="card-header"><div><h3>SetFlow account</h3><p>${escapeHtml(auth.user.email)}</p></div><div class="connection-status"><span class="status-dot ${auth.syncStatus === 'synced' ? 'online' : ''}"></span>${syncLabel}</div></div><div class="account-summary"><div class="avatar">${escapeHtml((auth.user.name || state.profile.name || 'A').slice(0,1).toUpperCase())}</div><div><strong>${escapeHtml(auth.user.name || state.profile.name)}</strong><span>${auth.lastSyncedAt ? `Last synced ${escapeHtml(formatDate(auth.lastSyncedAt, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }))}` : 'Cloud sync is ready'}</span></div></div><div class="button-row" style="margin-top:14px"><button class="btn btn-primary" type="button" data-action="sync-now">${icon('refresh')} Sync now</button><button class="btn btn-secondary" type="button" data-action="reload-cloud">Reload cloud</button><button class="btn btn-ghost" type="button" data-action="sign-out">Sign out</button></div><div class="divider"></div><button class="btn btn-danger btn-sm" type="button" data-action="delete-account">Delete account</button></article>`;
}

async function signOut() {
  clearTimeout(cloudSyncTimer);
  auth.user = null;
  auth.token = '';
  auth.revision = 0;
  auth.syncStatus = 'local';
  auth.guestMode = false;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(GUEST_MODE_KEY);
  state = loadState(STORAGE_KEY);
  if (auth.available) { ui.aiOnline = false; ui.aiModel = ''; }
  hydrateCustomExercises();
  ui.onboardingDraft = safeJsonClone(state.profile);
  await refreshPhotoCache();
  renderApp();
}

function renderApp() {
  applyTheme();
  const app = document.getElementById('app');
  if (auth.initializing) app.innerHTML = renderAuthLoading();
  else if (auth.available && !auth.user && !auth.guestMode) app.innerHTML = renderAuthGate();
  else app.innerHTML = state.onboarded ? renderShell() : renderOnboarding();
  requestAnimationFrame(() => {
    drawVisibleCharts();
    updateActiveTimerDisplay();
  });
  manageActiveWorkoutTimer();
}

function renderDashboardPage() {
  const week = weekWorkouts(0);
  const lastWeek = weekWorkouts(-1);
  const weekVolumeKg = sum(week.map(volumeForWorkout));
  const lastWeekVolumeKg = sum(lastWeek.map(volumeForWorkout));
  const volumeChange = lastWeekVolumeKg ? ((weekVolumeKg - lastWeekVolumeKg) / lastWeekVolumeKg) * 100 : 0;
  const minutes = Math.round(sum(week.map(workoutDuration)) / 60);
  const prs = recentPrs(30);
  const recent = [...state.workouts].sort((a, b) => toDate(b.endedAt || b.startedAt) - toDate(a.endedAt || a.startedAt)).slice(0, 4);
  const insight = buildCoachInsights()[0];
  const suggestion = nextWorkoutSuggestion();
  const suggestedTemplate = state.templates.find(item => item.id === suggestion.templateId) || state.templates[0];
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = (state.profile.name || 'Athlete').split(' ')[0];
  const goalProgress = clamp((week.length / Math.max(1, state.profile.weeklyGoal)) * 100, 0, 100);

  return `
    <section class="page">
      <div class="dashboard-grid">
        <div class="stack">
          <article class="card hero-card">
            <div class="hero-eyebrow">${icon(state.activeWorkout ? 'flame' : 'sparkles')} ${state.activeWorkout ? 'Workout in progress' : 'Ready when you are'}</div>
            <h2>${escapeHtml(greeting)}, ${escapeHtml(firstName)}.</h2>
            <p>${state.activeWorkout ? `Your ${escapeHtml(state.activeWorkout.name)} session is active. Pick up exactly where you left off.` : `The plan only works when it becomes a habit. ${escapeHtml(suggestion.reason)}`}</p>
            <div class="hero-actions">
              <button class="btn btn-primary btn-lg" type="button" data-route="workout">${icon(state.activeWorkout ? 'play' : 'dumbbell')} ${state.activeWorkout ? 'Resume workout' : `Start ${escapeHtml(suggestedTemplate?.name || 'workout')}`}</button>
              ${!state.activeWorkout && suggestedTemplate ? `<button class="btn btn-secondary btn-lg" type="button" data-action="start-template" data-template-id="${suggestedTemplate.id}">${icon('play')} Quick start</button>` : ''}
            </div>
          </article>

          <div class="grid grid-4">
            <article class="card stat-card">
              <div class="stat-top"><div class="stat-icon">${icon('dumbbell')}</div><span class="trend ${volumeChange < 0 ? 'down' : ''}">${volumeChange ? `${volumeChange > 0 ? '+' : ''}${Math.round(volumeChange)}%` : 'This week'}</span></div>
              <strong class="stat-value">${formatNumber(kgToDisplay(weekVolumeKg))}</strong><span class="stat-label">${weightUnit()} volume</span>
            </article>
            <article class="card stat-card">
              <div class="stat-top"><div class="stat-icon">${icon('calendar')}</div><span class="trend">${Math.round(goalProgress)}%</span></div>
              <strong class="stat-value">${week.length}/${state.profile.weeklyGoal}</strong><span class="stat-label">weekly sessions</span>
            </article>
            <article class="card stat-card">
              <div class="stat-top"><div class="stat-icon">${icon('clock')}</div><span class="trend">${formatCompactDuration(minutes * 60)}</span></div>
              <strong class="stat-value">${minutes}</strong><span class="stat-label">training minutes</span>
            </article>
            <article class="card stat-card">
              <div class="stat-top"><div class="stat-icon">${icon('trophy')}</div><span class="trend">30 days</span></div>
              <strong class="stat-value">${prs.length}</strong><span class="stat-label">performance PRs</span>
            </article>
          </div>

          <article class="card card-pad">
            <div class="card-header">
              <div><h3>Training volume</h3><p>Eight-week load trend</p></div>
              <button class="btn btn-sm btn-ghost" type="button" data-route="progress">View progress ${icon('chevron')}</button>
            </div>
            <div class="chart-wrap"><canvas id="dashboard-volume-chart" class="chart-canvas" aria-label="Eight-week training volume chart"></canvas></div>
          </article>

          <article class="card history-card">
            <div class="card-header card-pad" style="margin-bottom:0;padding-bottom:14px">
              <div><h3>Recent workouts</h3><p>Your latest completed sessions</p></div>
              <button class="btn btn-sm btn-ghost" type="button" data-route="history">See all ${icon('chevron')}</button>
            </div>
            ${recent.length ? recent.map(renderCompactHistoryRow).join('') : `
              <div class="empty-state" style="min-height:210px">
                <div class="empty-icon">${icon('history')}</div>
                <h3>No completed workouts yet</h3>
                <p>Your workout history, volume and PRs will appear here after your first session.</p>
                <button class="btn btn-primary" type="button" data-route="workout">Start your first workout</button>
              </div>`}
          </article>
        </div>

        <aside class="stack">
          <article class="card card-pad">
            <div class="card-header"><div><h3>Weekly target</h3><p>${week.length} of ${state.profile.weeklyGoal} sessions</p></div></div>
            <div style="display:flex;align-items:center;gap:20px">
              <div class="progress-ring" style="--progress:${goalProgress}"><div class="progress-ring-content"><strong>${Math.round(goalProgress)}%</strong><span>complete</span></div></div>
              <div class="stack" style="gap:9px;flex:1">
                <div class="metric-mini"><strong>${calculateWeeklyStreak()}</strong><span>week consistency streak</span></div>
                <div class="metric-mini"><strong>${calculateStreak()}</strong><span>consecutive active days</span></div>
              </div>
            </div>
          </article>

          <article class="card card-pad">
            <div class="card-header"><div><h3>Coach signal</h3><p>Based on your latest logs</p></div><span class="badge badge-accent">AI</span></div>
            <div class="insight-card">
              <div class="insight-icon">${icon(insight?.icon || 'sparkles')}</div>
              <div><h4>${escapeHtml(insight?.title || 'Build your baseline')}</h4><p>${escapeHtml(insight?.text || 'Complete a workout to unlock specific coaching insights.')}</p></div>
            </div>
            <button class="btn btn-secondary" style="width:100%;margin-top:12px" type="button" data-route="coach">Open SetFlow Coach ${icon('chevron')}</button>
          </article>

          <article class="card card-pad">
            <div class="card-header"><div><h3>Suggested session</h3><p>Balanced against recent training</p></div></div>
            <div class="template-card" style="min-height:0">
              <div class="template-icon">${icon('dumbbell')}</div>
              <h3>${escapeHtml(suggestedTemplate?.name || 'Full Body')}</h3>
              <p>${escapeHtml(suggestedTemplate?.description || suggestion.reason)}</p>
              <div class="metric-row" style="margin-bottom:14px">
                <div class="metric-mini"><strong>${suggestedTemplate?.exerciseIds?.length || 0}</strong><span>exercises</span></div>
                <div class="metric-mini"><strong>45–70</strong><span>minutes</span></div>
                <div class="metric-mini"><strong>7–8</strong><span>target RPE</span></div>
              </div>
              <button class="btn btn-primary" type="button" data-action="start-template" data-template-id="${suggestedTemplate?.id || ''}">${icon('play')} Start session</button>
            </div>
          </article>
        </aside>
      </div>
    </section>
  `;
}

function renderCompactHistoryRow(workout) {
  const date = workout.endedAt || workout.startedAt;
  return `
    <button class="history-row" type="button" data-action="view-workout" data-workout-id="${workout.id}" style="width:100%;border-left:0;border-right:0;border-bottom:0;color:inherit;text-align:left;cursor:pointer;background:transparent">
      <div class="history-main"><strong>${escapeHtml(workout.name)}</strong><span>${formatDate(date, { weekday: 'short', month: 'short', day: 'numeric' })} · ${(workout.exercises || []).length} exercises</span></div>
      <div class="history-cell"><strong>${completedSets(workout)}</strong><span>sets</span></div>
      <div class="history-cell"><strong>${formatNumber(kgToDisplay(volumeForWorkout(workout)))}</strong><span>${weightUnit()} volume</span></div>
      <div class="history-cell"><strong>${formatCompactDuration(workoutDuration(workout))}</strong><span>duration</span></div>
      <div class="history-cell"><strong>${round(avg((workout.exercises || []).flatMap(exercise => (exercise.sets || []).filter(set => set.done && set.rpe).map(set => set.rpe))), 1) || '—'}</strong><span>avg RPE</span></div>
      ${icon('chevron')}
    </button>
  `;
}

function renderWorkoutPage() {
  if (state.activeWorkout) return renderActiveWorkoutPage();
  return renderWorkoutStartPage();
}

function templateMuscles(template) {
  return [...new Set((template.exerciseIds || []).map(id => EXERCISES.find(exercise => exercise.id === id)?.muscle || 'Custom'))];
}

function renderWorkoutStartPage() {
  const recent = [...state.workouts].sort((a, b) => toDate(b.endedAt || b.startedAt) - toDate(a.endedAt || a.startedAt))[0];
  return `
    <section class="page">
      <div class="page-header">
        <div><h2>Choose your session</h2><p>Start from a balanced template or create a workout around the equipment you have today.</p></div>
        <button class="btn btn-primary btn-lg" type="button" data-action="start-blank">${icon('plus')} Blank workout</button>
      </div>

      <p class="section-label">Workout templates</p>
      <div class="template-grid">
        ${state.templates.map((template, index) => `
          <article class="template-card">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
              <div class="template-icon">${icon(index % 2 ? 'target' : 'dumbbell')}</div>
              <span class="badge">${escapeHtml(template.level || 'All')}</span>
            </div>
            <h3>${escapeHtml(template.name)}</h3>
            <p>${escapeHtml(template.description || `${template.exerciseIds.length} exercises`)}</p>
            <div class="library-tags" style="margin-bottom:16px">
              ${templateMuscles(template).slice(0, 3).map(muscle => `<span class="badge">${escapeHtml(muscle)}</span>`).join('')}
              ${templateMuscles(template).length > 3 ? `<span class="badge">+${templateMuscles(template).length - 3}</span>` : ''}
            </div>
            <button class="btn btn-primary" type="button" data-action="start-template" data-template-id="${template.id}">${icon('play')} Start ${escapeHtml(template.name)}</button>
          </article>
        `).join('')}
        <button class="template-card" type="button" data-action="create-template" style="cursor:pointer;text-align:left;color:inherit">
          <div class="template-icon">${icon('plus')}</div>
          <h3>Create template</h3>
          <p>Build a repeatable program with your preferred exercise order.</p>
          <span class="btn btn-secondary">Build template ${icon('chevron')}</span>
        </button>
      </div>

      <div class="grid grid-2" style="margin-top:18px">
        <article class="card card-pad">
          <div class="card-header"><div><h3>Quick start</h3><p>Choose movements as you go</p></div></div>
          <div class="list">
            <button class="list-item" type="button" data-action="start-blank" style="cursor:pointer;color:inherit;text-align:left">
              <div class="exercise-dot">${icon('plus')}</div><div class="list-item-main"><strong>Empty workout</strong><span>Add any exercise from the full library</span></div>${icon('chevron')}
            </button>
            ${recent ? `<button class="list-item" type="button" data-action="repeat-workout" data-workout-id="${recent.id}" style="cursor:pointer;color:inherit;text-align:left"><div class="exercise-dot">${icon('refresh')}</div><div class="list-item-main"><strong>Repeat ${escapeHtml(recent.name)}</strong><span>${(recent.exercises || []).length} exercises · last trained ${formatDate(recent.endedAt || recent.startedAt)}</span></div>${icon('chevron')}</button>` : ''}
          </div>
        </article>
        <article class="card card-pad">
          <div class="card-header"><div><h3>Session principles</h3><p>Simple rules that scale to any level</p></div></div>
          <div class="list">
            <div class="insight-card"><div class="insight-icon">${icon('target')}</div><div><h4>Progress one variable</h4><p>Add a rep, a small amount of load or better control—not all three at once.</p></div></div>
            <div class="insight-card"><div class="insight-icon">${icon('info')}</div><div><h4>Use honest RPE</h4><p>Most working sets should finish with roughly 2–3 good reps still possible.</p></div></div>
          </div>
        </article>
      </div>
    </section>
  `;
}

function previousExerciseInstance(exerciseId) {
  return [...state.workouts].reverse().flatMap(workout => workout.exercises || []).find(exercise => exercise.exerciseId === exerciseId) || null;
}

function renderSetInputs(exercise, set, index) {
  const previous = previousExerciseInstance(exercise.exerciseId)?.sets?.filter(item => item.type !== 'warmup')?.[index];
  const previousLabel = previous
    ? exercise.tracking === 'time'
      ? formatDuration(previous.durationSec)
      : exercise.tracking === 'time_distance'
        ? `${Math.round((previous.durationSec || 0) / 60)} min · ${round(kmToDisplay(previous.distanceKm), 1)} ${distanceUnit()}`
        : `${round(kgToDisplay(previous.weightKg), 1)} × ${previous.reps}`
    : '—';

  let metrics = '';
  if (exercise.tracking === 'time') {
    metrics = `
      <td><input class="input input-sm input-number" type="number" min="0" step="5" value="${Math.round((set.durationSec || 0) / 60)}" data-active-field="durationMin" data-exercise-id="${exercise.id}" data-set-id="${set.id}" aria-label="Duration in minutes"></td>
      <td><span class="badge">${previousLabel}</span></td>`;
  } else if (exercise.tracking === 'time_distance') {
    metrics = `
      <td><input class="input input-sm input-number" type="number" min="0" step="1" value="${round((set.durationSec || 0) / 60, 1)}" data-active-field="durationMin" data-exercise-id="${exercise.id}" data-set-id="${set.id}" aria-label="Duration in minutes"></td>
      <td><input class="input input-sm input-number" type="number" min="0" step="0.1" value="${round(kmToDisplay(set.distanceKm), 2)}" data-active-field="distance" data-exercise-id="${exercise.id}" data-set-id="${set.id}" aria-label="Distance in ${distanceUnit()}"></td>`;
  } else {
    metrics = `
      <td><input class="input input-sm input-number" type="number" min="0" step="${state.profile.units === 'lb' ? '2.5' : '1'}" value="${round(kgToDisplay(set.weightKg), 1)}" data-active-field="weight" data-exercise-id="${exercise.id}" data-set-id="${set.id}" aria-label="Weight in ${weightUnit()}"></td>
      <td><input class="input input-sm input-number" type="number" min="0" max="100" step="1" value="${set.reps || 0}" data-active-field="reps" data-exercise-id="${exercise.id}" data-set-id="${set.id}" aria-label="Repetitions"></td>`;
  }

  return `
    <tr class="set-row ${set.done ? 'done' : ''}">
      <td><span class="set-number">${index + 1}</span></td>
      <td>
        <select class="select select-sm set-type" data-active-field="type" data-exercise-id="${exercise.id}" data-set-id="${set.id}" aria-label="Set type">
          <option value="warmup" ${set.type === 'warmup' ? 'selected' : ''}>Warm-up</option>
          <option value="working" ${set.type === 'working' ? 'selected' : ''}>Working</option>
          <option value="backoff" ${set.type === 'backoff' ? 'selected' : ''}>Back-off</option>
          <option value="failure" ${set.type === 'failure' ? 'selected' : ''}>To failure</option>
        </select>
      </td>
      ${metrics}
      ${state.settings.showRpe ? `<td><input class="input input-sm input-number" type="number" min="1" max="10" step="0.5" value="${set.rpe || ''}" placeholder="—" data-active-field="rpe" data-exercise-id="${exercise.id}" data-set-id="${set.id}" aria-label="RPE"></td>` : ''}
      <td><button class="check-btn ${set.done ? 'done' : ''}" type="button" data-action="toggle-set" data-exercise-id="${exercise.id}" data-set-id="${set.id}" aria-label="${set.done ? 'Mark set incomplete' : 'Complete set'}">${icon('check')}</button></td>
      <td><button class="btn btn-icon btn-sm btn-ghost" type="button" data-action="remove-set" data-exercise-id="${exercise.id}" data-set-id="${set.id}" aria-label="Remove set">${icon('close')}</button></td>
    </tr>
  `;
}

function renderExerciseCard(exercise, index) {
  const libraryExercise = EXERCISES.find(item => item.id === exercise.exerciseId);
  const done = exercise.sets.filter(set => set.done).length;
  const last = previousExerciseInstance(exercise.exerciseId);
  const tableHeaders = exercise.tracking === 'time'
    ? '<th>Set</th><th>Type</th><th>Minutes</th><th>Last</th>'
    : exercise.tracking === 'time_distance'
      ? `<th>Set</th><th>Type</th><th>Minutes</th><th>${distanceUnit()}</th>`
      : `<th>Set</th><th>Type</th><th>${weightUnit()}</th><th>Reps</th>`;

  return `
    <article class="card exercise-card" data-workout-exercise="${exercise.id}">
      <div class="exercise-head">
        <div class="exercise-dot">${escapeHtml(exercise.muscle.slice(0, 2))}</div>
        <div class="exercise-head-main">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><h3>${escapeHtml(exercise.name)}</h3><span class="badge badge-accent">${done}/${exercise.sets.length}</span></div>
          <p>${escapeHtml(exercise.muscle)} · ${escapeHtml(libraryExercise?.equipment || '')}${last ? ` · Last trained ${formatDate(last.date || state.workouts.find(workout => workout.exercises?.includes(last))?.endedAt || new Date())}` : ''}</p>
        </div>
        <button class="btn btn-icon btn-sm btn-ghost" type="button" data-action="exercise-menu" data-exercise-id="${exercise.id}" aria-label="Exercise options">${icon('more')}</button>
      </div>
      <div class="set-table-wrap">
        <table class="set-table">
          <thead><tr>${tableHeaders}${state.settings.showRpe ? '<th>RPE</th>' : ''}<th>Done</th><th></th></tr></thead>
          <tbody>${exercise.sets.map((set, setIndex) => renderSetInputs(exercise, set, setIndex)).join('')}</tbody>
        </table>
      </div>
      <div class="exercise-footer">
        <button class="btn btn-sm btn-secondary" type="button" data-action="add-set" data-exercise-id="${exercise.id}">${icon('plus')} Add set</button>
        <button class="btn btn-sm btn-ghost" type="button" data-action="show-exercise" data-exercise-library-id="${exercise.exerciseId}">${icon('info')} Form cue</button>
      </div>
      <div style="padding:0 18px 18px">
        <input class="input input-sm" type="text" value="${escapeHtml(exercise.notes || '')}" placeholder="Exercise notes: setup, tempo, pain-free range…" data-active-exercise-notes="${exercise.id}">
      </div>
    </article>
  `;
}

function renderActiveWorkoutPage() {
  const workout = state.activeWorkout;
  const doneSets = completedSets(workout);
  const totalSets = sum(workout.exercises.map(exercise => exercise.sets.length));
  const volumeKg = volumeForWorkout(workout);
  const reps = completedReps(workout);
  return `
    <section class="page">
      <div class="page-header">
        <div>
          <div class="hero-eyebrow" style="margin-bottom:8px">${icon('flame')} Live session</div>
          <h2>${escapeHtml(workout.name)}</h2>
          <p>Log the set you actually performed. Accurate data beats impressive-looking data.</p>
        </div>
        <div class="inline-actions">
          <button class="btn btn-secondary" type="button" data-action="open-rest-timer">${icon('clock')} Rest timer</button>
          <button class="btn btn-primary btn-lg" type="button" data-action="finish-workout">${icon('check')} Finish workout</button>
        </div>
      </div>

      <div class="active-workout-shell">
        <div class="stack">
          ${workout.exercises.length ? workout.exercises.map(renderExerciseCard).join('') : `
            <article class="card empty-state">
              <div class="empty-icon">${icon('dumbbell')}</div>
              <h3>Add your first exercise</h3>
              <p>Search the movement library and build this session around your goal and available equipment.</p>
              <button class="btn btn-primary" type="button" data-action="add-exercise">${icon('plus')} Add exercise</button>
            </article>`}
          <button class="btn btn-secondary btn-lg" type="button" data-action="add-exercise" style="width:100%;border-style:dashed">${icon('plus')} Add exercise</button>
        </div>

        <aside class="card workout-summary-bar">
          <div class="card-header"><div><h3>Session overview</h3><p>Saved automatically on this device</p></div><span class="badge badge-accent">Live</span></div>
          <span id="active-workout-timer" class="timer-large">${formatDuration((Date.now() - toDate(workout.startedAt).getTime()) / 1000)}</span>
          <p style="margin:6px 0 18px;font-size:11px">Elapsed training time</p>
          <div class="metric-row">
            <div class="metric-mini"><strong>${doneSets}/${totalSets}</strong><span>sets</span></div>
            <div class="metric-mini"><strong>${formatNumber(kgToDisplay(volumeKg))}</strong><span>${weightUnit()} vol.</span></div>
            <div class="metric-mini"><strong>${reps}</strong><span>reps</span></div>
          </div>
          <div class="divider"></div>
          <div class="form-group">
            <label class="label" for="active-workout-name">Workout name</label>
            <input id="active-workout-name" class="input" type="text" value="${escapeHtml(workout.name)}" data-active-workout-field="name">
          </div>
          <div class="form-group" style="margin-top:12px">
            <label class="label" for="active-workout-notes">Session notes</label>
            <textarea id="active-workout-notes" class="textarea" placeholder="Energy, sleep, technique notes…" data-active-workout-field="notes">${escapeHtml(workout.notes || '')}</textarea>
          </div>
          <div class="divider"></div>
          <div class="stack" style="gap:8px">
            <button class="btn btn-secondary" type="button" data-action="save-active-template">${icon('download')} Save as template</button>
            <button class="btn btn-danger" type="button" data-action="cancel-workout">${icon('trash')} Discard workout</button>
          </div>
        </aside>
      </div>
    </section>
  `;
}

function startWorkout({ name = 'Custom Workout', templateId = null, exerciseIds = [] } = {}) {
  if (state.activeWorkout) {
    navigate('workout');
    toast('Workout already active', 'Resume or finish it before starting another session.');
    return;
  }
  const exercises = exerciseIds.map(id => createWorkoutExercise(id)).filter(Boolean);
  state.activeWorkout = {
    id: uid('workout'),
    name,
    templateId,
    startedAt: new Date().toISOString(),
    notes: '',
    exercises
  };
  saveState();
  navigate('workout');
  toast('Workout started', 'Your session is saved automatically.');
}

function startTemplate(templateId) {
  const template = state.templates.find(item => item.id === templateId);
  if (!template) return toast('Template not found', 'Choose another workout.');
  startWorkout({ name: template.name, templateId: template.id, exerciseIds: template.exerciseIds || [] });
}

function repeatWorkout(workoutId) {
  const workout = state.workouts.find(item => item.id === workoutId);
  if (!workout) return;
  startWorkout({ name: `${workout.name}`, templateId: workout.templateId || null, exerciseIds: (workout.exercises || []).map(exercise => exercise.exerciseId) });
}

function manageActiveWorkoutTimer() {
  if (ui.activeTimerId) clearInterval(ui.activeTimerId);
  ui.activeTimerId = null;
  if (!state.activeWorkout) return;
  ui.activeTimerId = setInterval(updateActiveTimerDisplay, 1000);
}

function updateActiveTimerDisplay() {
  if (!state.activeWorkout) return;
  const element = document.getElementById('active-workout-timer');
  if (element) element.textContent = formatDuration((Date.now() - toDate(state.activeWorkout.startedAt).getTime()) / 1000);
}

function renderHistoryPage() {
  const query = ui.historySearch.trim().toLowerCase();
  const workouts = [...state.workouts]
    .sort((a, b) => toDate(b.endedAt || b.startedAt) - toDate(a.endedAt || a.startedAt))
    .filter(workout => !query || workout.name.toLowerCase().includes(query) || (workout.exercises || []).some(exercise => exercise.name.toLowerCase().includes(query)));
  const totalVolume = sum(state.workouts.map(volumeForWorkout));
  const totalTime = sum(state.workouts.map(workoutDuration));
  const totalSets = sum(state.workouts.map(completedSets));

  return `
    <section class="page">
      <div class="page-header">
        <div><h2>Your training history</h2><p>Search past sessions, inspect every set and repeat the workouts that moved you forward.</p></div>
        <button class="btn btn-primary" type="button" data-route="workout">${icon('plus')} New workout</button>
      </div>

      <div class="grid grid-4" style="margin-bottom:18px">
        <article class="card stat-card"><div class="stat-top"><div class="stat-icon">${icon('history')}</div></div><strong class="stat-value">${state.workouts.length}</strong><span class="stat-label">completed workouts</span></article>
        <article class="card stat-card"><div class="stat-top"><div class="stat-icon">${icon('dumbbell')}</div></div><strong class="stat-value">${formatNumber(kgToDisplay(totalVolume))}</strong><span class="stat-label">${weightUnit()} total volume</span></article>
        <article class="card stat-card"><div class="stat-top"><div class="stat-icon">${icon('check')}</div></div><strong class="stat-value">${totalSets}</strong><span class="stat-label">completed sets</span></article>
        <article class="card stat-card"><div class="stat-top"><div class="stat-icon">${icon('clock')}</div></div><strong class="stat-value">${Math.round(totalTime / 3600)}</strong><span class="stat-label">training hours</span></article>
      </div>

      <article class="card card-pad" style="padding-bottom:14px">
        <div class="search-wrap">
          ${icon('search')}
          <input id="history-search" class="input" type="search" value="${escapeHtml(ui.historySearch)}" placeholder="Search workouts or exercises…" autocomplete="off">
        </div>
      </article>

      <article class="card history-card" style="margin-top:12px">
        ${workouts.length ? workouts.map(renderHistoryRow).join('') : `
          <div class="empty-state">
            <div class="empty-icon">${icon(query ? 'search' : 'history')}</div>
            <h3>${query ? 'No matching workouts' : 'Your history starts with one set'}</h3>
            <p>${query ? 'Try a different workout or exercise name.' : 'Finish a workout and the full session will be saved here automatically.'}</p>
            ${!query ? '<button class="btn btn-primary" type="button" data-route="workout">Start workout</button>' : ''}
          </div>`}
      </article>
    </section>
  `;
}

function renderHistoryRow(workout) {
  const rpeValues = (workout.exercises || []).flatMap(exercise => (exercise.sets || []).filter(set => set.done && set.rpe).map(set => Number(set.rpe)));
  return `
    <div class="history-row">
      <button class="history-main" type="button" data-action="view-workout" data-workout-id="${workout.id}" style="border:0;background:transparent;color:inherit;text-align:left;cursor:pointer;padding:0">
        <strong>${escapeHtml(workout.name)}</strong>
        <span>${formatDate(workout.endedAt || workout.startedAt, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} · ${(workout.exercises || []).map(exercise => exercise.name).slice(0, 3).join(', ')}${(workout.exercises || []).length > 3 ? '…' : ''}</span>
      </button>
      <div class="history-cell"><strong>${completedSets(workout)}</strong><span>sets</span></div>
      <div class="history-cell"><strong>${formatNumber(kgToDisplay(volumeForWorkout(workout)))}</strong><span>${weightUnit()} volume</span></div>
      <div class="history-cell"><strong>${formatCompactDuration(workoutDuration(workout))}</strong><span>duration</span></div>
      <div class="history-cell"><strong>${rpeValues.length ? round(avg(rpeValues), 1) : '—'}</strong><span>avg RPE</span></div>
      <button class="btn btn-icon btn-sm btn-ghost" type="button" data-action="history-menu" data-workout-id="${workout.id}" aria-label="Workout options">${icon('more')}</button>
    </div>
  `;
}

function renderProgressPage() {
  const series = weeklyVolumeSeries(12);
  const prs = recentPrs(365).slice(0, 8);
  const metrics = [...state.bodyMetrics].sort((a, b) => toDate(b.date) - toDate(a.date));
  const latestMetric = metrics[0];
  const oldestMetric = metrics.at(-1);
  const weightChangeKg = latestMetric?.weightKg && oldestMetric?.weightKg ? latestMetric.weightKg - oldestMetric.weightKg : 0;
  const distribution = muscleSetDistribution(28);
  const maxSets = Math.max(1, ...Object.values(distribution));
  const top = topExercises(1)[0]?.exercise;
  const strengthSeries = top ? exerciseProgressSeries(top.id, 12) : [];
  const consistency = clamp((weekWorkouts(0).length / Math.max(1, state.profile.weeklyGoal)) * 100, 0, 100);

  return `
    <section class="page">
      <div class="page-header">
        <div><h2>Progress you can prove</h2><p>Look beyond a single workout. Trends in consistency, strength, volume and measurements tell the real story.</p></div>
        <button class="btn btn-primary" type="button" data-action="add-body-metric">${icon('plus')} Log check-in</button>
      </div>

      <div class="grid grid-4" style="margin-bottom:18px">
        <article class="card stat-card"><div class="stat-top"><div class="stat-icon">${icon('progress')}</div><span class="trend">12 weeks</span></div><strong class="stat-value">${formatNumber(kgToDisplay(sum(series.map(item => item.valueKg))))}</strong><span class="stat-label">${weightUnit()} load volume</span></article>
        <article class="card stat-card"><div class="stat-top"><div class="stat-icon">${icon('trophy')}</div><span class="trend">All time</span></div><strong class="stat-value">${Object.keys(Object.fromEntries(state.workouts.flatMap(workout => (workout.exercises || []).map(exercise => [exercise.exerciseId, true])))).length}</strong><span class="stat-label">tracked movements</span></article>
        <article class="card stat-card"><div class="stat-top"><div class="stat-icon">${icon('scale')}</div><span class="trend ${weightChangeKg < 0 ? 'down' : ''}">${weightChangeKg ? `${weightChangeKg > 0 ? '+' : ''}${round(kgToDisplay(weightChangeKg), 1)} ${weightUnit()}` : 'No trend'}</span></div><strong class="stat-value">${latestMetric?.weightKg ? round(kgToDisplay(latestMetric.weightKg), 1) : '—'}</strong><span class="stat-label">current body weight ${latestMetric?.weightKg ? weightUnit() : ''}</span></article>
        <article class="card stat-card"><div class="stat-top"><div class="stat-icon">${icon('flame')}</div><span class="trend">${calculateWeeklyStreak()} weeks</span></div><strong class="stat-value">${Math.round(consistency)}%</strong><span class="stat-label">weekly goal progress</span></article>
      </div>

      <div class="grid grid-2">
        <article class="card card-pad">
          <div class="card-header">
            <div><h3>Weekly training trend</h3><p>Volume and completed sessions</p></div>
            <div class="segmented">
              <button class="${ui.progressMetric === 'volume' ? 'active' : ''}" type="button" data-action="set-progress-metric" data-metric="volume">Volume</button>
              <button class="${ui.progressMetric === 'workouts' ? 'active' : ''}" type="button" data-action="set-progress-metric" data-metric="workouts">Sessions</button>
            </div>
          </div>
          <div class="chart-wrap"><canvas id="progress-main-chart" class="chart-canvas"></canvas></div>
        </article>

        <article class="card card-pad">
          <div class="card-header"><div><h3>${top ? `${escapeHtml(top.name)} strength` : 'Strength trend'}</h3><p>Best estimated 1RM per session</p></div><span class="badge badge-blue">e1RM</span></div>
          ${strengthSeries.length >= 2 ? '<div class="chart-wrap"><canvas id="strength-chart" class="chart-canvas"></canvas></div>' : `<div class="empty-state" style="min-height:240px"><div class="empty-icon">${icon('progress')}</div><h3>Log repeat performances</h3><p>Strength trends appear after the same loaded exercise is recorded in at least two sessions.</p></div>`}
        </article>
      </div>

      <div class="grid grid-2" style="margin-top:18px">
        <article class="card card-pad">
          <div class="card-header"><div><h3>Muscle-group balance</h3><p>Completed working sets over 28 days</p></div></div>
          ${Object.keys(distribution).length ? `<div class="stack" style="gap:12px">${Object.entries(distribution).sort((a, b) => b[1] - a[1]).map(([muscle, sets]) => `
            <div>
              <div style="display:flex;justify-content:space-between;gap:10px;margin-bottom:7px;font-size:12px"><strong>${escapeHtml(muscle)}</strong><span style="color:var(--muted)">${sets} sets</span></div>
              <div class="rest-progress" style="margin:0"><span style="width:${(sets / maxSets) * 100}%"></span></div>
            </div>`).join('')}</div>` : `<div class="empty-state" style="min-height:220px"><div class="empty-icon">${icon('target')}</div><h3>No set distribution yet</h3><p>Complete working sets to see how your program is balanced.</p></div>`}
        </article>

        <article class="card card-pad">
          <div class="card-header"><div><h3>Body metrics</h3><p>Private manual check-ins</p></div><button class="btn btn-sm btn-secondary" type="button" data-action="add-body-metric">${icon('plus')} Add</button></div>
          ${metrics.length ? `<div class="list">${metrics.slice(0, 6).map(metric => `
            <div class="list-item">
              <div class="exercise-dot">${icon('scale')}</div>
              <div class="list-item-main"><strong>${metric.weightKg ? `${round(kgToDisplay(metric.weightKg), 1)} ${weightUnit()}` : 'Measurement check-in'}</strong><span>${formatDate(metric.date, { month: 'short', day: 'numeric', year: 'numeric' })}${metric.waistCm ? ` · Waist ${round(cmToDisplay(metric.waistCm), 1)} ${state.profile.units === 'lb' ? 'in' : 'cm'}` : ''}</span></div>
              <button class="btn btn-icon btn-sm btn-ghost" type="button" data-action="delete-body-metric" data-metric-id="${metric.id}" aria-label="Delete metric">${icon('trash')}</button>
            </div>`).join('')}</div>` : `<div class="empty-state" style="min-height:220px"><div class="empty-icon">${icon('scale')}</div><h3>Add your first check-in</h3><p>Track body weight and optional measurements without making them the only definition of progress.</p><button class="btn btn-primary" type="button" data-action="add-body-metric">Log check-in</button></div>`}
        </article>
      </div>

      <article class="card card-pad" style="margin-top:18px">
        <div class="card-header"><div><h3>Performance records</h3><p>Estimated strength PRs from logged working sets</p></div></div>
        ${prs.length ? `<div class="grid grid-4">${prs.slice(0, 4).map(pr => `
          <div class="metric-mini" style="padding:16px">
            <span class="badge badge-accent" style="margin-bottom:12px">${formatDate(pr.date)}</span>
            <strong style="font-size:15px">${escapeHtml(pr.name)}</strong>
            <span>${round(kgToDisplay(pr.weightKg), 1)} ${weightUnit()} × ${pr.reps} · e1RM ${round(kgToDisplay(pr.e1rm), 1)} ${weightUnit()}</span>
          </div>`).join('')}</div>` : `<div class="empty-state" style="min-height:210px"><div class="empty-icon">${icon('trophy')}</div><h3>PRs are waiting</h3><p>Log weight and reps consistently. SetFlow will flag new estimated performance records automatically.</p></div>`}
      </article>
    </section>
  `;
}

function renderCoachPage() {
  const tabs = [
    { id: 'insights', label: 'Insights', icon: 'sparkles' },
    { id: 'chat', label: 'Ask coach', icon: 'message' },
    { id: 'photos', label: 'Photo check-ins', icon: 'camera' }
  ];
  return `
    <section class="page">
      <article class="card coach-hero">
        <div class="coach-orb">${icon('sparkles')}</div>
        <h2>Coaching grounded in what you actually did.</h2>
        <p>SetFlow looks for useful signals in consistency, progressive overload, volume, effort and recovery. It does not replace a qualified coach or clinician.</p>
        <div class="filter-row" style="margin:20px 0 0">
          ${tabs.map(tab => `<button class="filter-btn ${ui.coachTab === tab.id ? 'active' : ''}" type="button" data-action="set-coach-tab" data-tab="${tab.id}">${icon(tab.icon)} ${tab.label}</button>`).join('')}
        </div>
      </article>
      <div style="margin-top:18px">${ui.coachTab === 'chat' ? renderCoachChat() : ui.coachTab === 'photos' ? renderPhotoCoach() : renderCoachInsights()}</div>
    </section>
  `;
}

function renderCoachInsights() {
  const insights = buildCoachInsights();
  const suggestion = nextWorkoutSuggestion();
  const template = state.templates.find(item => item.id === suggestion.templateId) || state.templates[0];
  const rpe = averageRpe(14);
  const week = weekWorkouts(0);
  const distribution = muscleSetDistribution(14);
  return `
    <div class="coach-layout">
      <div class="stack">
        <article class="card card-pad">
          <div class="card-header"><div><h3>Your current signals</h3><p>Updated from your latest completed sets</p></div><span class="badge badge-accent">${state.workouts.length ? 'Live data' : 'Starter mode'}</span></div>
          <div class="stack" style="gap:10px">${insights.map(item => `
            <div class="insight-card">
              <div class="insight-icon">${icon(item.icon)}</div>
              <div><h4>${escapeHtml(item.title)}</h4><p>${escapeHtml(item.text)}</p></div>
            </div>`).join('')}</div>
        </article>

        <article class="card card-pad">
          <div class="card-header"><div><h3>Next-session prescription</h3><p>A conservative recommendation, not a command</p></div></div>
          <div class="template-card" style="min-height:0">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><div class="template-icon">${icon('target')}</div><span class="badge badge-blue">Recommended</span></div>
            <h3>${escapeHtml(template?.name || 'Balanced session')}</h3>
            <p>${escapeHtml(suggestion.reason)}</p>
            <div class="metric-row" style="margin-bottom:16px">
              <div class="metric-mini"><strong>${template?.exerciseIds?.length || 0}</strong><span>movements</span></div>
              <div class="metric-mini"><strong>7–8</strong><span>target RPE</span></div>
              <div class="metric-mini"><strong>${Math.max(1, state.profile.weeklyGoal - week.length)}</strong><span>weekly left</span></div>
            </div>
            <button class="btn btn-primary" type="button" data-action="start-template" data-template-id="${template?.id || ''}">${icon('play')} Start recommended session</button>
          </div>
        </article>
      </div>

      <aside class="stack">
        <article class="card card-pad">
          <div class="card-header"><div><h3>Readiness snapshot</h3><p>Training-log signals only</p></div></div>
          <div style="display:flex;justify-content:center;margin:4px 0 18px"><div class="progress-ring" style="--progress:${clamp(rpe ? 105 - rpe * 7 : 70, 25, 95)}"><div class="progress-ring-content"><strong>${rpe ? Math.round(clamp(105 - rpe * 7, 25, 95)) : 70}</strong><span>signal score</span></div></div></div>
          <div class="list">
            <div class="list-item"><div class="exercise-dot">${icon('calendar')}</div><div class="list-item-main"><strong>${week.length}/${state.profile.weeklyGoal} sessions</strong><span>Weekly adherence</span></div></div>
            <div class="list-item"><div class="exercise-dot">${icon('info')}</div><div class="list-item-main"><strong>${rpe ? rpe.toFixed(1) : '—'} average RPE</strong><span>Last 14 days</span></div></div>
            <div class="list-item"><div class="exercise-dot">${icon('target')}</div><div class="list-item-main"><strong>${Object.keys(distribution).length} muscle groups</strong><span>Trained in 14 days</span></div></div>
          </div>
          <p class="help-text">This score cannot see sleep, illness, pain, stress or technique. Use judgment and stop if something feels wrong.</p>
        </article>

        <article class="card card-pad">
          <div class="card-header"><div><h3>Ask a specific question</h3><p>Get a focused answer from your logs</p></div></div>
          <div class="filter-row" style="margin-bottom:12px">
            ${['What should I train next?', 'Am I doing too much volume?', 'Should I deload?', 'How do I break a plateau?'].map(question => `<button class="filter-btn" type="button" data-action="quick-coach-question" data-question="${escapeHtml(question)}">${escapeHtml(question)}</button>`).join('')}
          </div>
          <button class="btn btn-secondary" type="button" data-action="set-coach-tab" data-tab="chat" style="width:100%">Open coach chat ${icon('chevron')}</button>
        </article>
      </aside>
    </div>
  `;
}

function renderCoachChat() {
  return `
    <div class="coach-layout">
      <article class="card card-pad">
        <div class="card-header">
          <div><h3>Ask SetFlow Coach</h3><p>Training guidance based on your saved data</p></div>
          <div class="connection-status"><span class="status-dot ${ui.aiOnline ? 'online' : ''}"></span>${ui.aiOnline ? `Connected${ui.aiModel ? ` · ${escapeHtml(ui.aiModel)}` : ''}` : 'Local coach mode'}</div>
        </div>
        <div id="coach-chat" class="coach-chat">
          ${state.coachMessages.slice(-30).map(message => `<div class="chat-bubble ${message.role === 'user' ? 'user' : 'assistant'}">${escapeHtml(message.text)}</div>`).join('')}
        </div>
        <form id="coach-form" class="chat-input-row">
          <label class="sr-only" for="coach-question">Ask your coach</label>
          <input id="coach-question" class="input" name="question" type="text" placeholder="Ask about your next session, volume, fatigue, plateaus…" autocomplete="off" required>
          <button class="btn btn-primary" type="submit">${icon('arrowUp')} Send</button>
        </form>
      </article>
      <aside class="stack">
        <article class="card card-pad">
          <div class="card-header"><div><h3>Useful prompts</h3><p>Questions the tracker can answer well</p></div></div>
          <div class="list">
            ${['What should I train next?', 'Which lift is progressing fastest?', 'Is my weekly volume jumping too quickly?', 'Do my logged RPEs suggest a lighter session?', 'How balanced are my muscle groups?'].map(question => `<button class="list-item" type="button" data-action="quick-coach-question" data-question="${escapeHtml(question)}" style="cursor:pointer;color:inherit;text-align:left"><div class="exercise-dot">${icon('message')}</div><div class="list-item-main"><strong>${escapeHtml(question)}</strong><span>Ask coach</span></div>${icon('chevron')}</button>`).join('')}
          </div>
        </article>
        <div class="privacy-note">${icon('lock')}<p>Your workout data stays in this browser. When the optional AI server is connected, only the prompt and relevant summary are sent for that request.</p></div>
      </aside>
    </div>
  `;
}

function photoForId(id) {
  return ui.photos.find(photo => photo.id === id);
}

function photosForCheckin(checkin) {
  return (checkin.photoIds || []).map(photoForId).filter(Boolean);
}

function renderPhotoCoach() {
  const checkins = [...state.photoCheckins].sort((a, b) => toDate(b.date) - toDate(a.date));
  const compare = checkins.flatMap(checkin => photosForCheckin(checkin).map(photo => ({ ...photo, checkin }))).filter(photo => photo.view === 'front').slice(0, 2);
  return `
    <div class="coach-layout">
      <div class="stack">
        <article class="card card-pad">
          <div class="card-header"><div><h3>New private photo check-in</h3><p>Front, side and back photos work best when conditions match</p></div><span class="badge badge-accent">${ui.aiOnline ? 'Visual AI ready' : 'Local quality check'}</span></div>
          <label class="photo-uploader" id="photo-dropzone">
            <input id="photo-input" type="file" accept="image/jpeg,image/png,image/webp" multiple>
            <div>
              <div class="empty-icon">${icon('upload')}</div>
              <h3>Choose progress photos</h3>
              <p>Tap to select or drop up to three images. Photos stay on this device unless you request connected AI feedback.</p>
            </div>
          </label>
          ${ui.pendingPhotos.length ? `<div class="photo-preview-grid">${ui.pendingPhotos.map((photo, index) => `
            <div>
              <div class="photo-preview">
                <img src="${photo.previewUrl}" alt="Pending progress photo ${index + 1}">
                <button class="remove-photo" type="button" data-action="remove-pending-photo" data-photo-index="${index}" aria-label="Remove photo">${icon('close')}</button>
              </div>
              <select class="select select-sm" style="margin-top:7px" data-pending-photo-view="${index}" aria-label="Photo view">
                <option value="front" ${photo.view === 'front' ? 'selected' : ''}>Front</option>
                <option value="side" ${photo.view === 'side' ? 'selected' : ''}>Side</option>
                <option value="back" ${photo.view === 'back' ? 'selected' : ''}>Back</option>
                <option value="other" ${photo.view === 'other' ? 'selected' : ''}>Other</option>
              </select>
            </div>`).join('')}</div>` : ''}
          <div class="form-grid" style="margin-top:16px">
            <div class="form-group"><label class="label" for="photo-date">Date</label><input id="photo-date" class="input" type="date" value="${escapeHtml(ui.photoDraft.date)}"></div>
            <div class="form-group"><label class="label" for="photo-weight">Body weight (${weightUnit()}) <span>optional</span></label><input id="photo-weight" class="input" type="number" min="0" step="0.1" value="${escapeHtml(ui.photoDraft.weight)}" placeholder="—"></div>
            <div class="form-group full"><label class="label" for="photo-note">Context <span>optional</span></label><textarea id="photo-note" class="textarea" placeholder="Same lighting? Morning or evening? Training phase? Anything that helps comparison.">${escapeHtml(ui.photoDraft.note)}</textarea></div>
          </div>
          ${ui.photoAnalysis ? `<div class="insight-card" style="margin-top:14px"><div class="insight-icon">${icon('sparkles')}</div><div><h4>Photo feedback</h4><p style="white-space:pre-wrap">${escapeHtml(ui.photoAnalysis)}</p></div></div>` : ''}
          <div class="inline-actions" style="margin-top:16px">
            <button class="btn btn-secondary" type="button" data-action="analyze-photos" ${ui.pendingPhotos.length ? '' : 'disabled'}>${icon('sparkles')} ${ui.aiOnline ? 'Get AI feedback' : 'Check photo quality'}</button>
            <button class="btn btn-primary" type="button" data-action="save-photo-checkin" ${ui.pendingPhotos.length ? '' : 'disabled'}>${icon('check')} Save check-in</button>
          </div>
          <div class="privacy-note" style="margin-top:14px">${icon('lock')}<p>SetFlow will not estimate body-fat percentage, diagnose health, or judge attractiveness from a photo. Feedback focuses on comparison quality, pose consistency and neutral visible trends.</p></div>
        </article>

        <article class="card card-pad">
          <div class="card-header"><div><h3>Photo timeline</h3><p>${checkins.length} private check-in${checkins.length === 1 ? '' : 's'}</p></div></div>
          ${checkins.length ? `<div class="photo-gallery">${checkins.slice(0, 12).map(checkin => {
            const photo = photosForCheckin(checkin)[0];
            return photo ? `<button class="checkin-card" type="button" data-action="view-photo-checkin" data-checkin-id="${checkin.id}" style="cursor:pointer;color:inherit;text-align:left;padding:0"><div class="checkin-image"><img src="${photo.url}" alt="${escapeHtml(photo.view)} progress photo from ${formatDate(checkin.date)}"><span class="photo-label">${escapeHtml(photo.view)}</span></div><div class="checkin-meta"><strong>${formatDate(checkin.date, { month: 'short', day: 'numeric', year: 'numeric' })}</strong><span>${checkin.weightKg ? `${round(kgToDisplay(checkin.weightKg), 1)} ${weightUnit()} · ` : ''}${checkin.photoIds.length} view${checkin.photoIds.length === 1 ? '' : 's'}</span></div></button>` : '';
          }).join('')}</div>` : `<div class="empty-state" style="min-height:240px"><div class="empty-icon">${icon('camera')}</div><h3>No photo check-ins yet</h3><p>Take your first baseline. The most useful comparison is often several weeks away.</p></div>`}
        </article>
      </div>

      <aside class="stack">
        <article class="card card-pad">
          <div class="card-header"><div><h3>Consistent comparison</h3><p>Same view, different dates</p></div></div>
          ${compare.length >= 2 ? `<div class="compare-stage">${compare.reverse().map(item => `<div class="compare-pane"><img src="${item.url}" alt="Front check-in from ${formatDate(item.checkin.date)}"><span>${formatDate(item.checkin.date)}</span></div>`).join('')}</div>` : `<div class="empty-state" style="min-height:260px;padding:20px"><div class="empty-icon">${icon('refresh')}</div><h3>Two matching views needed</h3><p>Save at least two front-view check-ins to unlock side-by-side comparison.</p></div>`}
        </article>
        <article class="card card-pad">
          <div class="card-header"><div><h3>Better check-ins</h3><p>Reduce noise in the comparison</p></div></div>
          <div class="list">
            ${[
              ['camera', 'Match camera height', 'Place the lens at roughly mid-torso height and use the same distance.'],
              ['sun', 'Match lighting', 'Use the same room and direction of light; avoid dramatic overhead shadows.'],
              ['clock', 'Match timing', 'Morning photos under similar food, hydration and training conditions are easier to compare.'],
              ['refresh', 'Use a longer window', 'Look for trends across 4–8 weeks rather than reacting to daily changes.']
            ].map(([ic, title, text]) => `<div class="insight-card"><div class="insight-icon">${icon(ic)}</div><div><h4>${title}</h4><p>${text}</p></div></div>`).join('')}
          </div>
        </article>
      </aside>
    </div>
  `;
}

function localPhotoFeedback() {
  if (!ui.pendingPhotos.length) return 'Add at least one photo first.';
  const notes = [];
  const brightness = ui.pendingPhotos.map(photo => photo.stats.brightness);
  const contrast = ui.pendingPhotos.map(photo => photo.stats.contrast);
  const sharpness = ui.pendingPhotos.map(photo => photo.stats.sharpness);
  const minBrightness = Math.min(...brightness);
  const maxBrightness = Math.max(...brightness);
  if (minBrightness < 55) notes.push('One or more photos are quite dark. Use a brighter, front-lit setup so details are not hidden by shadow.');
  else if (maxBrightness > 215) notes.push('One or more photos are very bright. Reduce direct light or exposure to avoid washed-out areas.');
  else notes.push('Exposure is in a workable range for a repeatable check-in.');
  if (maxBrightness - minBrightness > 40) notes.push('Lighting varies noticeably between the selected views. Matching exposure will make future comparisons fairer.');
  if (Math.min(...contrast) < 24) notes.push('Contrast is low in at least one image. A plain background that differs from your clothing can improve separation.');
  if (Math.min(...sharpness) < 12) notes.push('At least one image may be soft or motion-blurred. Stabilize the phone or use a short timer.');
  const prior = state.photoCheckins[0];
  if (prior) notes.push(`Your last saved check-in was ${Math.abs(daysBetween(prior.date, new Date()))} days ago. Longer intervals usually reveal more meaningful visual trends.`);
  notes.push('Use neutral observations alongside strength, measurements, energy and how clothing fits. Do not use a photo alone to infer health or an exact body-fat percentage.');
  return notes.map((note, index) => `${index + 1}. ${note}`).join('\n');
}

function renderLibraryPage() {
  const muscles = ['All', ...new Set(EXERCISES.map(exercise => exercise.muscle))];
  const query = ui.librarySearch.trim().toLowerCase();
  const filtered = EXERCISES.filter(exercise => {
    const matchesMuscle = ui.libraryMuscle === 'All' || exercise.muscle === ui.libraryMuscle;
    const haystack = `${exercise.name} ${exercise.muscle} ${exercise.equipment} ${exercise.pattern}`.toLowerCase();
    return matchesMuscle && (!query || haystack.includes(query));
  });
  return `
    <section class="page">
      <div class="page-header"><div><h2>Movement library</h2><p>Clear exercise categories and concise form cues for beginners through experienced lifters.</p></div><button class="btn btn-primary" type="button" data-action="add-custom-exercise">${icon('plus')} Custom exercise</button></div>
      <article class="card card-pad" style="margin-bottom:14px">
        <div class="search-wrap">${icon('search')}<input id="library-search" class="input" type="search" value="${escapeHtml(ui.librarySearch)}" placeholder="Search by movement, muscle or equipment…" autocomplete="off"></div>
      </article>
      <div class="filter-row">${muscles.map(muscle => `<button class="filter-btn ${ui.libraryMuscle === muscle ? 'active' : ''}" type="button" data-action="filter-library" data-muscle="${escapeHtml(muscle)}">${escapeHtml(muscle)}</button>`).join('')}</div>
      <div class="exercise-library">
        ${filtered.map(exercise => `
          <button class="library-card" type="button" data-action="show-exercise" data-exercise-library-id="${exercise.id}" style="cursor:pointer;color:inherit;text-align:left">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px"><div class="exercise-dot">${escapeHtml(exercise.muscle.slice(0, 2))}</div><span class="badge">${escapeHtml(exercise.level)}</span></div>
            <h3>${escapeHtml(exercise.name)}</h3>
            <p>${escapeHtml(exercise.cue)}</p>
            <div class="library-tags"><span class="badge badge-accent">${escapeHtml(exercise.muscle)}</span><span class="badge">${escapeHtml(exercise.equipment)}</span></div>
          </button>`).join('')}
      </div>
      ${!filtered.length ? `<div class="card empty-state" style="margin-top:14px"><div class="empty-icon">${icon('search')}</div><h3>No exercises found</h3><p>Try another search or clear the muscle filter.</p><button class="btn btn-secondary" type="button" data-action="clear-library-filter">Clear filters</button></div>` : ''}
    </section>
  `;
}

function renderSettingsPage() {
  return `
    <section class="page">
      <div class="page-header"><div><h2>Make SetFlow yours</h2><p>Adjust coaching context, training preferences and local data controls.</p></div></div>
      <div class="grid grid-2">
        <div class="stack">
          <article class="card card-pad">
            <div class="card-header"><div><h3>Profile & goals</h3><p>Used to personalize labels and coaching context</p></div></div>
            <form id="settings-profile-form" class="form-grid">
              <div class="form-group full"><label class="label" for="profile-name">Name</label><input id="profile-name" name="name" class="input" type="text" value="${escapeHtml(state.profile.name)}" required></div>
              <div class="form-group"><label class="label" for="profile-experience">Experience</label><select id="profile-experience" name="experience" class="select"><option value="beginner" ${state.profile.experience === 'beginner' ? 'selected' : ''}>Beginner</option><option value="intermediate" ${state.profile.experience === 'intermediate' ? 'selected' : ''}>Intermediate</option><option value="advanced" ${state.profile.experience === 'advanced' ? 'selected' : ''}>Advanced</option></select></div>
              <div class="form-group"><label class="label" for="profile-goal">Primary goal</label><select id="profile-goal" name="goal" class="select"><option value="build-muscle" ${state.profile.goal === 'build-muscle' ? 'selected' : ''}>Build muscle</option><option value="strength" ${state.profile.goal === 'strength' ? 'selected' : ''}>Get stronger</option><option value="general-fitness" ${state.profile.goal === 'general-fitness' ? 'selected' : ''}>General fitness</option><option value="fat-loss" ${state.profile.goal === 'fat-loss' ? 'selected' : ''}>Fat loss support</option><option value="athletic" ${state.profile.goal === 'athletic' ? 'selected' : ''}>Athletic performance</option></select></div>
              <div class="form-group"><label class="label" for="profile-units">Units</label><select id="profile-units" name="units" class="select"><option value="lb" ${state.profile.units === 'lb' ? 'selected' : ''}>Pounds / miles / inches</option><option value="kg" ${state.profile.units === 'kg' ? 'selected' : ''}>Kilograms / kilometers / cm</option></select></div>
              <div class="form-group"><label class="label" for="profile-weekly-goal">Weekly workouts</label><input id="profile-weekly-goal" name="weeklyGoal" class="input" type="number" min="1" max="7" value="${state.profile.weeklyGoal}"></div>
              <div class="form-group full"><label class="label" for="profile-weight">Current body weight (${weightUnit()}) <span>optional</span></label><input id="profile-weight" name="bodyWeight" class="input" type="number" min="0" step="0.1" value="${state.profile.bodyWeightKg ? round(kgToDisplay(state.profile.bodyWeightKg), 1) : ''}" placeholder="—"></div>
              <div class="form-group full"><button class="btn btn-primary" type="submit">${icon('check')} Save profile</button></div>
            </form>
          </article>

          <article class="card card-pad">
            <div class="card-header"><div><h3>Workout preferences</h3><p>Defaults you can change any time</p></div></div>
            <div class="settings-list">
              <div class="setting-row"><div class="setting-copy"><strong>Automatic rest timer</strong><span>Start the timer when a set is completed</span></div><label class="switch"><input type="checkbox" data-setting-toggle="autoRestTimer" ${state.settings.autoRestTimer ? 'checked' : ''}><span class="switch-track"></span></label></div>
              <div class="setting-row"><div class="setting-copy"><strong>Show RPE</strong><span>Track perceived effort from 1–10 on each set</span></div><label class="switch"><input type="checkbox" data-setting-toggle="showRpe" ${state.settings.showRpe ? 'checked' : ''}><span class="switch-track"></span></label></div>
              <div class="setting-row"><div class="setting-copy"><strong>Timer sound</strong><span>Play a short tone when rest finishes</span></div><label class="switch"><input type="checkbox" data-setting-toggle="sounds" ${state.settings.sounds ? 'checked' : ''}><span class="switch-track"></span></label></div>
              <div class="setting-row"><div class="setting-copy"><strong>Default rest time</strong><span>Applied after completed working sets</span></div><select class="select" style="width:130px" data-setting-select="restTimerSec"><option value="60" ${state.settings.restTimerSec === 60 ? 'selected' : ''}>60 sec</option><option value="90" ${state.settings.restTimerSec === 90 ? 'selected' : ''}>90 sec</option><option value="120" ${state.settings.restTimerSec === 120 ? 'selected' : ''}>2 min</option><option value="180" ${state.settings.restTimerSec === 180 ? 'selected' : ''}>3 min</option><option value="240" ${state.settings.restTimerSec === 240 ? 'selected' : ''}>4 min</option></select></div>
              <div class="setting-row"><div class="setting-copy"><strong>Appearance</strong><span>Switch between dark and light themes</span></div><button class="btn btn-secondary" type="button" data-action="toggle-theme">${icon(state.settings.theme === 'dark' ? 'sun' : 'moon')} ${state.settings.theme === 'dark' ? 'Light mode' : 'Dark mode'}</button></div>
            </div>
          </article>
        </div>

        <div class="stack">
          ${renderAccountCard()}
          <article class="card card-pad">
            <div class="card-header"><div><h3>AI coach connection</h3><p>Optional server-side visual and text coaching</p></div><div class="connection-status"><span class="status-dot ${ui.aiOnline ? 'online' : ''}"></span>${ui.aiOnline ? 'Connected' : 'Local mode'}</div></div>
            <div class="insight-card"><div class="insight-icon">${icon(ui.aiOnline ? 'check' : 'lock')}</div><div><h4>${ui.aiOnline ? `Connected${ui.aiModel ? ` to ${escapeHtml(ui.aiModel)}` : ''}` : 'No API key required for core features'}</h4><p>${ui.aiOnline ? 'Coach questions and requested photo feedback can use the connected model. Photos are sent only when you press the feedback button.' : 'Rule-based coaching, photo-quality checks, workout tracking and analytics work locally. Run the included server with your own API key to enable model-based feedback.'}</p></div></div>
            <button class="btn btn-secondary" style="margin-top:12px" type="button" data-action="check-ai-status">${icon('refresh')} Check connection</button>
          </article>

          <article class="card card-pad">
            <div class="card-header"><div><h3>Backup & portability</h3><p>Your data belongs to you</p></div></div>
            <div class="list">
              <button class="list-item" type="button" data-action="export-data" style="cursor:pointer;color:inherit;text-align:left"><div class="exercise-dot">${icon('download')}</div><div class="list-item-main"><strong>Export full backup</strong><span>Workout data, settings and stored photos in one JSON file</span></div>${icon('chevron')}</button>
              <button class="list-item" type="button" data-action="import-data" style="cursor:pointer;color:inherit;text-align:left"><div class="exercise-dot">${icon('upload')}</div><div class="list-item-main"><strong>Import backup</strong><span>Restore a SetFlow JSON backup on this device</span></div>${icon('chevron')}</button>
              <input id="import-file" class="hidden" type="file" accept="application/json,.json">
              <button class="list-item" type="button" data-action="load-demo" style="cursor:pointer;color:inherit;text-align:left"><div class="exercise-dot">${icon('sparkles')}</div><div class="list-item-main"><strong>Load realistic demo data</strong><span>Explore charts, PRs and coach insights with sample history</span></div>${icon('chevron')}</button>
            </div>
          </article>

          <article class="card card-pad">
            <div class="card-header"><div><h3>Privacy & safety</h3><p>Built for useful feedback without harmful claims</p></div></div>
            <div class="stack" style="gap:10px">
              <div class="privacy-note">${icon('lock')}<p>${auth.user ? 'Workout data syncs to your private account and is cached on this device. Progress-photo files remain device-local.' : 'Workout data and progress photos are stored on this device in guest mode.'} Export backups regularly for extra protection.</p></div>
              <div class="privacy-note">${icon('info')}<p>SetFlow is a training log, not medical care. It cannot diagnose injuries, prescribe rehabilitation, assess eating disorders or determine health from appearance.</p></div>
            </div>
            <div class="divider"></div>
            <button class="btn btn-danger" type="button" data-action="reset-app">${icon('trash')} Erase all local data</button>
          </article>

          <article class="card card-pad">
            <div class="card-header"><div><h3>About SetFlow</h3><p>Version 1.1 · multi-user cloud-sync build</p></div></div>
            <p style="margin:0">Designed as a complete personal workout tracker: strength and cardio sets, templates, history, volume, estimated PRs, body metrics, private photo check-ins, backups and optional connected AI feedback.</p>
          </article>
        </div>
      </div>
    </section>
  `;
}

function renderOnboarding() {
  const draft = ui.onboardingDraft;
  const step = ui.onboardingStep;
  const goalChoices = [
    ['build-muscle', 'Build muscle', 'Progressive resistance with sustainable volume.', 'dumbbell'],
    ['strength', 'Get stronger', 'Prioritize repeatable performance on key lifts.', 'trophy'],
    ['general-fitness', 'General fitness', 'Balanced strength, conditioning and consistency.', 'flame'],
    ['fat-loss', 'Fat loss support', 'Track training while using a sustainable overall plan.', 'progress'],
    ['athletic', 'Athletic performance', 'Build strength and work capacity around sport.', 'target']
  ];
  return `
    <main class="onboarding">
      <section class="onboarding-card">
        <div class="onboarding-hero">
          <div class="brand"><div class="brand-mark">${icon('logo')}</div><div class="brand-copy"><strong>SetFlow</strong><span>Train · Track · Evolve</span></div></div>
          <h1>${step === 1 ? 'Your progress needs a system.' : step === 2 ? 'Meet the tracker where you are.' : 'Build around what matters to you.'}</h1>
          <p>${step === 1 ? 'Log every useful set, see the trend and get practical feedback without turning training into spreadsheet work.' : step === 2 ? 'The same clean workflow scales from your first gym session to years of structured lifting.' : 'These choices tune the defaults. You can change everything later in Settings.'}</p>
        </div>
        <div class="onboarding-form">
          <div class="onboarding-progress"><span class="active"></span><span class="${step >= 2 ? 'active' : ''}"></span><span class="${step >= 3 ? 'active' : ''}"></span></div>
          ${step === 1 ? `
            <div class="form-grid">
              <div class="form-group full"><label class="label" for="onboard-name">What should we call you?</label><input id="onboard-name" class="input" type="text" value="${escapeHtml(draft.name || '')}" placeholder="Your name" data-onboarding-input="name" autofocus></div>
              <div class="form-group"><label class="label" for="onboard-units">Preferred units</label><select id="onboard-units" class="select" data-onboarding-input="units"><option value="lb" ${draft.units === 'lb' ? 'selected' : ''}>Pounds / miles / inches</option><option value="kg" ${draft.units === 'kg' ? 'selected' : ''}>Kilograms / kilometers / cm</option></select></div>
              <div class="form-group"><label class="label" for="onboard-weight">Body weight <span>optional</span></label><input id="onboard-weight" class="input" type="number" min="0" step="0.1" value="${draft.bodyWeightDisplay || ''}" placeholder="${draft.units === 'lb' ? 'lb' : 'kg'}" data-onboarding-input="bodyWeightDisplay"></div>
            </div>` : step === 2 ? `
            <p class="section-label">Training experience</p>
            <div class="choice-grid">
              ${[
                ['beginner', 'Beginner', 'New or returning after a long break.', 'plus'],
                ['intermediate', 'Intermediate', 'Consistent training and familiar with core lifts.', 'progress'],
                ['advanced', 'Advanced', 'Years of structured training and deliberate programming.', 'trophy']
              ].map(([value, title, text, ic]) => `<button class="choice-card ${draft.experience === value ? 'selected' : ''}" type="button" data-onboarding-choice="experience" data-value="${value}">${icon(ic)}<strong>${title}</strong><span>${text}</span></button>`).join('')}
            </div>` : `
            <p class="section-label">Primary focus</p>
            <div class="choice-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">
              ${goalChoices.map(([value, title, text, ic]) => `<button class="choice-card ${draft.goal === value ? 'selected' : ''}" type="button" data-onboarding-choice="goal" data-value="${value}">${icon(ic)}<strong>${title}</strong><span>${text}</span></button>`).join('')}
            </div>
            <div class="form-group" style="margin-top:16px"><label class="label" for="onboard-weekly">How many workouts per week?</label><input id="onboard-weekly" class="input" type="number" min="1" max="7" value="${draft.weeklyGoal || 4}" data-onboarding-input="weeklyGoal"></div>`}
          <div class="inline-actions" style="justify-content:${step === 1 ? 'flex-end' : 'space-between'};margin-top:24px">
            ${step > 1 ? `<button class="btn btn-ghost" type="button" data-action="onboarding-back">Back</button>` : ''}
            <button class="btn btn-primary btn-lg" type="button" data-action="${step < 3 ? 'onboarding-next' : 'finish-onboarding'}">${step < 3 ? 'Continue' : 'Enter SetFlow'} ${icon(step < 3 ? 'chevron' : 'check')}</button>
          </div>
        </div>
      </section>
    </main>
  `;
}

function openModal({ title, subtitle = '', body = '', footer = '', wide = false }) {
  ui.modalOpen = true;
  const root = document.getElementById('modal-root');
  root.innerHTML = `
    <div class="modal-backdrop" data-action="close-modal" role="presentation">
      <section class="modal ${wide ? 'modal-wide' : ''}" role="dialog" aria-modal="true" aria-labelledby="modal-title" data-modal-panel>
        <header class="modal-header">
          <div><h2 id="modal-title">${escapeHtml(title)}</h2>${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ''}</div>
          <button class="btn btn-icon btn-ghost" type="button" data-action="close-modal" aria-label="Close dialog">${icon('close')}</button>
        </header>
        <div class="modal-body">${body}</div>
        ${footer ? `<footer class="modal-footer">${footer}</footer>` : ''}
      </section>
    </div>`;
  requestAnimationFrame(() => root.querySelector('input:not([type="hidden"]), select, textarea, button')?.focus());
}

function closeModal() {
  ui.modalOpen = false;
  document.getElementById('modal-root').innerHTML = '';
}

function toast(title, message = '', type = 'success') {
  const root = document.getElementById('toast-root');
  if (!root) return;
  const item = document.createElement('div');
  item.className = 'toast';
  const iconName = type === 'error' ? 'info' : type === 'warning' ? 'info' : 'check';
  item.innerHTML = `<div class="insight-icon" style="width:34px;height:34px">${icon(iconName)}</div><div><strong>${escapeHtml(title)}</strong>${message ? `<span>${escapeHtml(message)}</span>` : ''}</div>`;
  root.appendChild(item);
  setTimeout(() => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(12px)';
    setTimeout(() => item.remove(), 180);
  }, 3600);
}

function navigate(route) {
  ui.route = route;
  const hash = `#/${route}`;
  if (location.hash !== hash) history.pushState(null, '', hash);
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function prepareCanvas(canvas) {
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const width = Math.max(300, Math.round(rect.width || canvas.parentElement?.clientWidth || 600));
  const height = Math.max(180, Math.round(rect.height || 240));
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  return { ctx, width, height };
}

function drawEmptyChart(ctx, width, height, message = 'Complete workouts to build this trend') {
  ctx.fillStyle = cssVar('--muted');
  ctx.font = '12px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(message, width / 2, height / 2);
}

function drawLineChart(canvas, values, labels, { formatValue = value => formatNumber(value), area = true } = {}) {
  const prepared = prepareCanvas(canvas);
  if (!prepared) return;
  const { ctx, width, height } = prepared;
  const pad = { top: 18, right: 16, bottom: 34, left: 48 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  if (!values.length || values.every(value => !Number.isFinite(value))) return drawEmptyChart(ctx, width, height);
  const clean = values.map(value => Number(value) || 0);
  const max = Math.max(...clean, 1);
  const min = Math.min(...clean, 0);
  const range = Math.max(1, max - min);
  const yMin = Math.max(0, min - range * 0.08);
  const yMax = max + range * 0.14;
  const line = cssVar('--accent');
  const grid = cssVar('--line');
  const muted = cssVar('--muted');

  ctx.strokeStyle = grid;
  ctx.lineWidth = 1;
  ctx.fillStyle = muted;
  ctx.font = '10px Inter, system-ui, sans-serif';
  ctx.textAlign = 'right';
  for (let index = 0; index <= 4; index += 1) {
    const y = pad.top + (chartH * index) / 4;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    const value = yMax - ((yMax - yMin) * index) / 4;
    ctx.fillText(formatValue(value), pad.left - 8, y + 3);
  }

  const points = clean.map((value, index) => ({
    x: pad.left + (clean.length === 1 ? chartW / 2 : (chartW * index) / (clean.length - 1)),
    y: pad.top + chartH - ((value - yMin) / (yMax - yMin)) * chartH
  }));

  if (area && points.length > 1) {
    const gradient = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
    gradient.addColorStop(0, 'rgba(183, 244, 92, 0.22)');
    gradient.addColorStop(1, 'rgba(183, 244, 92, 0)');
    ctx.beginPath();
    ctx.moveTo(points[0].x, pad.top + chartH);
    points.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.lineTo(points.at(-1).x, pad.top + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  ctx.beginPath();
  points.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
  ctx.strokeStyle = line;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();

  points.forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = cssVar('--panel');
    ctx.fill();
    ctx.strokeStyle = line;
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  ctx.fillStyle = muted;
  ctx.font = '10px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  const labelStep = Math.max(1, Math.ceil(labels.length / 6));
  labels.forEach((label, index) => {
    if (index % labelStep !== 0 && index !== labels.length - 1) return;
    ctx.fillText(label, points[index].x, height - 11);
  });
}

function drawBarChart(canvas, values, labels, { formatValue = value => formatNumber(value) } = {}) {
  const prepared = prepareCanvas(canvas);
  if (!prepared) return;
  const { ctx, width, height } = prepared;
  const pad = { top: 18, right: 14, bottom: 34, left: 42 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const clean = values.map(value => Number(value) || 0);
  if (!clean.length || clean.every(value => value === 0)) return drawEmptyChart(ctx, width, height);
  const max = Math.max(...clean, 1) * 1.15;
  const gap = Math.max(5, chartW / clean.length * 0.28);
  const barW = Math.max(7, chartW / clean.length - gap);
  const muted = cssVar('--muted');
  const grid = cssVar('--line');
  ctx.strokeStyle = grid;
  ctx.fillStyle = muted;
  ctx.font = '10px Inter, system-ui, sans-serif';
  ctx.textAlign = 'right';
  for (let index = 0; index <= 4; index += 1) {
    const y = pad.top + (chartH * index) / 4;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    ctx.fillText(formatValue(max - (max * index) / 4), pad.left - 7, y + 3);
  }
  clean.forEach((value, index) => {
    const x = pad.left + (chartW * index) / clean.length + gap / 2;
    const h = (value / max) * chartH;
    const y = pad.top + chartH - h;
    ctx.fillStyle = cssVar('--accent');
    ctx.beginPath();
    const radius = Math.min(6, barW / 2, h);
    ctx.roundRect(x, y, barW, h, [radius, radius, 2, 2]);
    ctx.fill();
  });
  ctx.fillStyle = muted;
  ctx.textAlign = 'center';
  const step = Math.max(1, Math.ceil(labels.length / 6));
  labels.forEach((label, index) => {
    if (index % step !== 0 && index !== labels.length - 1) return;
    const x = pad.left + (chartW * index) / clean.length + chartW / clean.length / 2;
    ctx.fillText(label, x, height - 11);
  });
}

function drawVisibleCharts() {
  const dashboard = document.getElementById('dashboard-volume-chart');
  if (dashboard) {
    const series = weeklyVolumeSeries(8);
    drawLineChart(dashboard, series.map(item => kgToDisplay(item.valueKg)), series.map(item => item.label), { formatValue: value => formatNumber(value) });
  }
  const progress = document.getElementById('progress-main-chart');
  if (progress) {
    const series = weeklyVolumeSeries(12);
    if (ui.progressMetric === 'workouts') drawBarChart(progress, series.map(item => item.workouts), series.map(item => item.label), { formatValue: value => Math.round(value) });
    else drawLineChart(progress, series.map(item => kgToDisplay(item.valueKg)), series.map(item => item.label), { formatValue: value => formatNumber(value) });
  }
  const strength = document.getElementById('strength-chart');
  if (strength) {
    const top = topExercises(1)[0]?.exercise;
    const series = top ? exerciseProgressSeries(top.id, 12) : [];
    drawLineChart(strength, series.map(item => kgToDisplay(item.valueKg)), series.map(item => formatDate(item.date)), { formatValue: value => formatNumber(value, 1) });
  }
}

function renderExercisePickerItems(exercises) {
  return exercises.map(exercise => `
    <button class="list-item" type="button" data-action="select-exercise" data-exercise-library-id="${exercise.id}" style="cursor:pointer;color:inherit;text-align:left">
      <div class="exercise-dot">${escapeHtml(exercise.muscle.slice(0, 2))}</div>
      <div class="list-item-main"><strong>${escapeHtml(exercise.name)}</strong><span>${escapeHtml(exercise.muscle)} · ${escapeHtml(exercise.equipment)} · ${escapeHtml(exercise.pattern)}</span></div>
      ${icon('plus')}
    </button>`).join('');
}

function openAddExerciseModal() {
  openModal({
    title: 'Add exercise',
    subtitle: `${EXERCISES.length} movements available`,
    wide: true,
    body: `
      <div class="search-wrap">${icon('search')}<input id="exercise-picker-search" class="input" type="search" placeholder="Search movement, muscle or equipment…" autocomplete="off"></div>
      <div id="exercise-picker-list" class="list" style="margin-top:14px;max-height:55vh;overflow-y:auto">${renderExercisePickerItems(EXERCISES)}</div>`
  });
}

function openExerciseDetail(exerciseId) {
  const exercise = EXERCISES.find(item => item.id === exerciseId);
  if (!exercise) return;
  const best = bestSetForExercise(state.workouts, exerciseId);
  const recent = exerciseProgressSeries(exerciseId, 8);
  openModal({
    title: exercise.name,
    subtitle: `${exercise.muscle} · ${exercise.equipment} · ${exercise.pattern}`,
    body: `
      <div class="insight-card"><div class="insight-icon">${icon('info')}</div><div><h4>Primary form cue</h4><p>${escapeHtml(exercise.cue)}</p></div></div>
      <div class="metric-row" style="margin-top:14px">
        <div class="metric-mini"><strong>${escapeHtml(exercise.muscle)}</strong><span>primary muscle</span></div>
        <div class="metric-mini"><strong>${escapeHtml(exercise.level)}</strong><span>experience level</span></div>
        <div class="metric-mini"><strong>${best ? `${round(kgToDisplay(best.weightKg), 1)} × ${best.reps}` : '—'}</strong><span>${best ? `best ${weightUnit()} set` : 'no logged sets'}</span></div>
      </div>
      ${exercise.secondary?.length ? `<div style="margin-top:16px"><p class="section-label">Secondary muscles</p><div class="library-tags">${exercise.secondary.map(item => `<span class="badge">${escapeHtml(item)}</span>`).join('')}</div></div>` : ''}
      <div class="privacy-note" style="margin-top:16px">${icon('info')}<p>Use a pain-free range you can control. A short cue cannot assess your individual anatomy, injury history or technique in real time.</p></div>
      ${recent.length >= 2 ? `<div style="margin-top:16px"><p class="section-label">Logged strength trend</p><div class="list">${recent.slice(-4).reverse().map(item => `<div class="list-item"><div class="exercise-dot">${icon('progress')}</div><div class="list-item-main"><strong>${round(kgToDisplay(item.valueKg), 1)} ${weightUnit()} e1RM</strong><span>${formatDate(item.date, { month: 'short', day: 'numeric', year: 'numeric' })}</span></div></div>`).join('')}</div></div>` : ''}`,
    footer: state.activeWorkout ? `<button class="btn btn-ghost" type="button" data-action="close-modal">Close</button><button class="btn btn-primary" type="button" data-action="select-exercise" data-exercise-library-id="${exercise.id}">${icon('plus')} Add to workout</button>` : `<button class="btn btn-primary" type="button" data-action="close-modal">Done</button>`
  });
}

function openExerciseMenu(workoutExerciseId) {
  const workout = state.activeWorkout;
  const index = workout?.exercises.findIndex(exercise => exercise.id === workoutExerciseId) ?? -1;
  if (index < 0) return;
  const exercise = workout.exercises[index];
  openModal({
    title: exercise.name,
    subtitle: 'Exercise options',
    body: `
      <div class="list">
        <button class="list-item" type="button" data-action="move-exercise-up" data-exercise-id="${exercise.id}" ${index === 0 ? 'disabled' : ''} style="cursor:pointer;color:inherit;text-align:left"><div class="exercise-dot">${icon('arrowUp')}</div><div class="list-item-main"><strong>Move earlier</strong><span>Shift this movement up one position</span></div></button>
        <button class="list-item" type="button" data-action="move-exercise-down" data-exercise-id="${exercise.id}" ${index === workout.exercises.length - 1 ? 'disabled' : ''} style="cursor:pointer;color:inherit;text-align:left"><div class="exercise-dot">${icon('arrowDown')}</div><div class="list-item-main"><strong>Move later</strong><span>Shift this movement down one position</span></div></button>
        <button class="list-item" type="button" data-action="show-exercise" data-exercise-library-id="${exercise.exerciseId}" style="cursor:pointer;color:inherit;text-align:left"><div class="exercise-dot">${icon('info')}</div><div class="list-item-main"><strong>View form cue</strong><span>Open movement details and previous performance</span></div></button>
        <button class="list-item" type="button" data-action="remove-exercise" data-exercise-id="${exercise.id}" style="cursor:pointer;color:var(--red);text-align:left"><div class="exercise-dot">${icon('trash')}</div><div class="list-item-main"><strong>Remove from workout</strong><span>Delete its sets from this active session</span></div></button>
      </div>`
  });
}

function openFinishWorkoutModal() {
  const workout = state.activeWorkout;
  if (!workout) return;
  const done = completedSets(workout);
  const total = sum(workout.exercises.map(exercise => exercise.sets.length));
  const volume = volumeForWorkout(workout);
  openModal({
    title: 'Finish workout?',
    subtitle: 'Review your session summary',
    body: `
      <div class="metric-row">
        <div class="metric-mini"><strong>${done}/${total}</strong><span>completed sets</span></div>
        <div class="metric-mini"><strong>${formatNumber(kgToDisplay(volume))}</strong><span>${weightUnit()} volume</span></div>
        <div class="metric-mini"><strong>${formatCompactDuration((Date.now() - toDate(workout.startedAt)) / 1000)}</strong><span>duration</span></div>
      </div>
      ${done === 0 ? `<div class="privacy-note" style="margin-top:14px">${icon('info')}<p>No sets are marked complete. You can still save the session, but it will not contribute to volume or PR trends.</p></div>` : ''}
      <div class="form-group" style="margin-top:16px"><label class="label" for="finish-note">Final note <span>optional</span></label><textarea id="finish-note" class="textarea" placeholder="What went well? What should change next time?">${escapeHtml(workout.notes || '')}</textarea></div>`,
    footer: `<button class="btn btn-ghost" type="button" data-action="close-modal">Keep training</button><button class="btn btn-primary" type="button" data-action="confirm-finish-workout">${icon('check')} Save workout</button>`
  });
}

function detectPrsForWorkout(workout) {
  const prs = [];
  for (const exercise of workout.exercises || []) {
    const previous = bestSetForExercise(state.workouts, exercise.exerciseId)?.e1rm || 0;
    let best = null;
    for (const set of exercise.sets || []) {
      if (!set.done || !set.weightKg || !set.reps) continue;
      const e1rm = estimatedOneRepMax(set.weightKg, set.reps);
      if (!best || e1rm > best.e1rm) best = { set, e1rm };
    }
    if (best && best.e1rm > previous + 0.01) prs.push({ name: exercise.name, ...best });
  }
  return prs;
}

function completeActiveWorkout() {
  const workout = state.activeWorkout;
  if (!workout) return;
  const finalNote = document.getElementById('finish-note')?.value;
  if (typeof finalNote === 'string') workout.notes = finalNote.trim();
  workout.endedAt = new Date().toISOString();
  workout.durationSec = Math.max(1, Math.round((toDate(workout.endedAt) - toDate(workout.startedAt)) / 1000));
  const prs = detectPrsForWorkout(workout);
  state.workouts.push(safeJsonClone(workout));
  state.activeWorkout = null;
  saveState();
  closeModal();
  navigate('history');
  toast('Workout saved', prs.length ? `${prs.length} new performance PR${prs.length === 1 ? '' : 's'} detected.` : `${completedSets(workout)} sets added to your history.`);
}

function openCancelWorkoutModal() {
  openModal({
    title: 'Discard active workout?',
    subtitle: 'This cannot be undone after you confirm',
    body: `<div class="privacy-note">${icon('trash')}<p>All sets and notes in this active session will be removed. Completed workout history is not affected.</p></div>`,
    footer: `<button class="btn btn-ghost" type="button" data-action="close-modal">Keep workout</button><button class="btn btn-danger" type="button" data-action="confirm-cancel-workout">Discard session</button>`
  });
}

function openSaveTemplateModal() {
  const workout = state.activeWorkout;
  if (!workout) return;
  openModal({
    title: 'Save workout as template',
    subtitle: `${workout.exercises.length} exercises will be saved in this order`,
    body: `<form id="save-template-form" class="form-grid"><div class="form-group full"><label class="label" for="template-name">Template name</label><input id="template-name" name="name" class="input" type="text" value="${escapeHtml(workout.name)}" required></div><div class="form-group full"><label class="label" for="template-description">Description</label><input id="template-description" name="description" class="input" type="text" value="Custom ${escapeHtml(state.profile.goal.replaceAll('-', ' '))} session"></div></form>`,
    footer: `<button class="btn btn-ghost" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="button" data-action="confirm-save-template">${icon('check')} Save template</button>`
  });
}

function openTemplateBuilder() {
  openModal({
    title: 'Create workout template',
    subtitle: 'Choose movements in the order you want to perform them',
    wide: true,
    body: `
      <form id="template-builder-form" class="form-grid">
        <div class="form-group"><label class="label" for="builder-name">Template name</label><input id="builder-name" name="name" class="input" type="text" placeholder="Upper Body A" required></div>
        <div class="form-group"><label class="label" for="builder-level">Level</label><select id="builder-level" name="level" class="select"><option>All</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
        <div class="form-group full"><label class="label" for="builder-description">Description</label><input id="builder-description" name="description" class="input" type="text" placeholder="Chest, back and shoulders"></div>
        <div class="form-group full"><label class="label">Exercises <span>Select 1 or more</span></label><div class="search-wrap" style="margin-bottom:10px">${icon('search')}<input id="template-exercise-search" class="input" type="search" placeholder="Filter exercises…"></div><div id="template-exercise-list" class="list" style="max-height:42vh;overflow-y:auto">${renderTemplateExerciseCheckboxes(EXERCISES)}</div></div>
      </form>`,
    footer: `<button class="btn btn-ghost" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="button" data-action="confirm-create-template">${icon('check')} Create template</button>`
  });
}

function renderTemplateExerciseCheckboxes(exercises) {
  return exercises.map(exercise => `<label class="list-item" style="cursor:pointer"><input type="checkbox" name="templateExercise" value="${exercise.id}"><div class="exercise-dot">${escapeHtml(exercise.muscle.slice(0, 2))}</div><div class="list-item-main"><strong>${escapeHtml(exercise.name)}</strong><span>${escapeHtml(exercise.muscle)} · ${escapeHtml(exercise.equipment)}</span></div></label>`).join('');
}

function openBodyMetricModal() {
  openModal({
    title: 'Log body check-in',
    subtitle: 'All fields except date are optional',
    body: `
      <form id="body-metric-form" class="form-grid">
        <div class="form-group"><label class="label" for="metric-date">Date</label><input id="metric-date" name="date" class="input" type="date" value="${new Date().toISOString().slice(0, 10)}" required></div>
        <div class="form-group"><label class="label" for="metric-weight">Weight (${weightUnit()})</label><input id="metric-weight" name="weight" class="input" type="number" min="0" step="0.1" value="${state.profile.bodyWeightKg ? round(kgToDisplay(state.profile.bodyWeightKg), 1) : ''}"></div>
        <div class="form-group"><label class="label" for="metric-waist">Waist (${state.profile.units === 'lb' ? 'in' : 'cm'})</label><input id="metric-waist" name="waist" class="input" type="number" min="0" step="0.1"></div>
        <div class="form-group"><label class="label" for="metric-chest">Chest (${state.profile.units === 'lb' ? 'in' : 'cm'})</label><input id="metric-chest" name="chest" class="input" type="number" min="0" step="0.1"></div>
        <div class="form-group"><label class="label" for="metric-arm">Arm (${state.profile.units === 'lb' ? 'in' : 'cm'})</label><input id="metric-arm" name="arm" class="input" type="number" min="0" step="0.1"></div>
        <div class="form-group"><label class="label" for="metric-thigh">Thigh (${state.profile.units === 'lb' ? 'in' : 'cm'})</label><input id="metric-thigh" name="thigh" class="input" type="number" min="0" step="0.1"></div>
        <div class="form-group full"><label class="label" for="metric-note">Note</label><textarea id="metric-note" name="note" class="textarea" placeholder="Optional context: time of day, training phase, how you feel…"></textarea></div>
      </form>`,
    footer: `<button class="btn btn-ghost" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="button" data-action="confirm-body-metric">${icon('check')} Save check-in</button>`
  });
}

function openWorkoutDetail(workoutId) {
  const workout = state.workouts.find(item => item.id === workoutId);
  if (!workout) return;
  const prCount = recentPrs(10000).filter(pr => pr.workoutId === workout.id).length;
  openModal({
    title: workout.name,
    subtitle: `${formatDateLong(workout.endedAt || workout.startedAt)} · ${formatCompactDuration(workoutDuration(workout))}`,
    wide: true,
    body: `
      <div class="metric-row">
        <div class="metric-mini"><strong>${completedSets(workout)}</strong><span>completed sets</span></div>
        <div class="metric-mini"><strong>${formatNumber(kgToDisplay(volumeForWorkout(workout)))}</strong><span>${weightUnit()} volume</span></div>
        <div class="metric-mini"><strong>${prCount}</strong><span>PRs in session</span></div>
      </div>
      ${workout.notes ? `<div class="privacy-note" style="margin-top:14px">${icon('message')}<p>${escapeHtml(workout.notes)}</p></div>` : ''}
      <div class="stack" style="margin-top:16px;gap:12px">
        ${(workout.exercises || []).map(exercise => `
          <article class="card card-subtle" style="padding:16px">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px"><div><h3 style="margin:0 0 4px;font-size:15px">${escapeHtml(exercise.name)}</h3><span style="color:var(--muted);font-size:11px">${escapeHtml(exercise.muscle)}</span></div><span class="badge badge-accent">${exercise.sets.filter(set => set.done).length} sets</span></div>
            <div class="list">${(exercise.sets || []).filter(set => set.done).map((set, index) => `<div class="list-item"><span class="set-number">${index + 1}</span><div class="list-item-main"><strong>${exercise.tracking === 'time' ? formatDuration(set.durationSec) : exercise.tracking === 'time_distance' ? `${round(set.durationSec / 60, 1)} min · ${round(kmToDisplay(set.distanceKm), 2)} ${distanceUnit()}` : `${round(kgToDisplay(set.weightKg), 1)} ${weightUnit()} × ${set.reps}`}</strong><span>${escapeHtml(set.type)}${set.rpe ? ` · RPE ${set.rpe}` : ''}</span></div></div>`).join('') || '<p style="margin:0">No completed sets.</p>'}</div>
            ${exercise.notes ? `<p class="help-text">${escapeHtml(exercise.notes)}</p>` : ''}
          </article>`).join('')}
      </div>`,
    footer: `<button class="btn btn-ghost" type="button" data-action="delete-workout" data-workout-id="${workout.id}">${icon('trash')} Delete</button><button class="btn btn-secondary" type="button" data-action="repeat-workout" data-workout-id="${workout.id}">${icon('refresh')} Repeat workout</button><button class="btn btn-primary" type="button" data-action="close-modal">Done</button>`
  });
}

function openHistoryMenu(workoutId) {
  const workout = state.workouts.find(item => item.id === workoutId);
  if (!workout) return;
  openModal({
    title: workout.name,
    subtitle: 'Workout options',
    body: `<div class="list"><button class="list-item" type="button" data-action="view-workout" data-workout-id="${workout.id}" style="cursor:pointer;color:inherit;text-align:left"><div class="exercise-dot">${icon('history')}</div><div class="list-item-main"><strong>View every set</strong><span>Open the complete session details</span></div></button><button class="list-item" type="button" data-action="repeat-workout" data-workout-id="${workout.id}" style="cursor:pointer;color:inherit;text-align:left"><div class="exercise-dot">${icon('refresh')}</div><div class="list-item-main"><strong>Repeat workout</strong><span>Start a new session with the same exercise order</span></div></button><button class="list-item" type="button" data-action="delete-workout" data-workout-id="${workout.id}" style="cursor:pointer;color:var(--red);text-align:left"><div class="exercise-dot">${icon('trash')}</div><div class="list-item-main"><strong>Delete workout</strong><span>Remove it from history and progress calculations</span></div></button></div>`
  });
}

function openDeleteWorkoutConfirm(workoutId) {
  const workout = state.workouts.find(item => item.id === workoutId);
  if (!workout) return;
  openModal({
    title: 'Delete workout?',
    subtitle: workout.name,
    body: `<div class="privacy-note">${icon('trash')}<p>This session will be removed from history, charts, records and coach calculations. This action cannot be undone.</p></div>`,
    footer: `<button class="btn btn-ghost" type="button" data-action="close-modal">Cancel</button><button class="btn btn-danger" type="button" data-action="confirm-delete-workout" data-workout-id="${workout.id}">Delete workout</button>`
  });
}

function openCustomExerciseModal() {
  openModal({
    title: 'Create custom exercise',
    subtitle: 'Custom movements are saved in this browser',
    body: `
      <form id="custom-exercise-form" class="form-grid">
        <div class="form-group full"><label class="label" for="custom-name">Exercise name</label><input id="custom-name" name="name" class="input" type="text" placeholder="Cable high row" required></div>
        <div class="form-group"><label class="label" for="custom-muscle">Primary muscle</label><input id="custom-muscle" name="muscle" class="input" type="text" placeholder="Back" required></div>
        <div class="form-group"><label class="label" for="custom-equipment">Equipment</label><input id="custom-equipment" name="equipment" class="input" type="text" placeholder="Cable" required></div>
        <div class="form-group"><label class="label" for="custom-tracking">Tracking</label><select id="custom-tracking" name="tracking" class="select"><option value="weight_reps">Weight + reps</option><option value="bodyweight_reps">Bodyweight + reps</option><option value="time">Time</option><option value="time_distance">Time + distance</option></select></div>
        <div class="form-group"><label class="label" for="custom-level">Level</label><select id="custom-level" name="level" class="select"><option>All</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
        <div class="form-group full"><label class="label" for="custom-cue">Personal form cue</label><textarea id="custom-cue" name="cue" class="textarea" placeholder="A short setup or technique reminder that works for you."></textarea></div>
      </form>`,
    footer: `<button class="btn btn-ghost" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="button" data-action="confirm-custom-exercise">${icon('check')} Save exercise</button>`
  });
}

function openPhotoCheckin(checkinId) {
  const checkin = state.photoCheckins.find(item => item.id === checkinId);
  if (!checkin) return;
  const photos = photosForCheckin(checkin);
  openModal({
    title: `Photo check-in · ${formatDate(checkin.date)}`,
    subtitle: `${photos.length} view${photos.length === 1 ? '' : 's'}${checkin.weightKg ? ` · ${round(kgToDisplay(checkin.weightKg), 1)} ${weightUnit()}` : ''}`,
    wide: true,
    body: `
      <div class="photo-preview-grid">${photos.map(photo => `<div><div class="photo-preview"><img src="${photo.url}" alt="${escapeHtml(photo.view)} progress photo"><span class="photo-label">${escapeHtml(photo.view)}</span></div></div>`).join('')}</div>
      ${checkin.note ? `<div class="privacy-note" style="margin-top:14px">${icon('message')}<p>${escapeHtml(checkin.note)}</p></div>` : ''}
      ${checkin.feedback ? `<div class="insight-card" style="margin-top:14px"><div class="insight-icon">${icon('sparkles')}</div><div><h4>Saved feedback</h4><p style="white-space:pre-wrap">${escapeHtml(checkin.feedback)}</p></div></div>` : ''}`,
    footer: `<button class="btn btn-danger" type="button" data-action="delete-photo-checkin" data-checkin-id="${checkin.id}">${icon('trash')} Delete</button><button class="btn btn-primary" type="button" data-action="close-modal">Done</button>`
  });
}

function openResetConfirm() {
  openModal({
    title: 'Erase all SetFlow data?',
    subtitle: 'Workouts, photos, templates, metrics and settings',
    body: `<div class="privacy-note">${icon('info')}<p>Export a backup first if you may want this data later. ${auth.user ? 'Because you are signed in, the reset will also sync to your cloud account.' : 'Guest-mode data is stored only on this device.'}</p></div><div class="form-group" style="margin-top:14px"><label class="label" for="reset-confirm-input">Type ERASE to confirm</label><input id="reset-confirm-input" class="input" type="text" autocomplete="off"></div>`,
    footer: `<button class="btn btn-ghost" type="button" data-action="close-modal">Cancel</button><button class="btn btn-danger" type="button" data-action="confirm-reset-app">Erase everything</button>`
  });
}

function startRestTimer(seconds = state.settings.restTimerSec) {
  if (ui.restInterval) clearInterval(ui.restInterval);
  const total = Math.max(5, Number(seconds) || 90);
  ui.restTimer = { total, remaining: total, startedAt: Date.now() };
  renderRestTimerOverlay();
  ui.restInterval = setInterval(() => {
    if (!ui.restTimer) return;
    ui.restTimer.remaining = Math.max(0, ui.restTimer.total - Math.floor((Date.now() - ui.restTimer.startedAt) / 1000));
    updateRestTimerOverlay();
    if (ui.restTimer.remaining <= 0) finishRestTimer();
  }, 250);
}

function renderRestTimerOverlay() {
  const root = document.getElementById('modal-root');
  const timer = ui.restTimer;
  if (!timer) return;
  root.innerHTML = `
    <div class="rest-overlay">
      <div class="rest-card">
        <div class="coach-orb" style="margin:0 auto">${icon('clock')}</div>
        <p class="section-label" style="margin-top:20px">Rest timer</p>
        <strong id="rest-time" class="rest-time">${formatDuration(timer.remaining)}</strong>
        <p id="rest-message">Recover your breathing. Keep the next set technically clean.</p>
        <div class="rest-progress"><span id="rest-progress-fill" style="width:${(timer.remaining / timer.total) * 100}%"></span></div>
        <div class="inline-actions" style="justify-content:center">
          <button class="btn btn-secondary" type="button" data-action="adjust-rest" data-seconds="-15">−15 sec</button>
          <button class="btn btn-secondary" type="button" data-action="adjust-rest" data-seconds="30">+30 sec</button>
          <button class="btn btn-primary" type="button" data-action="skip-rest">Skip</button>
        </div>
      </div>
    </div>`;
}

function updateRestTimerOverlay() {
  if (!ui.restTimer) return;
  const time = document.getElementById('rest-time');
  const fill = document.getElementById('rest-progress-fill');
  const message = document.getElementById('rest-message');
  if (time) time.textContent = formatDuration(ui.restTimer.remaining);
  if (fill) fill.style.width = `${clamp((ui.restTimer.remaining / ui.restTimer.total) * 100, 0, 100)}%`;
  if (message) message.textContent = ui.restTimer.remaining <= 15 ? 'Set up now. Brace, breathe and own the next rep.' : 'Recover your breathing. Keep the next set technically clean.';
}

function adjustRestTimer(seconds) {
  if (!ui.restTimer) return;
  const elapsed = ui.restTimer.total - ui.restTimer.remaining;
  ui.restTimer.total = Math.max(elapsed + 5, ui.restTimer.total + Number(seconds));
  ui.restTimer.startedAt = Date.now() - elapsed * 1000;
  ui.restTimer.remaining = Math.max(0, ui.restTimer.total - elapsed);
  updateRestTimerOverlay();
}

function finishRestTimer() {
  if (ui.restInterval) clearInterval(ui.restInterval);
  ui.restInterval = null;
  const wasFinished = ui.restTimer?.remaining <= 0;
  ui.restTimer = null;
  document.getElementById('modal-root').innerHTML = '';
  if (wasFinished) {
    if (state.settings.sounds) playTimerTone();
    toast('Rest complete', 'Your next set is ready.');
  }
}

function playTimerTone() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const audio = new AudioContextClass();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.frequency.value = 660;
    gain.gain.setValueAtTime(0.0001, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, audio.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.35);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.38);
  } catch (error) {
    console.warn('Timer sound unavailable', error);
  }
}

function buildTrainingContext() {
  const recent = [...state.workouts]
    .sort((a, b) => toDate(b.endedAt || b.startedAt) - toDate(a.endedAt || a.startedAt))
    .slice(0, 12)
    .map(workout => ({
      date: workout.endedAt || workout.startedAt,
      name: workout.name,
      durationMinutes: Math.round(workoutDuration(workout) / 60),
      volumeKg: round(volumeForWorkout(workout), 1),
      exercises: (workout.exercises || []).map(exercise => ({
        name: exercise.name,
        muscle: exercise.muscle,
        sets: (exercise.sets || []).filter(set => set.done).map(set => ({
          type: set.type,
          weightKg: round(set.weightKg, 2),
          reps: set.reps,
          durationSec: set.durationSec,
          distanceKm: set.distanceKm,
          rpe: set.rpe
        }))
      }))
    }));
  return {
    profile: {
      experience: state.profile.experience,
      goal: state.profile.goal,
      weeklyGoal: state.profile.weeklyGoal,
      units: state.profile.units
    },
    currentSignals: {
      weeklySessions: weekWorkouts(0).length,
      weeklyVolumeKg: round(sum(weekWorkouts(0).map(volumeForWorkout)), 1),
      previousWeekVolumeKg: round(sum(weekWorkouts(-1).map(volumeForWorkout)), 1),
      averageRpe14Days: round(averageRpe(14), 1),
      muscleSets14Days: muscleSetDistribution(14),
      recentPrs: recentPrs(30).slice(0, 6).map(pr => ({ name: pr.name, weightKg: round(pr.weightKg, 2), reps: pr.reps, date: pr.date }))
    },
    recentWorkouts: recent
  };
}

async function checkAiStatus(showResult = false) {
  if (location.protocol === 'file:') {
    ui.aiOnline = false;
    ui.aiModel = '';
    if (showResult) toast('Local mode active', 'Run the included server to enable connected AI feedback.');
    return false;
  }
  try {
    const response = await fetch('/api/status', { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    ui.aiOnline = Boolean(data.enabled) && (!data.accounts || Boolean(auth.user));
    ui.aiModel = data.model || '';
    if (showResult) toast(ui.aiOnline ? 'AI coach connected' : 'Local mode active', ui.aiOnline ? `Using ${ui.aiModel || 'the configured model'}.` : 'Add OPENAI_API_KEY to the server environment to connect.');
    if (ui.route === 'settings' || ui.route === 'coach') renderApp();
    return ui.aiOnline;
  } catch (error) {
    ui.aiOnline = false;
    ui.aiModel = '';
    if (showResult) toast('AI server not connected', 'Core tracking and local coach features still work.', 'warning');
    return false;
  }
}

async function askCoach(question) {
  const text = String(question || '').trim();
  if (!text) return;
  state.coachMessages.push({ id: uid('msg'), role: 'user', text, createdAt: new Date().toISOString() });
  saveState();
  ui.coachTab = 'chat';
  renderApp();
  scrollCoachChat();

  let answer = '';
  if (ui.aiOnline) {
    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' }),
        body: JSON.stringify({ question: text, context: buildTrainingContext() })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
      answer = data.answer;
    } catch (error) {
      console.warn('Connected coach failed; using local answer', error);
      answer = `${localCoachAnswer(text)}\n\nConnected AI was unavailable for this request, so SetFlow used its local training rules.`;
    }
  } else {
    answer = localCoachAnswer(text);
  }

  state.coachMessages.push({ id: uid('msg'), role: 'assistant', text: answer || localCoachAnswer(text), createdAt: new Date().toISOString() });
  state.coachMessages = state.coachMessages.slice(-60);
  saveState();
  renderApp();
  scrollCoachChat();
}

function scrollCoachChat() {
  requestAnimationFrame(() => {
    const chat = document.getElementById('coach-chat');
    if (chat) chat.scrollTop = chat.scrollHeight;
  });
}

async function handlePhotoFiles(fileList) {
  const files = [...fileList].filter(file => /^image\/(jpeg|png|webp)$/i.test(file.type)).slice(0, Math.max(0, 3 - ui.pendingPhotos.length));
  if (!files.length) return toast('No supported photos selected', 'Use JPEG, PNG or WebP images.', 'warning');
  for (const file of files) {
    try {
      const processed = await compressPhoto(file);
      ui.pendingPhotos.push({
        id: uid('pending-photo'),
        name: file.name,
        view: ['front', 'side', 'back'][ui.pendingPhotos.length] || 'other',
        ...processed
      });
    } catch (error) {
      console.warn('Could not process photo', error);
      toast('Photo could not be read', file.name, 'error');
    }
  }
  ui.photoAnalysis = '';
  renderApp();
}

async function analyzePendingPhotos() {
  if (!ui.pendingPhotos.length) return;
  ui.photoAnalysis = 'Analyzing the selected check-in…';
  renderApp();
  if (ui.aiOnline) {
    try {
      const photos = [];
      for (const photo of ui.pendingPhotos) photos.push({ view: photo.view, dataUrl: await fileToDataUrl(photo.blob), stats: photo.stats });
      const previousCheckin = [...state.photoCheckins].sort((a, b) => toDate(b.date) - toDate(a.date))[0];
      const baselinePhotos = [];
      if (previousCheckin) {
        for (const photo of photosForCheckin(previousCheckin).slice(0, 3)) {
          const source = photo.blob || (photo.dataUrl ? dataUrlToBlob(photo.dataUrl) : null);
          if (source) baselinePhotos.push({ view: photo.view, dataUrl: await fileToDataUrl(source), stats: photo.stats });
        }
      }
      const response = await fetch('/api/analyze-progress', {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' }),
        body: JSON.stringify({
          photos,
          baselinePhotos,
          baselineDate: previousCheckin?.date || '',
          note: ui.photoDraft.note || '',
          date: ui.photoDraft.date || new Date().toISOString().slice(0, 10),
          trainingContext: buildTrainingContext(),
          previousCheckins: state.photoCheckins.slice(0, 3).map(checkin => ({ date: checkin.date, note: checkin.note, feedback: checkin.feedback }))
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
      ui.photoAnalysis = data.feedback || localPhotoFeedback();
    } catch (error) {
      console.warn('Visual AI failed; using local check', error);
      ui.photoAnalysis = `${localPhotoFeedback()}\n\nConnected visual feedback was unavailable, so only image-quality and comparison guidance was provided.`;
    }
  } else {
    ui.photoAnalysis = localPhotoFeedback();
  }
  renderApp();
}

async function savePhotoCheckin() {
  if (!ui.pendingPhotos.length) return;
  const date = ui.photoDraft.date || new Date().toISOString().slice(0, 10);
  const weightValue = Number(ui.photoDraft.weight) || 0;
  const note = String(ui.photoDraft.note || '').trim();
  const checkinId = uid('checkin');
  const photoIds = [];
  try {
    for (const pending of ui.pendingPhotos) {
      const id = uid('photo');
      photoIds.push(id);
      await dbPutPhoto({ id, checkinId, view: pending.view, blob: pending.blob, stats: pending.stats, createdAt: new Date().toISOString() });
      if (pending.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(pending.previewUrl);
    }
    const weightKg = weightValue ? displayToKg(weightValue) : 0;
    state.photoCheckins.unshift({ id: checkinId, date, weightKg, note, feedback: ui.photoAnalysis && !ui.photoAnalysis.includes('Analyzing') ? ui.photoAnalysis : '', photoIds });
    if (weightKg) {
      state.profile.bodyWeightKg = weightKg;
      state.bodyMetrics.unshift({ id: uid('metric'), date, weightKg, waistCm: 0, chestCm: 0, armCm: 0, thighCm: 0, note: note ? `Photo check-in: ${note}` : 'Photo check-in' });
    }
    ui.pendingPhotos = [];
    ui.photoAnalysis = '';
    ui.photoDraft = { date: new Date().toISOString().slice(0, 10), weight: '', note: '' };
    saveState();
    await refreshPhotoCache();
    renderApp();
    toast('Photo check-in saved', 'Stored privately in this browser.');
  } catch (error) {
    console.error('Could not save photo check-in', error);
    toast('Photo check-in could not be saved', 'Browser storage may be unavailable or full.', 'error');
  }
}

async function deletePhotoCheckin(checkinId) {
  const checkin = state.photoCheckins.find(item => item.id === checkinId);
  if (!checkin) return;
  try {
    await Promise.all((checkin.photoIds || []).map(dbDeletePhoto));
    state.photoCheckins = state.photoCheckins.filter(item => item.id !== checkinId);
    saveState();
    await refreshPhotoCache();
    closeModal();
    renderApp();
    toast('Photo check-in deleted');
  } catch (error) {
    toast('Could not delete photos', 'Try exporting a backup and reloading the app.', 'error');
  }
}

async function exportData() {
  try {
    toast('Preparing backup', 'Large photo libraries may take a moment.');
    const photos = await dbGetPhotos();
    const photoBackups = [];
    for (const photo of photos) {
      photoBackups.push({
        id: photo.id,
        checkinId: photo.checkinId,
        view: photo.view,
        stats: photo.stats,
        createdAt: photo.createdAt,
        dataUrl: photo.blob ? await fileToDataUrl(photo.blob) : photo.dataUrl
      });
    }
    const payload = {
      format: 'setflow-backup',
      version: APP_VERSION,
      exportedAt: new Date().toISOString(),
      state,
      photos: photoBackups
    };
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `setflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    toast('Backup exported', `${state.workouts.length} workouts and ${photos.length} photos included.`);
  } catch (error) {
    console.error('Export failed', error);
    toast('Backup failed', 'The browser could not prepare the export.', 'error');
  }
}

function dataUrlToBlob(dataUrl) {
  const [header, encoded] = String(dataUrl).split(',');
  const mime = header.match(/data:([^;]+)/)?.[1] || 'application/octet-stream';
  const binary = atob(encoded || '');
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new Blob([bytes], { type: mime });
}

async function importBackup(file) {
  try {
    const payload = JSON.parse(await file.text());
    if (payload?.format !== 'setflow-backup' || !payload.state || typeof payload.state !== 'object') throw new Error('Not a SetFlow backup');
    const fallback = createDefaultState();
    const incoming = payload.state;
    state = {
      ...fallback,
      ...incoming,
      profile: { ...fallback.profile, ...(incoming.profile || {}) },
      settings: { ...fallback.settings, ...(incoming.settings || {}) },
      workouts: Array.isArray(incoming.workouts) ? incoming.workouts : [],
      bodyMetrics: Array.isArray(incoming.bodyMetrics) ? incoming.bodyMetrics : [],
      photoCheckins: Array.isArray(incoming.photoCheckins) ? incoming.photoCheckins : [],
      templates: Array.isArray(incoming.templates) && incoming.templates.length ? incoming.templates : fallback.templates,
      customExercises: Array.isArray(incoming.customExercises) ? incoming.customExercises : []
    };
    await dbClearPhotos();
    for (const photo of payload.photos || []) {
      if (!photo.dataUrl) continue;
      await dbPutPhoto({
        id: photo.id,
        checkinId: photo.checkinId,
        view: photo.view,
        stats: photo.stats,
        createdAt: photo.createdAt,
        blob: dataUrlToBlob(photo.dataUrl)
      });
    }
    hydrateCustomExercises();
    saveState();
    await refreshPhotoCache();
    ui.onboardingDraft = safeJsonClone(state.profile);
    ui.route = 'dashboard';
    history.replaceState(null, '', '#/dashboard');
    renderApp();
    toast('Backup restored', `${state.workouts.length} workouts and ${(payload.photos || []).length} photos imported.`);
  } catch (error) {
    console.error('Import failed', error);
    toast('Import failed', 'Choose a valid SetFlow backup file.', 'error');
  } finally {
    const input = document.getElementById('import-file');
    if (input) input.value = '';
  }
}

function demoWeightFor(exerciseId, weekIndex, setIndex) {
  const bases = {
    'barbell-bench': 52, 'incline-db-press': 18, 'overhead-press': 32, 'lateral-raise': 7, 'triceps-pushdown': 23,
    deadlift: 82, 'lat-pulldown': 45, 'barbell-row': 48, 'face-pull': 20, 'hammer-curl': 11,
    'back-squat': 66, 'romanian-deadlift': 58, 'leg-press': 110, 'leg-curl': 35, 'calf-raise': 50,
    'goblet-squat': 22, plank: 0
  };
  const base = bases[exerciseId] || 20;
  return Math.max(0, base + weekIndex * 1.15 - setIndex * 1.5);
}

function createDemoWorkout(template, date, weekIndex, sessionIndex) {
  const started = new Date(date);
  started.setHours(17 + (sessionIndex % 2), 15, 0, 0);
  const duration = 52 * 60 + ((weekIndex + sessionIndex) % 5) * 240;
  const exercises = (template.exerciseIds || []).map((exerciseId, exerciseIndex) => {
    const source = EXERCISES.find(item => item.id === exerciseId);
    const workoutExercise = createWorkoutExercise(exerciseId, []);
    workoutExercise.sets = Array.from({ length: exerciseIndex < 3 ? 3 : 2 }, (_, setIndex) => {
      const repsBase = source?.tracking === 'bodyweight_reps' ? 10 : exerciseIndex < 2 ? 8 : 12;
      const set = defaultSet(source?.tracking || 'weight_reps');
      set.done = true;
      set.type = setIndex === 0 && exerciseIndex === 0 ? 'warmup' : 'working';
      set.weightKg = source?.tracking === 'weight_reps' ? round(demoWeightFor(exerciseId, weekIndex, setIndex) * (set.type === 'warmup' ? 0.7 : 1), 1) : 0;
      set.reps = Math.max(5, repsBase + ((weekIndex + setIndex) % 3) - setIndex);
      set.rpe = round(7.1 + setIndex * 0.45 + (weekIndex % 3) * 0.1, 1);
      if (source?.tracking === 'time') set.durationSec = 45 + weekIndex * 3;
      if (source?.tracking === 'time_distance') {
        set.durationSec = 900 + weekIndex * 30;
        set.distanceKm = 2.2 + weekIndex * 0.08;
      }
      return set;
    });
    workoutExercise.notes = exerciseIndex === 0 && weekIndex === 5 ? 'Technique felt stable; keep the same setup.' : '';
    return workoutExercise;
  }).filter(Boolean);
  return {
    id: uid('demo-workout'),
    name: template.name,
    templateId: template.id,
    startedAt: started.toISOString(),
    endedAt: new Date(started.getTime() + duration * 1000).toISOString(),
    durationSec: duration,
    notes: weekIndex % 3 === 0 ? 'Good energy. Kept the last set controlled.' : '',
    exercises
  };
}

function loadDemoData() {
  const templates = DEFAULT_TEMPLATES.slice(0, 3);
  const workouts = [];
  const now = new Date();
  for (let weekIndex = 0; weekIndex < 8; weekIndex += 1) {
    const weekStart = addDays(startOfWeek(), -(7 - weekIndex) * 7);
    const sessionCount = weekIndex === 0 ? 2 : weekIndex === 4 ? 4 : 3;
    const scheduledDates = [0, 2, 4, 5].slice(0, sessionCount).map(offset => addDays(weekStart, offset));
    const usableDates = weekIndex === 7 ? scheduledDates.filter(date => date <= now) : scheduledDates;
    usableDates.forEach((date, sessionIndex) => {
      workouts.push(createDemoWorkout(templates[(weekIndex + sessionIndex) % templates.length], date, weekIndex, sessionIndex));
    });
  }
  state.workouts = workouts.sort((a, b) => toDate(a.startedAt) - toDate(b.startedAt));
  const currentWeight = state.profile.bodyWeightKg || (state.profile.units === 'lb' ? 79.4 : 79.4);
  state.profile.bodyWeightKg = currentWeight;
  state.bodyMetrics = Array.from({ length: 5 }, (_, index) => ({
    id: uid('demo-metric'),
    date: addDays(new Date(), -index * 14).toISOString().slice(0, 10),
    weightKg: round(currentWeight - (4 - index) * 0.28, 2),
    waistCm: round(84 - (4 - index) * 0.35, 1),
    chestCm: round(102 + (4 - index) * 0.22, 1),
    armCm: round(35 + (4 - index) * 0.08, 1),
    thighCm: round(58 + (4 - index) * 0.12, 1),
    note: index === 0 ? 'Demo check-in' : ''
  }));
  state.activeWorkout = null;
  saveState();
  closeModal();
  navigate('dashboard');
  toast('Demo data loaded', 'Eight weeks of realistic sample training are ready to explore.');
}

function openDemoConfirm() {
  openModal({
    title: 'Load demo training data?',
    subtitle: 'This replaces your current workout and body-metric history',
    body: `<div class="privacy-note">${icon('info')}<p>Templates, profile settings and saved photos will remain. Export a backup first if your current training history matters.</p></div>`,
    footer: `<button class="btn btn-ghost" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="button" data-action="confirm-load-demo">Load demo data</button>`
  });
}

function hydrateCustomExercises() {
  state.customExercises = Array.isArray(state.customExercises) ? state.customExercises : [];
  for (let index = EXERCISES.length - 1; index >= 0; index -= 1) {
    if (EXERCISES[index].custom) EXERCISES.splice(index, 1);
  }
  for (const exercise of state.customExercises) {
    if (!EXERCISES.some(item => item.id === exercise.id)) EXERCISES.push(exercise);
  }
}

function preserveFocusAfterRender(id, selectionStart = null) {
  requestAnimationFrame(() => {
    const element = document.getElementById(id);
    if (!element) return;
    element.focus();
    if (selectionStart != null && element.setSelectionRange) element.setSelectionRange(selectionStart, selectionStart);
  });
}

async function handleAction(action, element) {
  switch (action) {
    case 'set-auth-mode':
      ui.authMode = element.dataset.mode === 'signup' ? 'signup' : 'signin';
      renderApp();
      return;
    case 'continue-guest':
      auth.guestMode = true;
      if (auth.available) { ui.aiOnline = false; ui.aiModel = ''; }
      localStorage.setItem(GUEST_MODE_KEY, '1');
      state = loadState(STORAGE_KEY);
      hydrateCustomExercises();
      ui.onboardingDraft = safeJsonClone(state.profile);
      await refreshPhotoCache();
      renderApp();
      toast('Guest mode', 'This device will keep your data locally until you create an account.');
      return;
    case 'open-auth':
      auth.guestMode = false;
      localStorage.removeItem(GUEST_MODE_KEY);
      ui.authMode = 'signin';
      renderApp();
      return;
    case 'sync-now':
      await syncToCloud(true);
      renderApp();
      return;
    case 'reload-cloud':
      try {
        await pullCloudData({ showResult: true });
      } catch (error) {
        toast('Could not load cloud data', error.message, 'error');
      }
      return;
    case 'sign-out':
      await signOut();
      toast('Signed out');
      return;
    case 'delete-account':
      openModal({
        title: 'Delete your SetFlow account?',
        subtitle: 'This permanently removes your synced account and workout data from the server',
        body: `<div class="privacy-note">${icon('info')}<p>Progress-photo files stored on this device are not uploaded, but the cloud account and synced training data cannot be recovered after deletion.</p></div><div class="form-group" style="margin-top:14px"><label class="label" for="delete-account-password">Confirm your password</label><input id="delete-account-password" class="input" type="password" autocomplete="current-password" placeholder="Password"></div>`,
        footer: `<button class="btn btn-ghost" type="button" data-action="close-modal">Cancel</button><button class="btn btn-danger" type="button" data-action="confirm-delete-account">Delete account</button>`
      });
      return;
    case 'confirm-delete-account': {
      const password = document.getElementById('delete-account-password')?.value || '';
      if (!password) return toast('Enter your password', 'Password confirmation is required.', 'warning');
      const response = await fetch('/api/account', {
        method: 'DELETE',
        headers: authHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' }),
        body: JSON.stringify({ password })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) return toast('Account was not deleted', data.error || 'Check your password and try again.', 'error');
      closeModal();
      const deletedUserId = auth.user?.id;
      await dbClearPhotos().catch(() => {});
      if (deletedUserId) localStorage.removeItem(storageKeyForUser({ id: deletedUserId }));
      auth.user = null;
      auth.token = '';
      auth.revision = 0;
      auth.syncStatus = 'local';
      auth.guestMode = false;
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(GUEST_MODE_KEY);
      state = loadState(STORAGE_KEY);
      hydrateCustomExercises();
      ui.onboardingDraft = safeJsonClone(state.profile);
      await refreshPhotoCache();
      renderApp();
      toast('Account deleted');
      return;
    }
    case 'close-modal':
      closeModal();
      return;
    case 'toggle-theme':
      state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
      saveState();
      renderApp();
      return;
    case 'start-template':
      closeModal();
      startTemplate(element.dataset.templateId);
      return;
    case 'start-blank':
      startWorkout();
      return;
    case 'repeat-workout':
      closeModal();
      repeatWorkout(element.dataset.workoutId);
      return;
    case 'create-template':
      openTemplateBuilder();
      return;
    case 'confirm-create-template': {
      const form = document.getElementById('template-builder-form');
      if (!form?.reportValidity()) return;
      const data = new FormData(form);
      const exerciseIds = data.getAll('templateExercise');
      if (!exerciseIds.length) return toast('Choose at least one exercise', 'A template needs a movement list.', 'warning');
      state.templates.push({ id: uid('tpl'), name: String(data.get('name')).trim(), description: String(data.get('description') || '').trim(), level: String(data.get('level') || 'All'), exerciseIds });
      saveState();
      closeModal();
      renderApp();
      toast('Template created', 'It is ready from the workout screen.');
      return;
    }
    case 'add-exercise':
      openAddExerciseModal();
      return;
    case 'select-exercise': {
      if (!state.activeWorkout) {
        closeModal();
        startWorkout({ exerciseIds: [element.dataset.exerciseLibraryId] });
        return;
      }
      const exerciseId = element.dataset.exerciseLibraryId;
      if (state.activeWorkout.exercises.some(exercise => exercise.exerciseId === exerciseId)) {
        toast('Exercise already added', 'You can add more sets to the existing exercise.');
        closeModal();
        return;
      }
      const exercise = createWorkoutExercise(exerciseId);
      if (exercise) state.activeWorkout.exercises.push(exercise);
      saveState();
      closeModal();
      renderApp();
      requestAnimationFrame(() => document.querySelector(`[data-workout-exercise="${exercise?.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
      return;
    }
    case 'add-set': {
      const exercise = state.activeWorkout?.exercises.find(item => item.id === element.dataset.exerciseId);
      if (!exercise) return;
      exercise.sets.push(defaultSet(exercise.tracking, exercise.sets.at(-1)));
      saveState();
      renderApp();
      return;
    }
    case 'remove-set': {
      const exercise = state.activeWorkout?.exercises.find(item => item.id === element.dataset.exerciseId);
      if (!exercise) return;
      exercise.sets = exercise.sets.filter(set => set.id !== element.dataset.setId);
      saveState();
      renderApp();
      return;
    }
    case 'toggle-set': {
      const exercise = state.activeWorkout?.exercises.find(item => item.id === element.dataset.exerciseId);
      const set = exercise?.sets.find(item => item.id === element.dataset.setId);
      if (!set) return;
      set.done = !set.done;
      saveState();
      const shouldRest = set.done && state.settings.autoRestTimer && set.type !== 'warmup';
      renderApp();
      if (shouldRest) startRestTimer(state.settings.restTimerSec);
      return;
    }
    case 'exercise-menu':
      openExerciseMenu(element.dataset.exerciseId);
      return;
    case 'move-exercise-up':
    case 'move-exercise-down': {
      const list = state.activeWorkout?.exercises;
      if (!list) return;
      const index = list.findIndex(item => item.id === element.dataset.exerciseId);
      const next = action === 'move-exercise-up' ? index - 1 : index + 1;
      if (index < 0 || next < 0 || next >= list.length) return;
      [list[index], list[next]] = [list[next], list[index]];
      saveState();
      closeModal();
      renderApp();
      return;
    }
    case 'remove-exercise':
      if (state.activeWorkout) state.activeWorkout.exercises = state.activeWorkout.exercises.filter(item => item.id !== element.dataset.exerciseId);
      saveState();
      closeModal();
      renderApp();
      return;
    case 'show-exercise':
      openExerciseDetail(element.dataset.exerciseLibraryId);
      return;
    case 'finish-workout':
      openFinishWorkoutModal();
      return;
    case 'confirm-finish-workout':
      completeActiveWorkout();
      return;
    case 'cancel-workout':
      openCancelWorkoutModal();
      return;
    case 'confirm-cancel-workout':
      state.activeWorkout = null;
      saveState();
      closeModal();
      renderApp();
      toast('Workout discarded');
      return;
    case 'open-rest-timer':
      startRestTimer(state.settings.restTimerSec);
      return;
    case 'adjust-rest':
      adjustRestTimer(Number(element.dataset.seconds));
      return;
    case 'skip-rest':
      finishRestTimer();
      return;
    case 'save-active-template':
      openSaveTemplateModal();
      return;
    case 'confirm-save-template': {
      const nameInput = document.getElementById('template-name');
      if (!nameInput?.value.trim()) return nameInput?.focus();
      state.templates.push({ id: uid('tpl'), name: nameInput.value.trim(), description: document.getElementById('template-description')?.value.trim() || '', level: 'Custom', exerciseIds: state.activeWorkout?.exercises.map(exercise => exercise.exerciseId) || [] });
      saveState();
      closeModal();
      toast('Template saved', 'You can start it from the workout screen.');
      return;
    }
    case 'set-progress-metric':
      ui.progressMetric = element.dataset.metric;
      renderApp();
      return;
    case 'add-body-metric':
      openBodyMetricModal();
      return;
    case 'confirm-body-metric': {
      const form = document.getElementById('body-metric-form');
      if (!form?.reportValidity()) return;
      const data = new FormData(form);
      const weight = Number(data.get('weight')) || 0;
      const metric = {
        id: uid('metric'),
        date: String(data.get('date')),
        weightKg: weight ? displayToKg(weight) : 0,
        waistCm: Number(data.get('waist')) ? displayToCm(Number(data.get('waist'))) : 0,
        chestCm: Number(data.get('chest')) ? displayToCm(Number(data.get('chest'))) : 0,
        armCm: Number(data.get('arm')) ? displayToCm(Number(data.get('arm'))) : 0,
        thighCm: Number(data.get('thigh')) ? displayToCm(Number(data.get('thigh'))) : 0,
        note: String(data.get('note') || '').trim()
      };
      state.bodyMetrics.push(metric);
      if (metric.weightKg) state.profile.bodyWeightKg = metric.weightKg;
      saveState();
      closeModal();
      renderApp();
      toast('Body check-in saved');
      return;
    }
    case 'delete-body-metric':
      state.bodyMetrics = state.bodyMetrics.filter(metric => metric.id !== element.dataset.metricId);
      saveState();
      renderApp();
      toast('Check-in deleted');
      return;
    case 'view-workout':
      openWorkoutDetail(element.dataset.workoutId);
      return;
    case 'history-menu':
      openHistoryMenu(element.dataset.workoutId);
      return;
    case 'delete-workout':
      openDeleteWorkoutConfirm(element.dataset.workoutId);
      return;
    case 'confirm-delete-workout':
      state.workouts = state.workouts.filter(workout => workout.id !== element.dataset.workoutId);
      saveState();
      closeModal();
      renderApp();
      toast('Workout deleted');
      return;
    case 'set-coach-tab':
      ui.coachTab = element.dataset.tab;
      renderApp();
      if (ui.coachTab === 'chat') scrollCoachChat();
      return;
    case 'quick-coach-question':
      await askCoach(element.dataset.question);
      return;
    case 'remove-pending-photo': {
      const index = Number(element.dataset.photoIndex);
      const [removed] = ui.pendingPhotos.splice(index, 1);
      if (removed?.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(removed.previewUrl);
      ui.pendingPhotos.forEach((photo, photoIndex) => {
        if (!photo.view || photo.view === 'other') photo.view = ['front', 'side', 'back'][photoIndex] || 'other';
      });
      ui.photoAnalysis = '';
      renderApp();
      return;
    }
    case 'analyze-photos':
      await analyzePendingPhotos();
      return;
    case 'save-photo-checkin':
      await savePhotoCheckin();
      return;
    case 'view-photo-checkin':
      openPhotoCheckin(element.dataset.checkinId);
      return;
    case 'delete-photo-checkin':
      await deletePhotoCheckin(element.dataset.checkinId);
      return;
    case 'filter-library':
      ui.libraryMuscle = element.dataset.muscle;
      renderApp();
      return;
    case 'clear-library-filter':
      ui.libraryMuscle = 'All';
      ui.librarySearch = '';
      renderApp();
      return;
    case 'add-custom-exercise':
      openCustomExerciseModal();
      return;
    case 'confirm-custom-exercise': {
      const form = document.getElementById('custom-exercise-form');
      if (!form?.reportValidity()) return;
      const data = new FormData(form);
      const exercise = {
        id: `custom-${uid('exercise')}`,
        name: String(data.get('name')).trim(),
        muscle: String(data.get('muscle')).trim(),
        secondary: [],
        equipment: String(data.get('equipment')).trim(),
        pattern: 'Custom movement',
        level: String(data.get('level') || 'All'),
        tracking: String(data.get('tracking') || 'weight_reps'),
        cue: String(data.get('cue') || '').trim() || 'Use a controlled, pain-free range and record the same setup each time.',
        custom: true
      };
      state.customExercises.push(exercise);
      EXERCISES.push(exercise);
      saveState();
      closeModal();
      renderApp();
      toast('Custom exercise saved');
      return;
    }
    case 'check-ai-status':
      await checkAiStatus(true);
      return;
    case 'export-data':
      await exportData();
      return;
    case 'import-data':
      document.getElementById('import-file')?.click();
      return;
    case 'load-demo':
      openDemoConfirm();
      return;
    case 'confirm-load-demo':
      loadDemoData();
      return;
    case 'reset-app':
      openResetConfirm();
      return;
    case 'confirm-reset-app': {
      if (document.getElementById('reset-confirm-input')?.value.trim().toUpperCase() !== 'ERASE') return toast('Confirmation does not match', 'Type ERASE exactly to continue.', 'warning');
      for (const photo of ui.photos) if (photo.url?.startsWith('blob:')) URL.revokeObjectURL(photo.url);
      for (const photo of ui.pendingPhotos) if (photo.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(photo.previewUrl);
      await dbClearPhotos().catch(() => {});
      localStorage.removeItem(storageKeyForUser());
      state = createDefaultState();
      saveState();
      hydrateCustomExercises();
      ui = { ...ui, onboardingStep: 1, onboardingDraft: safeJsonClone(state.profile), route: 'dashboard', pendingPhotos: [], photos: [], photoAnalysis: '', photoDraft: { date: new Date().toISOString().slice(0, 10), weight: '', note: '' }, coachTab: 'insights' };
      history.replaceState(null, '', '#/dashboard');
      closeModal();
      renderApp();
      toast(auth.user ? 'Training data reset' : 'Local data erased');
      return;
    }
    case 'onboarding-next':
      if (ui.onboardingStep === 1 && !String(ui.onboardingDraft.name || '').trim()) return toast('Add your name', 'This personalizes the dashboard.', 'warning');
      ui.onboardingStep = Math.min(3, ui.onboardingStep + 1);
      renderApp();
      return;
    case 'onboarding-back':
      ui.onboardingStep = Math.max(1, ui.onboardingStep - 1);
      renderApp();
      return;
    case 'finish-onboarding': {
      const draft = ui.onboardingDraft;
      state.profile = {
        ...state.profile,
        name: String(draft.name || 'Athlete').trim(),
        units: draft.units === 'kg' ? 'kg' : 'lb',
        experience: draft.experience || 'beginner',
        goal: draft.goal || 'build-muscle',
        weeklyGoal: clamp(Number(draft.weeklyGoal) || 4, 1, 7),
        bodyWeightKg: Number(draft.bodyWeightDisplay) ? (draft.units === 'lb' ? Number(draft.bodyWeightDisplay) / 2.2046226218 : Number(draft.bodyWeightDisplay)) : 0
      };
      state.onboarded = true;
      saveState();
      renderApp();
      window.scrollTo({ top: 0, behavior: 'auto' });
      toast('Welcome to SetFlow', 'Start with a clean baseline session.');
      return;
    }
    default:
      return;
  }
}

function updateActiveSetField(target) {
  const exercise = state.activeWorkout?.exercises.find(item => item.id === target.dataset.exerciseId);
  const set = exercise?.sets.find(item => item.id === target.dataset.setId);
  if (!set) return;
  const value = target.value;
  switch (target.dataset.activeField) {
    case 'weight': set.weightKg = displayToKg(Number(value) || 0); break;
    case 'reps': set.reps = Math.max(0, Number(value) || 0); break;
    case 'rpe': set.rpe = value === '' ? 0 : clamp(Number(value) || 0, 1, 10); break;
    case 'type': set.type = value; break;
    case 'durationMin': set.durationSec = Math.max(0, Math.round((Number(value) || 0) * 60)); break;
    case 'distance': set.distanceKm = displayToKm(Number(value) || 0); break;
    default: break;
  }
  saveState();
}

function handleInput(event) {
  const target = event.target;
  if (target.id === 'history-search') {
    ui.historySearch = target.value;
    const position = target.selectionStart;
    renderApp();
    preserveFocusAfterRender('history-search', position);
    return;
  }
  if (target.id === 'library-search') {
    ui.librarySearch = target.value;
    const position = target.selectionStart;
    renderApp();
    preserveFocusAfterRender('library-search', position);
    return;
  }
  if (target.id === 'exercise-picker-search') {
    const query = target.value.trim().toLowerCase();
    const filtered = EXERCISES.filter(exercise => `${exercise.name} ${exercise.muscle} ${exercise.equipment} ${exercise.pattern}`.toLowerCase().includes(query));
    const list = document.getElementById('exercise-picker-list');
    if (list) list.innerHTML = renderExercisePickerItems(filtered) || '<div class="empty-state" style="min-height:180px"><p>No matching exercises.</p></div>';
    return;
  }
  if (target.id === 'template-exercise-search') {
    const query = target.value.trim().toLowerCase();
    const filtered = EXERCISES.filter(exercise => `${exercise.name} ${exercise.muscle} ${exercise.equipment}`.toLowerCase().includes(query));
    const list = document.getElementById('template-exercise-list');
    if (list) list.innerHTML = renderTemplateExerciseCheckboxes(filtered);
    return;
  }
  if (target.matches('[data-active-workout-field]')) {
    if (state.activeWorkout) state.activeWorkout[target.dataset.activeWorkoutField] = target.value;
    saveState();
    return;
  }
  if (target.matches('[data-active-exercise-notes]')) {
    const exercise = state.activeWorkout?.exercises.find(item => item.id === target.dataset.activeExerciseNotes);
    if (exercise) exercise.notes = target.value;
    saveState();
    return;
  }
  if (target.matches('[data-onboarding-input]')) {
    ui.onboardingDraft[target.dataset.onboardingInput] = target.value;
    return;
  }
  if (target.id === 'photo-date') ui.photoDraft.date = target.value;
  if (target.id === 'photo-weight') ui.photoDraft.weight = target.value;
  if (target.id === 'photo-note') ui.photoDraft.note = target.value;
}

function handleChange(event) {
  const target = event.target;
  if (target.matches('[data-active-field]')) {
    updateActiveSetField(target);
    renderApp();
    return;
  }
  if (target.matches('[data-pending-photo-view]')) {
    const photo = ui.pendingPhotos[Number(target.dataset.pendingPhotoView)];
    if (photo) photo.view = target.value;
    ui.photoAnalysis = '';
    return;
  }
  if (target.matches('[data-setting-toggle]')) {
    state.settings[target.dataset.settingToggle] = target.checked;
    saveState();
    renderApp();
    return;
  }
  if (target.matches('[data-setting-select]')) {
    state.settings[target.dataset.settingSelect] = Number(target.value);
    saveState();
    renderApp();
    return;
  }
  if (target.matches('[data-onboarding-input]')) {
    ui.onboardingDraft[target.dataset.onboardingInput] = target.value;
    if (target.dataset.onboardingInput === 'units') renderApp();
    return;
  }
  if (target.id === 'photo-input' && target.files?.length) {
    handlePhotoFiles(target.files);
    return;
  }
  if (target.id === 'import-file' && target.files?.[0]) {
    importBackup(target.files[0]);
  }
}

async function handleSubmit(event) {
  if (event.target.id === 'auth-form') {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim();
    const password = String(data.get('password') || '');
    const creating = ui.authMode === 'signup';
    const submit = form.querySelector('button[type="submit"]');
    if (submit) submit.disabled = true;
    try {
      const previousOwner = currentPhotoOwner();
      const response = await fetch(creating ? '/api/auth/signup' : '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(creating ? {
          name: String(data.get('name') || '').trim(),
          email,
          password,
          state: cloudStateSnapshot()
        } : { email, password })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || `Account request failed (${response.status})`);

      if (creating) {
        auth.user = payload.user;
        auth.token = payload.token;
        auth.revision = Number(payload.revision || 0);
        auth.syncStatus = 'synced';
        auth.lastSyncedAt = new Date().toISOString();
        auth.guestMode = false;
        localStorage.removeItem(GUEST_MODE_KEY);
        persistAuthSession();
        await dbReassignPhotos(previousOwner, auth.user.id).catch(error => console.warn('Could not reassign local photos', error));
        localStorage.removeItem(STORAGE_KEY);
        saveState(true);
        await refreshPhotoCache();
        await checkAiStatus(false);
        renderApp();
        toast('Account created', 'Your current workout data is now linked to this SetFlow account.');
      } else {
        const cachedUserState = loadState(storageKeyForUser(payload.user));
        auth.user = payload.user;
        auth.token = payload.token;
        auth.revision = Number(payload.revision || 0);
        auth.syncStatus = 'synced';
        auth.lastSyncedAt = payload.updatedAt || new Date().toISOString();
        auth.guestMode = false;
        localStorage.removeItem(GUEST_MODE_KEY);
        persistAuthSession();
        const hasCloudState = payload.state && typeof payload.state === 'object' && Object.keys(payload.state).length > 0;
        state = hasCloudState ? normalizeCloudState(payload.state, cachedUserState.photoCheckins) : cachedUserState;
        hydrateCustomExercises();
        saveState(true);
        ui.onboardingDraft = safeJsonClone(state.profile);
        await refreshPhotoCache();
        await checkAiStatus(false);
        renderApp();
        if (!hasCloudState) scheduleCloudSync();
        toast('Signed in', `${state.workouts.length} workouts loaded for ${auth.user.name || auth.user.email}.`);
      }
    } catch (error) {
      console.warn('Authentication failed', error);
      toast(creating ? 'Could not create account' : 'Could not sign in', error.message, 'error');
    } finally {
      if (submit) submit.disabled = false;
    }
    return;
  }
  if (event.target.id === 'coach-form') {
    event.preventDefault();
    const data = new FormData(event.target);
    const question = String(data.get('question') || '').trim();
    event.target.reset();
    await askCoach(question);
    return;
  }
  if (event.target.id === 'settings-profile-form') {
    event.preventDefault();
    const data = new FormData(event.target);
    const bodyWeightDisplay = Number(data.get('bodyWeight')) || 0;
    const bodyWeightKg = bodyWeightDisplay ? displayToKg(bodyWeightDisplay) : 0;
    state.profile.name = String(data.get('name') || 'Athlete').trim();
    state.profile.experience = String(data.get('experience') || 'beginner');
    state.profile.goal = String(data.get('goal') || 'build-muscle');
    state.profile.weeklyGoal = clamp(Number(data.get('weeklyGoal')) || 4, 1, 7);
    state.profile.bodyWeightKg = bodyWeightKg;
    state.profile.units = data.get('units') === 'kg' ? 'kg' : 'lb';
    saveState();
    renderApp();
    toast('Profile saved');
  }
}

document.addEventListener('click', event => {
  const routeElement = event.target.closest('[data-route]');
  if (routeElement) {
    event.preventDefault();
    closeModal();
    navigate(routeElement.dataset.route);
    return;
  }
  const actionElement = event.target.closest('[data-action]');
  if (!actionElement) return;
  if (actionElement.classList.contains('modal-backdrop') && event.target.closest('[data-modal-panel]')) return;
  event.preventDefault();
  handleAction(actionElement.dataset.action, actionElement).catch(error => {
    console.error('SetFlow action failed', error);
    toast('Something went wrong', 'Your saved data is still available. Try the action again.', 'error');
  });
});

document.addEventListener('input', handleInput);
document.addEventListener('change', handleChange);
document.addEventListener('submit', event => {
  handleSubmit(event).catch(error => {
    console.error('SetFlow form failed', error);
    toast('Could not complete that action', 'Please check the entered information and try again.', 'error');
  });
});

document.addEventListener('click', event => {
  const choice = event.target.closest('[data-onboarding-choice]');
  if (!choice) return;
  ui.onboardingDraft[choice.dataset.onboardingChoice] = choice.dataset.value;
  renderApp();
});

document.addEventListener('dragover', event => {
  const dropzone = event.target.closest('#photo-dropzone');
  if (!dropzone) return;
  event.preventDefault();
  dropzone.classList.add('dragover');
});

document.addEventListener('dragleave', event => {
  const dropzone = event.target.closest('#photo-dropzone');
  if (dropzone) dropzone.classList.remove('dragover');
});

document.addEventListener('drop', event => {
  const dropzone = event.target.closest('#photo-dropzone');
  if (!dropzone) return;
  event.preventDefault();
  dropzone.classList.remove('dragover');
  if (event.dataTransfer?.files?.length) handlePhotoFiles(event.dataTransfer.files);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (ui.restTimer) finishRestTimer();
    else if (ui.modalOpen) closeModal();
  }
});

window.addEventListener('hashchange', () => {
  const route = (location.hash || '#/dashboard').replace('#/', '') || 'dashboard';
  if (!['dashboard', 'workout', 'history', 'progress', 'coach', 'library', 'settings'].includes(route)) return navigate('dashboard');
  ui.route = route;
  renderApp();
});

let resizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(drawVisibleCharts, 120);
});

window.addEventListener('beforeunload', saveState);

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    updateActiveTimerDisplay();
    if (ui.restTimer) {
      ui.restTimer.remaining = Math.max(0, ui.restTimer.total - Math.floor((Date.now() - ui.restTimer.startedAt) / 1000));
      if (ui.restTimer.remaining <= 0) finishRestTimer();
      else updateRestTimerOverlay();
    }
  }
});

hydrateCustomExercises();
applyTheme();
renderApp();
initializeAccounts().then(() => checkAiStatus(false));

window.addEventListener('online', () => {
  if (auth.user) syncToCloud(false).then(() => {
    if (ui.route === 'settings') renderApp();
  });
});
window.addEventListener('offline', () => {
  if (auth.user) auth.syncStatus = 'offline';
  if (ui.route === 'settings') renderApp();
});

