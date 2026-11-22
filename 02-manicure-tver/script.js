/* =========================================================
   Интерактив сайта-визитки мастера маникюра
   - Бургер-меню (мобильная навигация)
   - Аккордеон FAQ
   - Анимация появления блоков (.reveal) через IntersectionObserver
   - Форма записи (демо-заглушка, без бэкенда)
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 1. БУРГЕР-МЕНЮ ---------- */
  const burger = document.getElementById('burger');
  const nav    = document.getElementById('mainNav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(isOpen));
      burger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    });

    // Закрываем меню после выбора пункта (плавный скролл к якорю)
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Открыть меню');
      });
    });

    // Esc закрывает меню
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
      }
    });
  }

  /* ---------- 2. АККОРДЕОН FAQ ---------- */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const answer   = document.getElementById(btn.getAttribute('aria-controls'));

      // Опционально: закрываем остальные, чтобы был один открытый вопрос.
      // Чтобы разрешить несколько открытых сразу — удалите этот блок.
      document.querySelectorAll('.faq-q').forEach(function (other) {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const a = document.getElementById(other.getAttribute('aria-controls'));
          if (a) a.style.maxHeight = null;
        }
      });

      btn.setAttribute('aria-expanded', String(!expanded));
      if (answer) {
        answer.style.maxHeight = !expanded ? answer.scrollHeight + 'px' : null;
      }
    });
  });

  /* ---------- 3. АНИМАЦИЯ ПОЯВЛЕНИЯ (.reveal) ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target); // анимируем один раз
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // Фолбэк для старых браузеров — показываем всё сразу
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- 4. ФОРМА ЗАПИСИ (демо, без бэкенда) ---------- */
  const form = document.getElementById('bookingForm');

  if (form) {
    // Минимальная дата = сегодня (чтобы нельзя было выбрать прошедший день)
    const dateInput = form.querySelector('#date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault(); // отключаем реальную отправку — это демо

      // Простая проверка обязательных полей
      let valid = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        if (!field.value.trim()) {
          field.classList.add('invalid');
          valid = false;
        } else {
          field.classList.remove('invalid');
        }
      });

      if (!valid) {
        alert('Пожалуйста, заполните все поля формы.');
        return;
      }

      // Демонстрационное подтверждение (здесь можно подключить реальную отправку)
      alert('Запись принята (демо). Спасибо! Ирина свяжется с вами для подтверждения.');
      form.reset();
    });

    // Снимаем подсветку ошибки при вводе
    form.querySelectorAll('input, select').forEach(function (field) {
      field.addEventListener('input', function () {
        field.classList.remove('invalid');
      });
    });
  }

  /* ---------- 5. Текущий год в футере ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
