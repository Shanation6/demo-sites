/* =========================================================
   ANNETSTILIST — интерактив
   1) Бургер-меню  2) Тень шапки при скролле
   3) Появление блоков (.reveal) через IntersectionObserver
   4) Аккордеон FAQ  5) Обработка формы (JS-заглушка)
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 1. Бургер-меню ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('mainNav');

  function closeMenu() {
    if (!burger || !nav) return;
    burger.classList.remove('is-open');
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      burger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    });

    // Закрываем меню при клике по ссылке (якорю)
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Закрываем по Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- 2. Тень у шапки при прокрутке ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Появление блоков .reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target); // анимируем один раз
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) { io.observe(el); });
  } else {
    // Фолбэк для старых браузеров — показываем сразу
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 4. Аккордеон FAQ ---------- */
  var triggers = document.querySelectorAll('.accordion__trigger');
  triggers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Закрываем остальные пункты (одиночное раскрытие)
      triggers.forEach(function (other) {
        if (other === btn) return;
        other.setAttribute('aria-expanded', 'false');
        var op = document.getElementById(other.getAttribute('aria-controls'));
        if (op) { op.style.maxHeight = null; op.classList.remove('is-open'); op.hidden = true; }
      });

      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        if (panel) { panel.style.maxHeight = null; panel.classList.remove('is-open'); panel.hidden = true; }
      } else {
        btn.setAttribute('aria-expanded', 'true');
        if (panel) {
          panel.hidden = false;
          panel.classList.add('is-open');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      }
    });
  });

  /* ---------- 5. Форма записи (без бэкенда — заглушка) ---------- */
  var form = document.getElementById('bookingForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Простая проверка обязательных полей
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        if (!field.value.trim()) { field.classList.add('invalid'); valid = false; }
        else { field.classList.remove('invalid'); }
      });

      if (!valid) {
        alert('Пожалуйста, заполните все поля формы.');
        return;
      }

      var name = (form.elements['name'].value || '').trim();
      // Демонстрационная отправка — реальный бэкенд не подключён
      alert('Запись принята (демо). Спасибо, ' + name + '! Анна свяжется с вами для подтверждения.');
      form.reset();
    });

    // Убираем подсветку ошибки при вводе
    form.querySelectorAll('input, select').forEach(function (field) {
      field.addEventListener('input', function () { field.classList.remove('invalid'); });
    });
  }

  /* ---------- Текущий год в футере ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
})();
