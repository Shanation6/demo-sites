/* ==========================================================================
   Торты от Кати — скрипты страницы
   1) Бургер-меню      4) Аккордеон FAQ
   2) Тень шапки       5) Валидация + заглушка отправки формы
   3) Reveal-анимации  6) Подсветка активного пункта меню, год в футере
   Без внешних библиотек. Работает на ES2017+.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ *
   * 1. БУРГЕР-МЕНЮ
   * ------------------------------------------------------------------ */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('main-nav');

  function closeMenu() {
    if (!nav || !burger) return;
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню');
    document.body.style.overflow = '';
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
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
        // блокируем прокрутку под раскрытым меню только на мобильных
        if (window.innerWidth < 1024) document.body.style.overflow = 'hidden';
      }
    });

    // Клик по пункту меню закрывает панель
    nav.addEventListener('click', function (event) {
      var link = event.target.closest('a');
      if (link) {
        closeMenu();
      }
    });

    // Escape закрывает меню и возвращает фокус на кнопку
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        burger.focus();
      }
    });

    // При переходе на десктопную ширину меню всегда открыто
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024) closeMenu();
    });
  }

  /* ------------------------------------------------------------------ *
   * 2. ТЕНЬ ШАПКИ ПРИ ПРОКРУТКЕ
   * ------------------------------------------------------------------ */
  var header = document.querySelector('.site-header');

  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }

  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ------------------------------------------------------------------ *
   * 3. АНИМАЦИИ ПОЯВЛЕНИЯ (IntersectionObserver, класс .reveal)
   * ------------------------------------------------------------------ */
  var revealTargets = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (!('IntersectionObserver' in window) || reduceMotion) {
    // Без поддержки или при уменьшенной анимации — показываем сразу
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach(function (el) { revealObserver.observe(el); });

    // Каскадная задержка для карточек/шагов внутри секции
    document.querySelectorAll('.cards, .steps, .review-grid, .gallery-grid').forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, index) {
        child.style.transitionDelay = Math.min(index * 90, 450) + 'ms';
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * 4. АККОРДЕОН FAQ
   *   Открытая панель измеряется по scrollHeight, чтобы анимация высоты
   *   была плавной. Одновременно открыт только один вопрос.
   * ------------------------------------------------------------------ */
  var accordion = document.getElementById('accordion');

  if (accordion) {
    var items = Array.prototype.slice.call(accordion.querySelectorAll('.acc-item'));

    function setPanelState(item, open) {
      var trigger = item.querySelector('.acc-trigger');
      var panel = item.querySelector('.acc-panel');
      if (!trigger || !panel) return;

      item.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));

      if (open) {
        panel.style.height = panel.scrollHeight + 'px';
      } else {
        panel.style.height = '0px';
      }
    }

    items.forEach(function (item) {
      var trigger = item.querySelector('.acc-trigger');
      var panel = item.querySelector('.acc-panel');
      if (!trigger || !panel) return;

      setPanelState(item, false);

      trigger.addEventListener('click', function () {
        var willOpen = trigger.getAttribute('aria-expanded') !== 'true';

        // Закрываем остальные (режим «одна открытая секция»)
        items.forEach(function (other) {
          if (other !== item) setPanelState(other, false);
        });

        setPanelState(item, willOpen);
      });
    });

    // Пересчёт высоты открытой панели при смене размера окна
    window.addEventListener('resize', function () {
      items.forEach(function (item) {
        if (item.classList.contains('is-open')) {
          var panel = item.querySelector('.acc-panel');
          if (panel) panel.style.height = panel.scrollHeight + 'px';
        }
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * 5. ФОРМА ЗАКАЗА — клиентская валидация + JS-заглушка отправки
   *   Бэкенда нет: вместо реального запроса показываем alert.
   *   Чтобы подключить отправку — замените содержимое showSuccess()
   *   на fetch('/api/order', { method: 'POST', body: new FormData(form) }).
   * ------------------------------------------------------------------ */
  var form = document.getElementById('order-form');

  if (form) {
    var EMAIL_LIKE = /^[^@\s]+$/; // для телефона используем цифры, не email

    function fieldWrap(input) {
      return input.closest('.field');
    }

    function showError(input, message) {
      var wrap = fieldWrap(input);
      if (!wrap) return;
      var msg = wrap.querySelector('.field-error');
      wrap.classList.add('has-error');
      input.setAttribute('aria-invalid', 'true');
      if (msg) {
        if (message) msg.textContent = message;
        msg.hidden = false;
      }
    }

    function clearError(input) {
      var wrap = fieldWrap(input);
      if (!wrap) return;
      var msg = wrap.querySelector('.field-error');
      wrap.classList.remove('has-error');
      input.removeAttribute('aria-invalid');
      if (msg) msg.hidden = true;
    }

    function digits(value) {
      return (value || '').replace(/\D/g, '');
    }

    function validateField(input) {
      var value = (input.value || '').trim();

      if (input.hasAttribute('required') && !value) {
        showError(input, 'Это поле нужно заполнить.');
        return false;
      }

      if (input.type === 'tel') {
        var d = digits(value);
        if (d.length < 10) {
          showError(input, 'Введите номер телефона полностью, например +7 (999) 000-00-00.');
          return false;
        }
      }

      if (input.type === 'date' && value) {
        var chosen = new Date(value + 'T00:00:00');
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        if (isNaN(chosen.getTime())) {
          showError(input, 'Некорректная дата.');
          return false;
        }
        if (chosen < today) {
          showError(input, 'Дата праздника уже прошла — выберите будущую дату.');
          return false;
        }
      }

      if (input.name === 'name' && value.length < 2) {
        showError(input, 'Имя должно быть не короче 2 символов.');
        return false;
      }

      clearError(input);
      return true;
    }

    var inputs = Array.prototype.slice.call(form.querySelectorAll('input, select, textarea'));

    inputs.forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        if (fieldWrap(input) && fieldWrap(input).classList.contains('has-error')) {
          validateField(input);
        }
      });
    });

    // Лёгкая маска телефона: при вводе цифр форматируем в +7 (___) ___-__-__
    var phone = form.querySelector('#f-phone');
    if (phone) {
      phone.addEventListener('input', function () {
        var d = digits(phone.value);
        if (!d) { phone.value = ''; return; }
        if (d.charAt(0) === '8') d = '7' + d.slice(1);
        if (d.charAt(0) !== '7') d = '7' + d;
        d = d.slice(0, 11);

        var out = '+7';
        if (d.length > 1) out += ' (' + d.slice(1, 4);
        if (d.length >= 5) out += ') ' + d.slice(4, 7);
        if (d.length >= 8) out += '-' + d.slice(7, 9);
        if (d.length >= 10) out += '-' + d.slice(9, 11);
        phone.value = out;
      });
    }

    // Минимальная дата = сегодня
    var dateInput = form.querySelector('#f-date');
    if (dateInput) {
      var now = new Date();
      var iso = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0');
      dateInput.min = iso;
    }

    function showSuccess(data) {
      /* ---- ЗАГЛУШКА: сообщаем пользователю, что это демо ---- */
      var lines = [
        'Заявка отправлена (демо)',
        '',
        'Имя: ' + data.name,
        'Телефон: ' + data.phone,
        'Дата праздника: ' + data.date,
        'Тип изделия: ' + data.type
      ];
      if (data.comment) lines.push('Комментарий: ' + data.comment);
      lines.push('', 'Настоящая отправка не настроена — замените обработчик в script.js.');
      window.alert(lines.join('\n'));
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var firstInvalid = null;
      var allValid = true;

      inputs.forEach(function (input) {
        var ok = validateField(input);
        if (!ok) {
          allValid = false;
          if (!firstInvalid) firstInvalid = input;
        }
      });

      if (!allValid) {
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
        }
        window.alert('Проверьте выделенные поля — не всё заполнено.');
        return;
      }

      var payload = {
        name: (form.querySelector('#f-name').value || '').trim(),
        phone: (form.querySelector('#f-phone').value || '').trim(),
        date: (form.querySelector('#f-date').value || '').trim(),
        type: (form.querySelector('#f-type').value || '').trim(),
        comment: (form.querySelector('#f-comment').value || '').trim()
      };

      showSuccess(payload);
      form.reset();
      inputs.forEach(clearError);
    });
  }

  /* ------------------------------------------------------------------ *
   * 6. ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ + ГОД В ФУТЕРЕ
   * ------------------------------------------------------------------ */
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('main section[id]')
  );
  var menuLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-link[href^="#"]')
  );

  if ('IntersectionObserver' in window && sections.length && menuLinks.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        menuLinks.forEach(function (link) {
          var active = link.getAttribute('href') === '#' + id;
          link.classList.toggle('is-active', active);
          if (active) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { spy.observe(section); });
  }

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Пункт EMAIL_LIKE объявлен для порядка чтения, используется в валидации при необходимости
  void EMAIL_LIKE;
})();
