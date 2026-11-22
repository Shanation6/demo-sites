/* =========================================================
   Константин Иванов — клинический психолог (онлайн-консультации)
   Интерактив: бургер-меню, аккордеон FAQ, scroll-reveal через
   IntersectionObserver, форма заявки (демо-заглушка), автогод.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 1. Бургер-меню ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('main-nav');

  function closeMenu() {
    if (!nav || !burger) return;
    nav.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    });

    // Закрываем меню после клика по ссылке-якорю
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Закрываем по Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    // При переходе на десктопную ширину мобильное меню не должно «зависать» открытым
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024) closeMenu();
    });
  }

  /* ---------- 2. Аккордеон FAQ ---------- */
  var faqItems = document.querySelectorAll('.faq-item');

  function setAnswerHeight(item, open) {
    var answer = item.querySelector('.faq-answer');
    if (!answer) return;
    answer.style.maxHeight = open ? answer.scrollHeight + 'px' : '0px';
  }

  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq-question');
    if (!btn) return;

    // Инициализируем пункт, открытый по умолчанию
    if (item.classList.contains('is-open')) setAnswerHeight(item, true);

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      // Одиночное раскрытие: закрываем остальные
      faqItems.forEach(function (other) {
        other.classList.remove('is-open');
        var ob = other.querySelector('.faq-question');
        if (ob) ob.setAttribute('aria-expanded', 'false');
        setAnswerHeight(other, false);
      });

      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        setAnswerHeight(item, true);
      }
    });
  });

  // Пересчёт высоты открытого ответа при ресайзе (текст переносится иначе)
  window.addEventListener('resize', function () {
    document.querySelectorAll('.faq-item.is-open .faq-answer').forEach(function (answer) {
      answer.style.maxHeight = answer.scrollHeight + 'px';
    });
  });

  /* ---------- 3. Scroll-reveal через IntersectionObserver ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Фолбэк для старых браузеров — показываем сразу
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 4. Форма заявки (без бэкенда — демо-обработчик) ---------- */
  var form = document.getElementById('booking-form');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.elements['name'];
      var contact = form.elements['contact'];
      var request = form.elements['request'];
      var valid = true;

      [name, contact, request].forEach(function (field) {
        if (!field) return;
        if (!field.value || !field.value.trim()) {
          field.classList.add('invalid');
          valid = false;
        } else {
          field.classList.remove('invalid');
        }
      });

      if (!valid) {
        alert('Пожалуйста, заполните имя, способ связи и коротко опишите запрос.');
        return;
      }

      // Демонстрационная отправка — здесь подключается реальный бэкенд/API.
      alert('Заявка отправлена (демо)');

      form.reset();
    });

    // Снимаем подсветку ошибки при вводе
    form.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        field.classList.remove('invalid');
      });
    });
  }

  /* ---------- 5. Автогод в футере ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
