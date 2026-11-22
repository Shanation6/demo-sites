/* =========================================================
   Скрипт сайта-визитки психолога Натальи Пробкиной
   - бургер-меню
   - плавные появления блоков (IntersectionObserver, класс .reveal)
   - аккордеон FAQ
   - форма записи (без бэкенда — демо alert)
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Бургер-меню ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('main-nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    });

    // Закрывать меню после клика по ссылке (мобильные)
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Открыть меню');
      });
    });
  }

  /* ---------- Появление блоков при прокрутке ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
          setTimeout(function () { el.classList.add('is-visible'); }, delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) { io.observe(el); });
  } else {
    // Фолбэк для старых браузеров — показать всё сразу
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Аккордеон FAQ ---------- */
  var triggers = document.querySelectorAll('.acc-trigger');
  triggers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var panel = document.getElementById(btn.getAttribute('aria-controls'));

      // Закрыть остальные (одиночное раскрытие)
      triggers.forEach(function (other) {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          var op = document.getElementById(other.getAttribute('aria-controls'));
          if (op) { op.hidden = true; }
        }
      });

      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      if (panel) { panel.hidden = expanded; }
    });
  });

  /* ---------- Форма записи (демо, без бэкенда) ----------
     Чтобы подключить реальную отправку — замените обработчик на fetch()
     к вашему API или сервису форм.  */
  var form = document.getElementById('booking-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var consent = form.consent.checked;

      if (!name) { alert('Пожалуйста, укажите имя.'); form.name.focus(); return; }
      if (!phone) { alert('Пожалуйста, укажите телефон.'); form.phone.focus(); return; }
      if (!consent) { alert('Нужно согласие на обработку персональных данных.'); return; }

      alert('Заявка отправлена (демо)');
      form.reset();
    });
  }

  /* ---------- Текущий год в футере ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
})();
