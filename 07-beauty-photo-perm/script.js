/* ==========================================================================
   script.js — интерактив сайта фотографа (демо, без бэкенда)
   1. Бургер-меню
   2. Тень шапки при скролле
   3. Плавные появления блоков (.reveal) через IntersectionObserver
   4. Аккордеон FAQ
   5. Форма бронирования — JS-заглушка (alert)
   ========================================================================== */

'use strict';

/* ---------- 1. Бургер-меню ---------- */
const burger = document.getElementById('burgerBtn');
const nav = document.getElementById('mainNav');

function closeMenu() {
  nav.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Открыть меню');
}

function toggleMenu() {
  const open = nav.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
}

if (burger && nav) {
  burger.addEventListener('click', toggleMenu);

  // Закрываем меню после перехода по якорю (мобильная версия)
  nav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // И по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMenu();
      burger.focus();
    }
  });
}

/* ---------- 2. Тень у шапки при прокрутке ---------- */
const header = document.querySelector('.site-header');

function onScrollHeader() {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 10);
}

window.addEventListener('scroll', onScrollHeader, { passive: true });
onScrollHeader();

/* ---------- 3. Появление блоков при скролле (IntersectionObserver) ---------- */
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        // лёгкий каскад (stagger) для соседних элементов
        entry.target.style.transitionDelay = `${Math.min(i * 80, 240)}ms`;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
} else {
  // Фallback для старых браузеров — показываем всё сразу
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

/* ---------- 4. Аккордеон FAQ ---------- */
document.querySelectorAll('.acc-trigger').forEach((btn) => {
  const panel = document.getElementById(btn.getAttribute('aria-controls'));
  if (!panel) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    // Закрываем остальные пункты (одиночное раскрытие)
    document.querySelectorAll('.acc-trigger').forEach((other) => {
      if (other === btn) return;
      other.setAttribute('aria-expanded', 'false');
      const otherPanel = document.getElementById(other.getAttribute('aria-controls'));
      if (otherPanel) otherPanel.classList.remove('is-open');
    });

    btn.setAttribute('aria-expanded', String(!isOpen));
    panel.classList.toggle('is-open', !isOpen);
  });
});

/* ---------- 5. Форма бронирования (демо-заглушка) ---------- */
/* Здесь нет бэкенда: заявка не отправляется никуда, имитируем успех alert.
   Для боевого сайта подключите отправку на свой сервис (Telegram-бот, e-mail и т.п.). */
const form = document.getElementById('bookingForm');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.elements.name;
    const phone = form.elements.phone;
    let valid = true;

    // Простая клиентская валидация обязательных полей
    [name, phone].forEach((input) => {
      input.classList.remove('invalid');
      if (!input.value.trim()) {
        input.classList.add('invalid');
        valid = false;
      }
    });

    if (!valid) {
      alert('Пожалуйста, заполните имя и телефон.');
      (form.elements.name.value.trim() ? phone : name).focus();
      return;
    }

    const date = form.elements.date.value || 'дату уточним';
    const typeText = form.elements.type.selectedOptions[0]?.textContent ?? '';

    // Демо-уведомление вместо реальной отправки
    alert(
      `Заявка отправлена (демо)\n\n` +
      `Имя: ${name.value.trim()}\n` +
      `Телефон: ${phone.value.trim()}\n` +
      `Тип съёмки: ${typeText}\n` +
      `Дата: ${date}\n\n` +
      `Свяжусь с вами в течение дня!`
    );

    form.reset();
  });
}

/* Кнопки пакетов подставляют тип съёмки в форму при переходе к ней */
document.querySelectorAll('[data-service]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const select = document.getElementById('fType');
    if (select) select.value = btn.dataset.service;
  });
});

/* ---------- Текущий год в футере ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
