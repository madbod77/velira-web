/* Small progressive motion layer. WAAPI owns staged motion; CSS owns ambient light. */
(() => {
 'use strict';
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const timings = { duration:780, stagger:90, easing:'cubic-bezier(.22,1,.36,1)' };
 const active = new Set();
 const animate = (el,frames,options) => {
  if(reduced.matches || !el.animate) return;
  const a=el.animate(frames,options);active.add(a);
  a.finished.catch(()=>{}).finally(()=>active.delete(a));return a;
 };
 const intro=()=>{
  if(reduced.matches) return;
  document.querySelectorAll('.hero-line').forEach((el,i)=>animate(el,[{transform:'translateY(28px)',clipPath:'inset(100% 0 0 0)'},{transform:'translateY(0)',clipPath:'inset(0% 0 0 0)'}],{duration:timings.duration,delay:i*timings.stagger,easing:timings.easing,fill:'backwards'}));
  document.querySelectorAll('.hero-description,.hero-actions,.vw-hero__lede').forEach((el,i)=>animate(el,[{opacity:el.matches('.hero-actions')?1:.72,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,delay:430+i*90,easing:timings.easing,fill:'backwards'}));
 };
 intro();
 if('IntersectionObserver' in window){
  const ob=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{if(!entry.isIntersecting)return;ob.unobserve(entry.target);animate(entry.target,[{opacity:.25,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],{duration:700,easing:timings.easing});});
  },{threshold:.12});
  document.querySelectorAll('[data-enter]').forEach(el=>ob.observe(el));
 }
 reduced.addEventListener('change',event=>{if(event.matches)active.forEach(a=>a.cancel());});
 document.addEventListener('visibilitychange',()=>document.querySelectorAll('.light-beam').forEach(el=>{el.style.animationPlayState=document.hidden?'paused':'running';}));
 // Preserve meaningful plan choice on the original website form.
 document.querySelectorAll('.vw-plans article').forEach(article=>{
  const link=article.querySelector('a[href="#order"]');
  link?.addEventListener('click',()=>{const plan=article.querySelector('.vw-plan__top b')?.textContent?.trim();const input=document.querySelector('[data-lead-form] [name="plan"]');if(input && plan){const option=Array.from(input.options||[]).find(o=>o.textContent.toLowerCase().includes(plan.toLowerCase()));input.value=option?option.value:plan;input.dispatchEvent(new Event('change',{bubbles:true}));}});
 });
})();
(() => {
 const buttons=[...document.querySelectorAll('[data-price-mode]')];if(!buttons.length)return;
 let mode='standard';const render=()=>{
  const mult=mode==='rush'?1.5:1,lang=document.documentElement.lang==='en'?'en-US':'uk-UA';
  document.querySelectorAll('[data-studio-price]').forEach(el=>{el.textContent='$'+Number(el.dataset.studioPrice)*mult;});
  document.querySelectorAll('[data-studio-uah]').forEach(el=>{const amount=Math.round(Number(el.dataset.studioUah)*mult*(window.VELIRA_CONFIG?.UAH_RATE||41.5)/100)*100;el.textContent='≈ '+amount.toLocaleString(lang)+' ₴';});
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.priceMode===mode)));
  document.querySelectorAll('select[name=plan] option').forEach(o=>{const match=o.textContent.match(/^(Spark|Orbit|Supernova|Premium)/);if(!match)return;const base={Spark:150,Orbit:250,Supernova:500,Premium:5000}[match[1]];const text=match[1]+' — '+(document.documentElement.lang==='en'?'from ':'від ')+'$'+base*(match[1]==='Premium'?1:mult);o.textContent=text;o.value=text;});
  const form=document.querySelector('[data-lead-form]');if(form){let input=form.querySelector('[name=priceMode]');if(!input){input=document.createElement('input');input.type='hidden';input.name='priceMode';form.append(input);}input.value=mode;}
 };
 buttons.forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.priceMode;render();}));document.addEventListener('velira:languagechange',render);render();
})();
