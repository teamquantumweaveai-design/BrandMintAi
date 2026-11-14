/* Shared privacy choices for the React site and standalone pages. */
(() => {
  'use strict';
  if (window.brandmintPrivacy) return;
  const key = 'brandmint-cookie-consent-v1';
  const measurement = 'G-Z1HB1R50YF';
  const lifetime = 180 * 86400000;
  let choice = null;
  let loaded = false;
  let banner, dialog, analyticsInput, notice, opener;
  function read(raw) {
    try {
      const value = JSON.parse(raw);
      return value?.version === 1 && typeof value.analytics === 'boolean' &&
        Number.isFinite(value.updatedAt) && value.updatedAt <= Date.now() &&
        Date.now() - value.updatedAt < lifetime ? value : null;
    } catch { return null; }
  }
  try { choice = read(localStorage.getItem(key)); } catch { /* Session-only choice. */ }
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    // Do not queue pre-consent interaction events for later replay.
    if (arguments[0] === 'consent' || choice?.analytics === true) window.dataLayer.push(arguments);
  };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied'
  });
  function clearAnalyticsCookies() {
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      if (name !== '_ga' && !name.startsWith('_ga_') && name !== '_gid' && !name.startsWith('_gat')) return;
      const domains = ['', location.hostname];
      const parts = location.hostname.split('.');
      for (let i = 0; i < parts.length - 1; i++) domains.push('.' + parts.slice(i).join('.'));
      domains.forEach(domain => {
        document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? '; Domain=' + domain : ''}`;
      });
    });
  }
  function apply() {
    const allowed = choice?.analytics === true;
    window['ga-disable-' + measurement] = !allowed;
    window.gtag('consent', 'update', { analytics_storage: allowed ? 'granted' : 'denied' });
    if (!allowed) {
      clearAnalyticsCookies();
      document.getElementById('bm-google-analytics')?.remove();
      return;
    }
    if (loaded) return;
    loaded = true;
    window.gtag('js', new Date());
    window.gtag('config', measurement, { allow_google_signals: false, allow_ad_personalization_signals: false });
    const script = document.createElement('script');
    script.id = 'bm-google-analytics';
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurement;
    document.head.appendChild(script);
  }
  function save(analytics) {
    choice = { version: 1, analytics, updatedAt: Date.now() };
    let persisted = true;
    try { localStorage.setItem(key, JSON.stringify(choice)); } catch { persisted = false; }
    apply();
    banner.hidden = true;
    if (dialog.open) dialog.close();
    notice.textContent = persisted ? 'Cookie preferences saved.' : 'Preferences applied for this page. Browser storage is unavailable, so you may be asked again.';
    window.setTimeout(() => { notice.textContent = ''; }, 6000);
    if (opener?.isConnected && !opener.closest('[hidden]')) opener.focus({ preventScroll: true });
    else document.querySelector('.bm-cookie-reopen').focus({ preventScroll: true });
  }
  function open() {
    opener = document.activeElement;
    analyticsInput.checked = choice?.analytics === true;
    dialog.showModal();
  }
  window.brandmintPrivacy = { openSettings: open };
  apply();
  function mount() {
    const style = document.createElement('link');
    style.rel = 'stylesheet'; style.href = '/privacy/privacy.css?v=1';
    document.head.appendChild(style);
    const root = document.createElement('div');
    root.className = 'bm-privacy-controls';
    root.innerHTML = `
      <section class="bm-cookie-banner" role="region" aria-label="Cookie choices" hidden>
        <div class="bm-cookie-inner"><div class="bm-cookie-copy"><h2>Your privacy choices</h2>
          <p>We use essential storage to keep requested features working. Google Analytics stays off unless you accept it. <a href="/cookie-policy/">Cookie Policy</a> · <a href="/privacy-policy/">Privacy Policy</a></p></div>
          <div class="bm-cookie-actions"><button type="button" data-choice="reject">Reject optional</button><button type="button" data-settings>Customize</button><button type="button" class="bm-cookie-accept" data-choice="accept">Accept analytics</button></div>
        </div>
      </section>
      <button type="button" class="bm-cookie-reopen" data-settings>Cookie settings</button>
      <dialog class="bm-cookie-dialog" aria-labelledby="bm-cookie-title"><div class="bm-cookie-dialog-body">
        <div class="bm-cookie-dialog-heading"><h2 id="bm-cookie-title">Cookie settings</h2><button type="button" class="bm-cookie-close" aria-label="Close cookie settings">×</button></div>
        <p>You choose whether analytics runs. Essential storage supports services you request and remembers this choice.</p>
        <div class="bm-cookie-option"><div><strong>Essential storage</strong><p>Privacy choices, security and requested features.</p></div><span>Always on</span></div>
        <label class="bm-cookie-option"><div><strong>Google Analytics</strong><p>Helps us understand visits and improve the website. Optional; off by default.</p></div><input type="checkbox" aria-label="Allow Google Analytics"></label>
        <p>We do not enable advertising cookies through this control. Voice memory, enquiries and external services have separate controls. <a href="/cookie-policy/">Read the Cookie Policy</a>.</p>
        <div class="bm-cookie-actions"><button type="button" data-choice="reject">Reject optional</button><button type="button" class="bm-cookie-accept" data-save>Save preferences</button></div>
      </div></dialog><p class="bm-cookie-status" role="status" aria-live="polite"></p>`;
    document.body.appendChild(root);
    banner = root.querySelector('.bm-cookie-banner');
    dialog = root.querySelector('dialog');
    analyticsInput = dialog.querySelector('input');
    notice = root.querySelector('[role="status"]');
    banner.hidden = !!choice;
    root.querySelectorAll('[data-choice]').forEach(button => button.addEventListener('click', () => save(button.dataset.choice === 'accept')));
    root.querySelector('[data-save]').addEventListener('click', () => save(analyticsInput.checked));
    root.querySelector('.bm-cookie-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => { if (opener?.isConnected) opener.focus({ preventScroll: true }); });
    document.addEventListener('click', event => {
      if (event.target instanceof Element && event.target.closest('[data-cookie-settings], [data-settings]')) { event.preventDefault(); open(); }
    });
    window.addEventListener('storage', event => {
      if (event.key !== key && event.key !== null) return;
      choice = read(event.key === null ? null : event.newValue);
      apply(); banner.hidden = !!choice; analyticsInput.checked = choice?.analytics === true;
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
