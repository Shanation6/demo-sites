/* =========================================================
   Мобильная мастерская · Липецк — интерактив лендинга
   1) Бургер-меню  2) Тень шапки при скролле  3) Появление блоков
   4) Аккордеон FAQ  5) Форма заявки (заглушка, без бэкенда)
   Все контакты/цены меняются в index.html, здесь — только ссылки
   для кнопок, если решите вынести их в один объект.
   ========================================================= */

(function () {
  'use strict';

  /* --- Контакты для демо-уведомлений. Замените на реальные. --- */
  var CONTACTS = {
    phone: '+7 (900) 000-00-00',
    vk: 'https://vk.com/srm48'
  };

  document.addEventListener('DOMContentLoaded', function () {
    initBurger();
    initHeaderShadow();
    initReveal();
    initFaq();
    initForm();
    initYear();
  });

  /* =========================================================
     1. БУРГЕР-МЕНЮ
     ========================================================= */
  function initBurger() {
    var burger = document.getElementById('burger');
    var nav = document.getElementById('main-nav');
    if (!burger || !nav) return;

    function setOpen(open) {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
      nav.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }

    burger.addEventListener('click', function () {
      setOpen(burger.getAttribute('aria-expanded') !== 'true');
    });

    // Клик по ссылке закрывает мобильное меню
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    // Escape закрывает меню и возвращает фокус на кнопку
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        burger.focus();
      }
    });

    // На десктопе меню всегда видно — сбрасываем состояние
    var mq = window.matchMedia('(min-width: 768px)');
    function onResize() { if (mq.matches) setOpen(false); }
    if (mq.addEventListener) mq.addEventListener('change', onResize);
    else mq.addListener(onResize);
  }

  /* =========================================================
     2. ТЕНЬ ШАПКИ ПРИ ПРОКРУТКЕ
     ========================================================= */
  function initHeaderShadow() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    var ticking = false;
    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* =========================================================
     3. ПОЯВЛЕНИЕ БЛОКОВ (IntersectionObserver + класс .is-visible)
     ========================================================= */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    // Если наблюдателя нет или пользователь просил меньше анимаций — показываем сразу
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!('IntersectionObserver' in window) || reduce) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

    // Небольшая очередь, чтобы карточки в ряду появлялись ступенчато
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      observer.observe(el);
    });
  }

  /* =========================================================
     4. АККОРДЕОН FAQ
     ========================================================= */
  function initFaq() {
    var triggers = document.querySelectorAll('.faq-trigger');
    if (!triggers.length) return;

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var item = trigger.closest('.faq-item');
        var panel = document.getElementById(trigger.getAttribute('aria-controls'));
        if (!item || !panel) return;

        var isOpen = trigger.getAttribute('aria-expanded') === 'true';

        // Закрываем остальные, чтобы работал принцип «один открыт»
        triggers.forEach(function (other) {
          if (other === trigger) return;
          var otherItem = other.closest('.faq-item');
          var otherPanel = document.getElementById(other.getAttribute('aria-controls'));
          other.setAttribute('aria-expanded', 'false');
          if (otherItem) otherItem.classList.remove('is-active');
          if (otherPanel) {
            otherPanel.style.maxHeight = '0px';
            otherPanel.classList.remove('open');
            otherPanel.hidden = true;
          }
        });

        if (isOpen) {
          trigger.setAttribute('aria-expanded', 'false');
          item.classList.remove('is-active');
          panel.style.maxHeight = '0px';
          panel.classList.remove('open');
          // hidden ставим после окончания анимации сворачивания
          setTimeout(function () { if (trigger.getAttribute('aria-expanded') === 'false') panel.hidden = true; }, 360);
        } else {
          trigger.setAttribute('aria-expanded', 'true');
          item.classList.add('is-active');
          panel.hidden = false;
          panel.classList.add('open');
          panel.style.maxHeight = panel.scrollHeight + 24 + 'px';
        }
      });
    });

    // При изменении ширины окна пересчитываем высоту открытой панели
    window.addEventListener('resize', function () {
      document.querySelectorAll('.faq-panel.open').forEach(function (panel) {
        panel.style.maxHeight = panel.scrollHeight + 24 + 'px';
      });
    });
  }

  /* =========================================================
     5. ФОРМА ЗАЯВКИ — ДЕМО-ЗАГЛУШКА (без бэкенда)
     ========================================================= */
  function initForm() {
    var form = document.getElementById('request-form');
    if (!form) return;

    var DEVICE_LABELS = {
      smartphone: 'смартфон',
      tablet: 'планшет',
      laptop: 'ноутбук',
      other: 'другое устройство'
    };

    // Простая маска телефона: оставляем цифры и форматируем под российский номер
    var phone = form.querySelector('#phone');
    if (phone) {
      phone.addEventListener('input', function () {
        var digits = phone.value.replace(/\D/g, '').replace(/^8/, '7').slice(0, 11);
        if (!digits) { phone.value = ''; return; }
        if (digits.charAt(0) !== '7') digits = '7' + digits;

        var out = '+7';
        if (digits.length > 1) out += ' (' + digits.slice(1, 4);
        if (digits.length >= 5) out += ') ' + digits.slice(4, 7);
        if (digits.length >= 8) out += '-' + digits.slice(7, 9);
        if (digits.length >= 10) out += '-' + digits.slice(9, 11);
        phone.value = out;
      });
    }

    function setError(input, message) {
      var field = input.closest('.field') || input.closest('.checkbox');
      var holder = form.querySelector('[data-error-for="' + input.id + '"]');
      if (message) {
        if (field) field.classList.add('has-error');
        input.setAttribute('aria-invalid', 'true');
        if (holder) holder.textContent = message;
      } else {
        if (field) field.classList.remove('has-error');
        input.removeAttribute('aria-invalid');
        if (holder) holder.textContent = '';
      }
      return !message;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault(); // бэкенда нет — данные никуда не уходят

      var name = form.querySelector('#name');
      var consent = form.querySelector('#consent');
      var device = form.querySelector('#device');
      var problem = form.querySelector('#problem');

      var ok = true;
      ok = setError(name, name.value.trim().length < 2 ? 'Укажите имя, к вам нужно обратиться.' : '') && ok;
      ok = setError(phone, phone.value.replace(/\D/g, '').length < 11 ? 'Введите телефон полностью, 11 цифр.' : '') && ok;
      ok = setError(consent, consent.checked ? '' : 'Нужно согласие на обработку данных.') && ok;

      if (!ok) {
        var firstBad = form.querySelector('.has-error input, .has-error textarea');
        if (firstBad) firstBad.focus();
        return;
      }

      var summary = 'Заявка отправлена (демо)\n\n' +
        'Имя: ' + name.value.trim() + '\n' +
        'Телефон: ' + phone.value + '\n' +
        'Устройство: ' + (DEVICE_LABELS[device.value] || device.value) + '\n' +
        (problem.value.trim() ? 'Проблема: ' + problem.value.trim() + '\n' : '') +
        '\nМастер перезвонит с номера ' + CONTACTS.phone + '.';

      alert(summary); // демонстрационное подтверждение
      form.reset();
      [name, phone, consent].forEach(function (el) { setError(el, ''); });
    });
  }

  /* =========================================================
     6. ТЕКУЩИЙ ГОД В ФУТЕРЕ
     ========================================================= */
  function initYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }
})();
