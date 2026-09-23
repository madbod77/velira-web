/* Keep browser and sharing metadata in the selected interface language. */
(() => {
  'use strict';
  const descriptions = {
    'index.html': ['Velira — websites, Telegram bots and business automation', 'Velira creates websites, Telegram bots and automation that help businesses keep the connection with customers after the click.'],
    'websites.html': ['Velira Websites — bespoke websites from idea to launch', 'Velira creates distinctive, responsive websites: strategy, UX/UI, development, motion and launch support.'],
    'flow.html': ['Velira Flow — automation and analytics demo', 'Velira Flow shows how automation receives enquiries, qualifies leads and calculates business analytics in an interactive demo.'],
    'animations.html': ['Velira Motion — motion design and video', 'Motion design and video for websites, presentations and digital campaigns. Explore original demo reels.'],
    'offer-standard.html': ['Velira — Standard System · $1000', 'Velira Standard System — a website, a conversation channel and business automation for $1000.'],
    'offer-premium.html': ['Velira — Premium System · $7500', 'Velira Premium System — bespoke design, deeper automation, product validation and analytics for $7500.'],
  };
  let page = location.pathname.split('/').pop() || 'index.html';
  if (['desktop.html', 'tablet.html', 'mobile.html'].includes(page)) page = 'websites.html';
  const english = descriptions[page];
  const description = document.querySelector('meta[name="description"]');
  if (!english || !description) return;
  const ukrainian = [document.title, description.content];
  const render = () => {
    const [title, content] = document.documentElement.lang === 'en' ? english : ukrainian;
    document.title = title;
    description.content = content;
  };
  new MutationObserver(render).observe(document.documentElement, {attributes: true, attributeFilter: ['lang']});
  render();
})();
