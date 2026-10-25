/* Marina SDR — landing. Sem dependências. */
(function () {
  'use strict';

  /* Preencha quando tiver os IDs. Vazio = não carrega nada de terceiros. */
  var CONFIG = {
    metaPixelId: '',   // ex.: '123456789012345' (Pixel do Meta)
    ga4Id: '',         // ex.: 'G-XXXXXXXXXX'
    whatsapp: ''       // número da Antum para o botão após o cadastro, só dígitos com DDI. Ex.: '5547999999999'
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

  /* ---------- formulário ---------- */
  var form = $('#trial-form');
  if (!form) return;

  var f = {
    name: $('#f-name'), wa: $('#f-wa'), email: $('#f-email'), company: $('#f-company'),
    hp: $('#f-site'), consent: $('#f-consent'), submit: $('#f-submit')
  };
  var errs = { name: $('#e-name'), wa: $('#e-wa'), email: $('#e-email'), consent: $('#e-consent'), form: $('#e-form') };

  function maskPhone(v) {
    var d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length > 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length - 4) + '-' + d.slice(-4);
    if (d.length > 2) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    return d;
  }
  f.wa.addEventListener('input', function () { f.wa.value = maskPhone(f.wa.value); });

  function setErr(key, input, msg) {
    var el = errs[key];
    if (!el) return;
    if (msg) { el.textContent = msg; el.hidden = false; if (input) input.setAttribute('aria-invalid', 'true'); if (input) input.setAttribute('aria-describedby', el.id); }
    else { el.textContent = ''; el.hidden = true; if (input) { input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby'); } }
  }

  function validate() {
    var first = null, ok = true;
    function fail(key, input, msg) { setErr(key, input, msg); ok = false; if (!first) first = input; }

    var name = f.name.value.trim();
    if (name.length < 2) fail('name', f.name, 'Escreva seu nome.'); else setErr('name', f.name, '');

    var d = f.wa.value.replace(/\D/g, '');
    var okPhone = (d.length === 10 || d.length === 11) && /^[1-9][1-9]/.test(d) && (d.length === 10 || d.charAt(2) === '9');
    if (!okPhone) fail('wa', f.wa, 'Digite o WhatsApp com DDD, por exemplo (47) 99999-9999.'); else setErr('wa', f.wa, '');

    var email = f.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) fail('email', f.email, 'Digite um e-mail válido, como voce@suaempresa.com.br.'); else setErr('email', f.email, '');

    if (!f.consent.checked) fail('consent', f.consent, 'Marque a caixa para continuar.'); else setErr('consent', f.consent, '');

    if (first) first.focus();
    return ok;
  }

  var serverFieldMap = { name: 'name', whatsapp: 'wa', email: 'email', consent: 'consent' };
  var inputOf = { name: f.name, wa: f.wa, email: f.email, consent: f.consent };

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    setErr('form', null, '');
    if (!validate()) return;

    var eventId = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
    var payload = {
      name: f.name.value.trim(),
      whatsapp: f.wa.value.replace(/\D/g, ''),
      email: f.email.value.trim().toLowerCase(),
      company: f.company.value.trim(),
      website: f.hp.value,            // isca anti-robô: deve ir vazia
      consent: true,
      utm: UTM,
      page: location.pathname,
      eventId: eventId
    };

    f.submit.disabled = true;
    var label = f.submit.textContent;
    f.submit.textContent = 'Enviando…';

    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 15000);

    fetch('/api/marina-trial', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) { return { res: res, data: data }; });
    }).then(function (r) {
      clearTimeout(timer);
      if (r.res.ok && r.data && r.data.ok) {
        track('Lead', 'generate_lead', { content_name: 'Marina SDR 7 dias gratis', value: 59.9, currency: 'BRL' }, eventId);
        showDone(payload.name);
        return;
      }
      if (r.res.status === 400 && r.data && r.data.errors) {
        Object.keys(r.data.errors).forEach(function (k) { var ui = serverFieldMap[k]; if (ui) setErr(ui, inputOf[ui], r.data.errors[k]); });
        setErr('form', null, 'Confira os campos destacados e envie de novo.');
      } else if (r.res.status === 429) {
        setErr('form', null, 'Muitas tentativas seguidas. Espere alguns minutos e tente de novo.');
      } else {
        setErr('form', null, 'Não conseguimos registrar seu cadastro agora. Tente de novo em instantes ou escreva para contato@antum.com.br.');
      }
      f.submit.disabled = false; f.submit.textContent = label;
    }).catch(function () {
      clearTimeout(timer);
      setErr('form', null, 'Sem conexão com o servidor. Confira sua internet e tente de novo, ou escreva para contato@antum.com.br.');
      f.submit.disabled = false; f.submit.textContent = label;
    });
  });

  function showDone(name) {
    var done = $('#trial-done');
    var who = $('#done-name');
    if (who) who.textContent = name.split(' ')[0];
    form.hidden = true;
    var title = document.querySelector('.formcard__title');
    var sub = document.querySelector('.formcard__sub');
    if (title) title.hidden = true;
    if (sub) sub.hidden = true;
    if (CONFIG.whatsapp && /^\d{12,13}$/.test(CONFIG.whatsapp)) {
      var a = document.createElement('a');
      a.className = 'btn btn--block';
      a.href = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent('Olá! Acabei de me cadastrar para testar a Marina SDR.');
      a.target = '_blank'; a.rel = 'noopener';
      a.textContent = 'Falar com a Antum no WhatsApp';
      a.addEventListener('click', function () { track('Contact', 'contact_whatsapp', {}); });
      done.appendChild(a);
    }
    done.hidden = false;
    done.focus();
    done.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
})();
