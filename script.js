(function () {
  'use strict';

  /* ---------- Menu mobile ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');

  function closeMenu() {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }

  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') closeMenu();
  });

  /* ---------- Link ativo conforme a rolagem ---------- */
  var links = Array.prototype.slice.call(menu.querySelectorAll('a'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) {
            a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Animação de entrada ---------- */
  var items = document.querySelectorAll('.pillar, .card, .info, .themes li, .law > div, .insta, .where, .alert');
  items.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Contagem regressiva do evento (03/11/2026 14:00, Brasília) ---------- */
  var cd = document.getElementById('countdown');
  var evento = new Date('2026-11-03T14:00:00-03:00').getTime();

  function tick() {
    var diff = evento - Date.now();
    if (diff <= 0) {
      var fim = evento + 6 * 3600 * 1000;
      cd.textContent = Date.now() < fim ? 'O evento está acontecendo agora!' : 'Evento realizado. Obrigado a todos que participaram!';
      return;
    }
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    cd.textContent = 'Faltam ' + d + (d === 1 ? ' dia, ' : ' dias, ') + h + 'h e ' + m + 'min';
  }
  if (cd) { tick(); setInterval(tick, 30000); }

  /* ---------- Busca + filtros dos contatos ---------- */
  var cards = Array.prototype.slice.call(document.querySelectorAll('#cards .card'));
  var busca = document.getElementById('busca');
  var chips = Array.prototype.slice.call(document.querySelectorAll('#chips .chip'));
  var vazio = document.getElementById('vazio');
  var filtro = 'todos';

  function normaliza(t) {
    return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  var textos = cards.map(function (c) { return normaliza(c.textContent); });

  function aplicar() {
    var q = normaliza(busca.value.trim());
    var visiveis = 0;
    cards.forEach(function (c, i) {
      var okCat = filtro === 'todos' || c.dataset.cat.split(' ').indexOf(filtro) !== -1;
      var okTxt = !q || textos[i].indexOf(q) !== -1;
      var mostra = okCat && okTxt;
      c.hidden = !mostra;
      if (mostra) { visiveis++; c.classList.add('in'); }
    });
    vazio.hidden = visiveis > 0;
  }

  busca.addEventListener('input', aplicar);
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('is-on'); });
      chip.classList.add('is-on');
      filtro = chip.dataset.f;
      aplicar();
    });
  });
})();
