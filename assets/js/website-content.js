/* Progressive, finite chapter entrances. Content stays visible if motion fails. */
(() => {
 'use strict';
 const section = document.querySelector('.vc-section');
 if (!section || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const easing = 'cubic-bezier(.22,1,.36,1)';
 const active = new Set();
 const play = (element, frames, duration, delay=0) => {
  if (!element || reduced.matches || document.hidden) return;
  const animation = element.animate(frames, {duration, delay, easing, fill:'backwards'});
  active.add(animation);
  animation.finished.catch(() => {}).finally(() => active.delete(animation));
 };
 const reveal = element => {
  if (element.matches('.vc-heading')) {
   element.querySelectorAll('h2>span').forEach((line,i) => play(line,
    [{transform:'translateY(22px)',clipPath:'inset(100% 0 0)'},{transform:'translateY(0)',clipPath:'inset(0% 0 0)'}],780,i*90));
   play(element.querySelector('.vc-direction'),[{transform:'translate(-8px,-8px)',opacity:.3},{transform:'translate(0,0)',opacity:1}],900,200);
   return;
  }
  play(element.querySelector('.vc-rule'),[{transform:'scaleX(.06)'},{transform:'scaleX(1)'}],950);
  play(element.querySelector('.vc-word'),[{transform:'translateY(70%)',opacity:.2},{transform:'translateY(0)',opacity:1}],850,80);
  play(element.querySelector('.vc-number'),[{transform:'translateY(8px)',opacity:.4},{transform:'translateY(0)',opacity:1}],500);
  play(element.querySelector('.vc-copy'),[{transform:'translateY(12px)',opacity:.55},{transform:'translateY(0)',opacity:1}],650,220);
  play(element.querySelector('.vc-marker'),[{transform:'translate(-12px,12px)',opacity:.2},{transform:'translate(0,0)',opacity:1}],800,180);
 };
 const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
   if (!entry.isIntersecting) return;
   observer.unobserve(entry.target);
   reveal(entry.target);
  });
 }, {threshold:.3});
 section.querySelectorAll('.vc-heading,[data-content-chapter]').forEach(el => observer.observe(el));
 const finish = () => { active.forEach(a => a.cancel()); active.clear(); };
 reduced.addEventListener('change', () => { if (reduced.matches) finish(); });
 document.addEventListener('visibilitychange', () => { if(document.hidden) finish(); });
 document.addEventListener('velira:languagechange', finish);
})();
