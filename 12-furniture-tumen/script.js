/* ==========================================================================
   Мастер Мебели · Тюмень — интерактив
   1) Бургер-меню  2) Аккордеон FAQ  3) Появление блоков (.reveal)
   4) Форма заявки (демо-заглушка)  5) Год в футере
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- 1. БУРГЕР-МЕНЮ ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('main-nav');

  function closeMenu() {
    if (!nav || !burger) return;
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню');
  }

  function openMenu() {
    if (!nav || !burger) return;
    nav.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Закрыть меню');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var isOpen = burger.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });

    // Закрытие по клику на пункт меню (мобильная навигация)
    nav.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (link) closeMenu();
    });

    // Закрытие по Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
        burger.focus();
      }
    });

    // Если экран стал широким (десктоп) — сбрасываем состояние меню
    var desktop = window.matchMedia('(min-width: 1024px)');
    var onBreak = function (mq) { if (mq.matches) closeMenu(); };
    if (typeof desktop.addEventListener === 'function') {
      desktop.addEventListener('change', onBreak);
    } else if (typeof desktop.addListener === 'function') {
      desktop.addListener(onBreak); // старый Safari
    }
  }

  /* ---------- 2. АККОРДЕОН FAQ ---------- */
  var triggers = Array.prototype.slice.call(document.querySelectorAll('.acc-trigger'));

  function collapse(btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.setAttribute('aria-expanded', 'false');
    if (panel) panel.hidden = true;
    var item = btn.closest('.acc-item');
    if (item) item.classList.remove('is-open');
  }

  function expand(btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.setAttribute('aria-expanded', 'true');
    if (panel) panel.hidden = false;
    var item = btn.closest('.acc-item');
    if (item) item.classList.add('is-open');
  }

  triggers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      // Открыт только один вопрос за раз — как в классическом аккордеоне
      triggers.forEach(collapse);
      isOpen ? collapse(btn) : expand(btn);
    });

    // Навигация стрелками между вопросами (доступность)
    btn.addEventListener('keydown', function (e) {
      var i = triggers.indexOf(btn);
      if (i === -1) return;
      var next = null;
      if (e.key === 'ArrowDown') next = triggers[(i + 1) % triggers.length];
      if (e.key === 'ArrowUp') next = triggers[(i - 1 + triggers.length) % triggers.length];
      if (e.key === 'Home') next = triggers[0];
      if (e.key === 'End') next = triggers[triggers.length - 1];
      if (next) { e.preventDefault(); next.focus(); }
    });
  });

  // Первый вопрос открыт по умолчанию
  if (triggers.length) expand(triggers[0]);

  /* ---------- 3. ПОЯВЛЕНИЕ БЛОКОВ (IntersectionObserver) ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 4. ФОРМА ЗАЯВКИ (без бэкенда — заглушка) ---------- */
  var form = document.getElementById('lead-form');
  var errorBox = document.getElementById('form-error');

  function showError(msg) {
    if (!errorBox) return;
    errorBox.textContent = msg;
    errorBox.hidden = false;
  }

  function clearError() {
    if (!errorBox) return;
    errorBox.textContent = '';
    errorBox.hidden = true;
  }

  function markInvalid(field, invalid) {
    field.classList.toggle('invalid', invalid);
    if (invalid) {
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.removeAttribute('aria-invalid');
    }
  }

  if (form) {
    var nameField = form.querySelector('#name');
    var phoneField = form.querySelector('#phone');
    var typeField = form.querySelector('#job-type');
    var commentField = form.querySelector('#comment');

    // Лёгкий формат телефона: не меньше 10 цифр
    function digits(v) { return (v || '').replace(/\D/g, ''); }

    [nameField, phoneField].forEach(function (f) {
      if (!f) return;
      f.addEventListener('input', function () {
        markInvalid(f, false);
        clearError();
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearError();

      var problems = [];

      if (!nameField.value.trim()) {
        problems.push('укажите имя');
        markInvalid(nameField, true);
      }

      if (digits(phoneField.value).length < 10) {
        problems.push('укажите телефон полностью (не менее 10 цифр)');
        markInvalid(phoneField, true);
      }

      if (problems.length) {
        showError('Проверьте форму: ' + problems.join(', ') + '.');
        (nameField.classList.contains('invalid') ? nameField : phoneField).focus();
        return;
      }

      // Демонстрационная отправка: данные никуда не уходят.
      // Здесь позже можно подставить fetch('/api/lead', {...}) или отправку в Telegram-бот.
      var summary =
        'Имя: ' + nameField.value.trim() + '\n' +
        'Телефон: ' + phoneField.value.trim() + '\n' +
        'Тип работы: ' + (typeField ? typeField.value : '—') + '\n' +
        'Комментарий: ' + (commentField && commentField.value.trim() ? commentField.value.trim() : 'без комментария');

      alert('Заявка отправлена (демо)\n\n' + summary +
        '\n\nЭто демонстрационная форма — данные не уходят на сервер.\n' +
        'Для боевого сайта подключите обработку отправки.');

      form.reset();
      if (typeField && typeField.options.length) typeField.selectedIndex = 0;
    });
  }

  /* ---------- 5. ТЕКУЩИЙ ГОД В ФУТЕРЕ ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

})();
