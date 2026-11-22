/* ==========================================================================
   Сергей Друшка · столяр — интерактив
   1) Бургер-меню  2) Аккордеон FAQ  3) Scroll-reveal (.reveal)
   4) Форма заявки (демо: alert)  5) Плавный скролл по якорям  6) Год в футере
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
      if (e.target.closest('a')) closeMenu();
    });

    // Закрытие по Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
        burger.focus();
      }
    });

    // На широком экране сбрасываем состояние меню
    var desktop = window.matchMedia('(min-width: 1024px)');
    var onBreak = function (mq) { if (mq.matches) closeMenu(); };
    if (typeof desktop.addEventListener === 'function') {
      desktop.addEventListener('change', onBreak);
    } else if (typeof desktop.addListener === 'function') {
      desktop.addListener(onBreak);
    }
  }

  /* ---------- 2. АККОРДЕОН FAQ ---------- */
  var triggers = Array.prototype.slice.call(document.querySelectorAll('.acc-trigger'));

  function setPanel(trigger, open) {
    var panelId = trigger.getAttribute('aria-controls');
    var panel = document.getElementById(panelId);
    if (!panel) return;
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    panel.style.maxHeight = open ? panel.scrollHeight + 'px' : null;
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';
      // Закрываем остальные (классический аккордеон)
      triggers.forEach(function (other) {
        if (other !== trigger) setPanel(other, false);
      });
      setPanel(trigger, !isOpen);
    });
  });

  // Пересчёт высоты открытой панели при изменении размера окна
  window.addEventListener('resize', debounce(function () {
    triggers.forEach(function (trigger) {
      if (trigger.getAttribute('aria-expanded') === 'true') setPanel(trigger, true);
    });
  }, 180));

  /* ---------- 3. SCROLL REVEAL ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // Фолбэк для старых браузеров — показываем сразу
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 4. ФОРМА ЗАЯВКИ (демо) ---------- */
  var form = document.getElementById('lead-form');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Лёгкая клиентская проверка обязательных полей
      var ok = true;
      ['name', 'contact', 'wish'].forEach(function (id) {
        var input = document.getElementById(id);
        if (!input) return;
        var field = input.closest('.field');
        if (!input.value.trim()) {
          ok = false;
          if (field) field.classList.add('invalid');
        } else if (field) {
          field.classList.remove('invalid');
        }
      });

      if (!ok) {
        var firstInvalid = form.querySelector('.field.invalid input, .field.invalid textarea');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      alert('Заявка отправлена (демо)');
      form.reset();
    });

    // Убираем подсветку ошибки при вводе
    form.addEventListener('input', function (e) {
      var field = e.target.closest('.field');
      if (field) field.classList.remove('invalid');
    });
  }

  /* ---------- 5. ПЛАВНЫЙ СКРОЛЛ ПО ЯКОРЯМ (учёт sticky-шапки) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var header = document.querySelector('.site-header');
      var offset = (header ? header.offsetHeight : 0) + 12;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top < 0 ? 0 : top, behavior: prefersReduced() ? 'auto' : 'smooth' });
      // Ставим фокус на цель для доступности
      target.setAttribute('tabindex', '-1');
      setTimeout(function () { target.focus({ preventScroll: true }); }, prefersReduced() ? 0 : 450);
    });
  });

  /* ---------- 6. ГОД В ФУТЕРЕ ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- УТИЛИТЫ ---------- */
  function debounce(fn, wait) {
    var t;
    return function () {
      var ctx = this, args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  }

  function prefersReduced() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
})();
