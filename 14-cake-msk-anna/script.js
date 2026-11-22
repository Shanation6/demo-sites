// ===== Анна · cake — интерактив лендинга =====
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initBurger();
    initReveal();
    initAccordion();
    initForm();
    setYear();
  });

  // --- Бургер-меню ---
  function initBurger() {
    var burger = document.getElementById('burger');
    var nav = document.getElementById('mainNav');
    if (!burger || !nav) return;

    function closeMenu() {
      burger.classList.remove('open');
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Открыть меню');
    }

    burger.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      burger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    });

    // Закрытие при клике по ссылке навигации
    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Закрытие по Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // --- Плавные scroll-reveal анимации ---
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    // Если IntersectionObserver недоступен — просто показываем всё
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          // лёгкий каскад для соседних элементов
          var delay = (entry.target.dataset.stagger ? +entry.target.dataset.stagger : 0) + i * 70;
          entry.target.style.transitionDelay = Math.min(delay, 350) + 'ms';
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  // --- Аккордеон FAQ ---
  function initAccordion() {
    var heads = document.querySelectorAll('.acc-head');
    if (!heads.length) return;

    heads.forEach(function (head) {
      head.addEventListener('click', function () {
        var item = head.closest('.acc-item');
        var body = item.querySelector('.acc-body');
        var isActive = item.classList.contains('active');

        // закрываем остальные (один открытый за раз)
        document.querySelectorAll('.acc-item.active').forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove('active');
            openItem.querySelector('.acc-body').style.maxHeight = null;
            openItem.querySelector('.acc-head').setAttribute('aria-expanded', 'false');
          }
        });

        if (isActive) {
          item.classList.remove('active');
          body.style.maxHeight = null;
          head.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          body.style.maxHeight = body.scrollHeight + 'px';
          head.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // Пересчёт высоты открытого элемента при ресайзе
    window.addEventListener('resize', function () {
      var active = document.querySelector('.acc-item.active .acc-body');
      if (active) active.style.maxHeight = active.scrollHeight + 'px';
    });
  }

  // --- Форма заявки (демо) ---
  function initForm() {
    var form = document.getElementById('orderForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.name.value.trim();
      var contact = form.contact.value.trim();
      var wish = form.wish.value.trim();

      if (!name || !contact || !wish) {
        alert('Пожалуйста, заполните все поля заявки.');
        return;
      }

      alert('Заявка отправлена (демо)');
      form.reset();
    });
  }

  // --- Текущий год в футере ---
  function setYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }
})();
