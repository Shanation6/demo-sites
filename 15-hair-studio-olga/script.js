/* ============================================================
   Ольга Семыкина — интерактив (vanilla JS)
   Бургер-меню · Scroll-reveal · FAQ-аккордеон · Форма заявки
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Бургер-меню ---------- */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  function closeMenu() {
    burger.classList.remove("is-open");
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }

  if (burger && nav) {
    burger.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open");
      burger.classList.toggle("is-open", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
    });

    // Закрытие при клике на пункт меню
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Закрытие по Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Scroll-reveal через IntersectionObserver ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Фолбэк для старых браузеров — показать всё сразу
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- FAQ-аккордеон ---------- */
  const accItems = document.querySelectorAll(".acc-item");

  accItems.forEach(function (item) {
    const head = item.querySelector(".acc-head");
    const body = item.querySelector(".acc-body");
    if (!head || !body) return;

    head.addEventListener("click", function () {
      const isOpen = item.classList.contains("is-open");

      // Закрываем остальные (одиночное раскрытие)
      accItems.forEach(function (other) {
        other.classList.remove("is-open");
        const ob = other.querySelector(".acc-body");
        const oh = other.querySelector(".acc-head");
        if (ob) ob.style.maxHeight = null;
        if (oh) oh.setAttribute("aria-expanded", "false");
      });

      // Открываем текущий, если он был закрыт
      if (!isOpen) {
        item.classList.add("is-open");
        body.style.maxHeight = body.scrollHeight + "px";
        head.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Обработчик формы заявки ---------- */
  const form = document.getElementById("leadForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = form.name.value.trim();
      const contactInfo = form.contactInfo.value.trim();

      if (!name || !contactInfo) {
        alert("Пожалуйста, заполните имя и контакт для связи.");
        return;
      }

      alert("Заявка отправлена (демо)");
      form.reset();
    });
  }

  /* ---------- Текущий год в футере ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
