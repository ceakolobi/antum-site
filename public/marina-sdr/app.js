/* Marina SDR — landing. Sem dependências. */
(function () {
  'use strict';

  /* Preencha quando tiver os IDs. Vazio = não carrega nada de terceiros. */
  var CONFIG = {
    metaPixelId: '',   // ex.: '123456789012345' (Pixel do Meta)
    ga4Id: ''          // ex.: 'G-XXXXXXXXXX'
  };

  var $ = function (sel, root) { return (root || document).querySelector(sel); };

  /* ---------- ano no rodapé ---------- */
  var ano = $('#ano');
  if (ano) ano.textContent = String(new Date().getFullYear());

  /* ---------- rastreamento (só se configurado) ---------- */
  function loadMeta(id) {
    if (!id || window.fbq) return;
    (function (f, b, e, v) {
      var n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      var t = b.createElement(e); t.async = true; t.src = v;
      var s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', id);
    window.fbq('track', 'PageView');
  }
  function loadGA(id) {
    if (!id || window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
    window.gtag('js', new Date());
    window.gtag('config', id);
  }
  loadMeta(CONFIG.metaPixelId);
  loadGA(CONFIG.ga4Id);

  function track(metaEvent, gaEvent, data, eventId) {
    try {
      if (window.fbq) window.fbq('track', metaEvent, data || {}, eventId ? { eventID: eventId } : undefined);
      if (window.gtag) window.gtag('event', gaEvent, data || {});
    } catch (e) { /* rastreamento nunca pode quebrar a página */ }
  }
  track('ViewContent', 'view_item', { content_name: 'Marina SDR' });

  document.addEventListener('click', function (ev) {
    var a = ev.target.closest ? ev.target.closest('[data-cta]') : null;
    if (a) track('InitiateCheckout', 'cta_click', { location: a.getAttribute('data-cta') });
  });

  /* ---------- UTM e origem ---------- */
  function readUtm() {
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    var out = {};
    try {
      var q = new URLSearchParams(location.search);
      keys.forEach(function (k) { var v = q.get(k); if (v) out[k] = v.slice(0, 80); });
      if (Object.keys(out).length) sessionStorage.setItem('marina_utm', JSON.stringify(out));
      else out = JSON.parse(sessionStorage.getItem('marina_utm') || '{}');
    } catch (e) { out = out || {}; }
    return out;
  }
  var UTM = readUtm();

  /* ---------- CTA fixo no celular ---------- */
  var sticky = $('#sticky-cta');
  var hero = $('.hero');
  var cadastro = $('#comecar');
  if (sticky && hero && 'IntersectionObserver' in window) {
    var heroOut = false, formIn = false;
    var update = function () { sticky.classList.toggle('show', heroOut && !formIn); };
    new IntersectionObserver(function (e) { heroOut = !e[0].isIntersecting; update(); }, { threshold: 0.05 }).observe(hero);
    if (cadastro) new IntersectionObserver(function (e) { formIn = e[0].isIntersecting; update(); }, { threshold: 0.12 }).observe(cadastro);
  }

  /* ---------- vídeo de demonstração (só aparece se o arquivo existir) ---------- */
  var demo = $('#demo');
  if (demo && window.fetch) {
    fetch('/marina-sdr/marina-demo.mp4', { method: 'HEAD' }).then(function (r) {
      var type = r.headers.get('content-type') || '';
      if (r.ok && type.indexOf('video') === 0) demo.hidden = false;
    }).catch(function () { /* sem vídeo, sem seção */ });
  }

  /* ---------- botões de cadastro: levam ao painel da Marina com a origem ---------- */
  var base = {utm_source: 'landing', utm_medium: 'marina-sdr'};
  Array.prototype.forEach.call(document.querySelectorAll('[data-signup]'), function (a) {
    try {
      var u = new URL(a.getAttribute('href'));
      var params = {};
      Object.keys(base).forEach(function (k) { params[k] = base[k]; });
      Object.keys(UTM).forEach(function (k) { params[k] = UTM[k]; });   // campanha real (anúncio) tem prioridade
      var loc = a.getAttribute('data-cta');
      if (loc && !params.utm_content) params.utm_content = loc;
      Object.keys(params).forEach(function (k) { u.searchParams.set(k, params[k]); });
      a.setAttribute('href', u.toString());
    } catch (e) { /* mantém o link simples */ }
    a.addEventListener('click', function () {
      track('Lead', 'generate_lead', { content_name: 'Marina SDR 7 dias gratis', value: 59.9, currency: 'BRL' });
    });
  });
})();
