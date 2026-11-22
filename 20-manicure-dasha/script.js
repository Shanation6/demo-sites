// Даша — мастер маникюра: scroll-reveal, аккордеон FAQ, форма заявки.
(function () {
  'use strict';

  // ---------- Текущий год в футере ----------
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Scroll reveal через IntersectionObserver ----------
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    // Лёгкая каскадная задержка для элементов внутри одной секции.
    var groups = new Map();

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;
        var section = el.closest('section') || document.body;
        var index = groups.get(section) || 0;
        groups.set(section, index + 1);

        el.style.transitionDelay = Math.min(index * 90, 360) + 'ms';
        el.classList.add('is-visible');

        // После анимации задержку убираем, чтобы hover-переходы не тормозили.
        setTimeout(function () { el.style.transitionDelay = ''; }, 1000);
        observer.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  // ---------- Аккордеон FAQ ----------
  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.faq-item'));

  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      // Закрываем остальные, чтобы одновременно был открыт один вопрос.
      faqItems.forEach(function (other) {
        other.classList.remove('open');
        var otherBtn = other.querySelector('.faq-q');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ---------- Форма заявки ----------
  var form = document.getElementById('booking-form');

  if (form) {
    var requiredFields = ['.name', '.contact'];

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var nameInput = form.elements.name;
      var contactInput = form.elements.contact;
      var invalid = null;

      [nameInput, contactInput].forEach(function (input) {
        input.classList.remove('invalid');
      });

      if (!nameInput.value.trim()) {
        nameInput.classList.add('invalid');
        invalid = invalid || nameInput;
      }

      if (!contactInput.value.trim()) {
        contactInput.classList.add('invalid');
        invalid = invalid || contactInput;
      }

      if (invalid) {
        invalid.focus();
        return;
      }

      alert('Заявка отправлена (демо)');

      form.reset();
      nameInput.classList.remove('invalid');
      contactInput.classList.remove('invalid');
    });

    // Убираем подсветку ошибки при вводе.
    Array.prototype.slice.call(form.querySelectorAll('input')).forEach(function (input) {
      input.addEventListener('input', function () {
        input.classList.remove('invalid');
      });
    });
  }
})();
