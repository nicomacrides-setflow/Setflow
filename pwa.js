(() => {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isiOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  let deferredPrompt = null;

  function banner(message, buttonText, onClick) {
    if (document.getElementById('setflow-install-banner')) return;
    const el = document.createElement('div');
    el.id = 'setflow-install-banner';
    el.setAttribute('role', 'status');
    el.style.cssText = 'position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:99999;background:#171a1f;color:#f4f7f0;border:1px solid #30353d;border-radius:16px;padding:12px 14px;box-shadow:0 14px 42px rgba(0,0,0,.35);font:14px/1.35 system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;display:flex;gap:10px;align-items:center;max-width:560px;margin:auto';
    const text = document.createElement('div'); text.textContent = message; text.style.flex = '1';
    const btn = document.createElement('button'); btn.textContent = buttonText; btn.style.cssText = 'border:0;border-radius:10px;padding:9px 12px;background:#b7f45c;color:#0b0d10;font-weight:800;white-space:nowrap'; btn.onclick = onClick;
    const x = document.createElement('button'); x.textContent = '×'; x.setAttribute('aria-label','Dismiss'); x.style.cssText='border:0;background:transparent;color:#aeb6c2;font-size:22px;padding:0 2px'; x.onclick=()=>{el.remove();sessionStorage.setItem('setflow-install-dismissed','1')};
    el.append(text, btn, x); document.body.appendChild(el);
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault(); deferredPrompt = event;
    if (!isStandalone && !sessionStorage.getItem('setflow-install-dismissed')) {
      banner('Install SetFlow for full-screen workouts and quick home-screen access.', 'Install', async () => {
        document.getElementById('setflow-install-banner')?.remove();
        await deferredPrompt?.prompt(); deferredPrompt = null;
      });
    }
  });

  window.addEventListener('appinstalled', () => document.getElementById('setflow-install-banner')?.remove());

  window.addEventListener('load', () => {
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('/sw.js').catch(console.warn);
    }
    if (isiOS && !isStandalone && !sessionStorage.getItem('setflow-install-dismissed')) {
      setTimeout(() => banner('Add SetFlow to your iPhone: tap Share, then “Add to Home Screen”.', 'Got it', () => {
        document.getElementById('setflow-install-banner')?.remove();
        sessionStorage.setItem('setflow-install-dismissed','1');
      }), 1200);
    }
  });
})();
