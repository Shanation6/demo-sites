/* ============================================================
   Виктория — бровист-лешмейкер. Сайт-визитка.
   Vanilla JS: scroll-reveal, аккордеон FAQ, форма заявки.
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Текущий год в футере ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- Scroll reveal через IntersectionObserver ---------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  function showAll() {
    revealItems.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  if (!('IntersectionObserver' in window)) {
    // Фолбэк: сразу показываем всё, ничего не теряем.
    showAll();
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.14,
      rootMargin: '0px 0px -8% 0px'
    });

    revealItems.forEach(function (el, i) {
      // Лёгкая каскадная задержка для соседних карточек.
      var sibling = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = Math.min(Math.max(sibling, 0), 5) * 70 + 'ms';
      observer.observe(el);
    });

    // Если элемент уже в зоне видимости при загрузке — observer сработает сам.
  }

  /* ---------- Аккордеон FAQ ---------- */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.faq-item'));

  function setOpen(item, open) {
    var btn = item.querySelector('.faq-q');
    var panel = item.querySelector('.faq-a');
    if (!btn || !panel) return;

    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    item.classList.toggle('is-open', open);

    if (open) {
      panel.removeAttribute('hidden');
      // Анимация высоты: от 0 до реальной высоты содержимого.
      panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
      panel.style.maxHeight = '0px';
      // Скрываем от скринридеров после окончания анимации.
      window.setTimeout(function () {
        if (!item.classList.contains('is-open')) {
          panel.setAttribute('hidden', '');
        }
      }, 360);
    }
  }

  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    if (!btn) return;

    setOpen(item, false);

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      // Одновременно открыт только один вопрос.
      faqItems.forEach(function (other) {
        if (other !== item && other.classList.contains('is-open')) {
          setOpen(other, false);
        }
      });

      setOpen(item, !isOpen);
    });
  });

  // При изменении размера окна пересчитываем высоту открытой панели.
  var resizeTimer;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      faqItems.forEach(function (item) {
        var panel = item.querySelector('.faq-a');
        if (panel && item.classList.contains('is-open')) {
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    }, 150);
  });

  /* ---------- Плавный скролл к якорям (с учётом sticky-шапки) ---------- */
  var header = document.querySelector('.site-header');

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var id = link.getAttribute('href');
      if (!id || id === '#') return;

      var target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();

      var offset = header ? header.getBoundingClientRect().height + 12 : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;

      var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      window.scrollTo({
        top: top < 0 ? 0 : top,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });

      // Фокус на целевой секции для доступности с клавиатуры.
      target.setAttribute('tabindex', '-1');
      window.setTimeout(function () {
        target.focus({ preventScroll: true });
      }, reduceMotion ? 0 : 420);
    });
  });

  /* ---------- Форма заявки ---------- */
  var form = document.getElementById('booking-form');

  if (form) {
    var errorBox = document.getElementById('form-error');
    var nameField = document.getElementById('name');
    var contactField = document.getElementById('contact-info');

    function showError(message) {
      if (!errorBox) return;
      errorBox.textContent = message;
      errorBox.removeAttribute('hidden');
    }

    function clearError() {
      if (!errorBox) return;
      errorBox.textContent = '';
      errorBox.setAttribute('hidden', '');
    }

    [nameField, contactField].forEach(function (field) {
      if (!field) return;
      field.addEventListener('input', function () {
        field.classList.remove('is-invalid');
        clearError();
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var name = nameField ? nameField.value.trim() : '';
      var contact = contactField ? contactField.value.trim() : '';

      if (name.length < 2) {
        showError('Напишите, пожалуйста, ваше имя.');
        if (nameField) {
          nameField.classList.add('is-invalid');
          nameField.focus();
        }
        return;
      }

      if (contact.length < 3) {
        showError('Укажите контакт, по которому можно связаться.');
        if (contactField) {
          contactField.classList.add('is-invalid');
          contactField.focus();
        }
        return;
      }

      clearError();
      alert('Заявка отправлена (демо)');
      form.reset();
    });
  }
})();
