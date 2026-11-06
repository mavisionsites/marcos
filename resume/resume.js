const lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'pt';
document.querySelectorAll(lang === 'en' ? '[data-pt]' : '[data-en]').forEach(el => el.remove());
if (lang === 'en') {
  document.documentElement.lang = 'en';
  document.title = 'Marcos Paulo Almeida Rosado | Résumé';
}
