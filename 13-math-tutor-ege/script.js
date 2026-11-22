// ===== Константин Юрьевич — лендинг репетитора (vanilla JS) =====
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initBurger();
    initReveal();
    initAccordion();
    initCounters();
    initForm();
    setYear();
  });

  // ---- Бургер-меню ----
  function initBurger() {
    var burger = document.getElementById('burger');
    var nav = document.getElementById('nav');
    if (!burger || !nav) return;

    function closeMenu() {
      burger.classList.remove('is-open');
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }

    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
    });

    // Закрытие при клике по ссылке навигации
    nav.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Закрытие по Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // ---- Плавные scroll-reveal анимации ----
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  // ---- Аккордеон FAQ ----
  function initAccordion() {
    var acc = document.getElementById('accordion');
    if (!acc) return;

    var items = acc.querySelectorAll('.acc-item');

    items.forEach(function (item) {
      var head = item.querySelector('.acc-head');
      var body = item.querySelector('.acc-body');
      if (!head || !body) return;

      head.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        // Закрываем остальные (одиночное раскрытие)
        items.forEach(function (other) {
          other.classList.remove('is-open');
          var oHead = other.querySelector('.acc-head');
          var oBody = other.querySelector('.acc-body');
          if (oHead) oHead.setAttribute('aria-expanded', 'false');
          if (oBody) oBody.style.maxHeight = null;
        });

        if (!isOpen) {
          item.classList.add('is-open');
          head.setAttribute('aria-expanded', 'true');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });

    // Пересчёт высоты при ресайзе для открытого элемента
    window.addEventListener('resize', function () {
      var open = acc.querySelector('.acc-item.is-open .acc-body');
      if (open) open.style.maxHeight = open.scrollHeight + 'px';
    });
  }

  // ---- Счётчики метрик (анимация чисел) ----
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    function animate(el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var duration = 1400;
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        // easeOutCubic
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target).toString();
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animate);
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  // ---- Форма заявки ----
  function initForm() {
    var form = document.getElementById('leadForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.elements['name'];
      var contact = form.elements['contact'];
      var valid = true;

      [name, contact].forEach(function (input) {
        if (!input.value.trim()) {
          input.classList.add('invalid');
          valid = false;
        } else {
          input.classList.remove('invalid');
        }
      });

      if (!valid) return;

      alert('Заявка отправлена (демо)');
      form.reset();
    });

    // Убираем подсветку ошибки при вводе
    form.querySelectorAll('input').forEach(function (input) {
      input.addEventListener('input', function () {
        input.classList.remove('invalid');
      });
    });
  }

  // ---- Текущий год в футере ----
  function setYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear().toString();
  }
})();
