/* Progressive client-journey explorer. Static content is the fallback. */
(() => {
  'use strict';
  const root = document.querySelector('.sx-system');
  if (!root) return;
  const tabs = [...root.querySelectorAll('[data-service-tab]')];
  const panels = [...root.querySelectorAll('[data-service-panel]')];
  if (tabs.length !== 3 || panels.length !== 3) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Set();
  let selected = 0;
  let inView = false;
  const cancelMotion = () => { animations.forEach(a => a.cancel()); animations.clear(); };
  const animate = (el, frames, opts) => {
    if (reduced.matches || !el.animate) return;
    const a = el.animate(frames, { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)', ...opts });
    animations.add(a);
    a.finished.catch(() => {}).finally(() => animations.delete(a));
  };
  const reveal = panel => {
    if (reduced.matches) return;
    animate(panel.querySelector('.sx-copy'), [{ opacity: .6, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }]);
    animate(panel.querySelector('.sx-stage > .sx-stagger'), [{ opacity: .45, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], { delay: 70, fill: 'backwards' });
    if (panel.dataset.servicePanel === 'automation') {
      panel.querySelectorAll('.sx-route-line').forEach((el, i) => animate(el, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { delay: 190 + i * 100, duration: 450, fill: 'backwards' }));
    }
  };
  const select = (index, { focus = false, align = false, motion = true } = {}) => {
    if (index < 0 || index >= tabs.length) return;
    cancelMotion();
    selected = index;
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (focus) tabs[index].focus({ preventScroll: true });
    if (align) root.querySelector('.sx-tabs').scrollIntoView({ behavior: 'instant', block: 'start' });
    if (motion) reveal(panels[index]);
  };
  root.querySelector('.sx-tabs').setAttribute('role', 'tablist');
  tabs.forEach((tab, i) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panels[i].id);
    panels[i].setAttribute('role', 'tabpanel');
    panels[i].setAttribute('aria-labelledby', tab.id);
    tab.addEventListener('click', () => { if (selected !== i) select(i); });
    tab.addEventListener('keydown', event => {
      const key = event.key;
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(key)) return;
      event.preventDefault();
      const next = key === 'Home' ? 0 : key === 'End' ? tabs.length - 1 : (i + (key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      select(next, { focus: true });
    });
  });
  root.querySelectorAll('[data-service-next]').forEach(button => {
    button.addEventListener('click', () => {
      const next = tabs.findIndex(tab => tab.dataset.serviceTab === button.dataset.serviceNext);
      select(next, { focus: true, align: true });
    });
  });
  root.classList.add('sx-enhanced');
  select(0, { motion: false });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting) || inView) return;
      inView = true; reveal(panels[selected]); observer.disconnect();
    }, { threshold: .2 });
    observer.observe(root.querySelector('.sx-explorer'));
  }
  reduced.addEventListener('change', event => { if (event.matches) cancelMotion(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelMotion(); });
})();
