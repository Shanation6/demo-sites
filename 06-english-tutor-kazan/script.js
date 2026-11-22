/* =========================================================================
   Английский с Ренатой — интерактив
   1) Бургер-меню (мобильная навигация)
   2) Тень шапки при прокрутке
   3) Аккордеон FAQ
   4) Появление блоков через IntersectionObserver (.reveal)
   5) Форма записи — JS-заглушка (без бэкенда)
   6) Текущий год в футере
   ========================================================================= */
(function () {
  "use strict";

  /* ---------- 1. Бургер-меню ---------- */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("main-nav");

  function closeMenu() {
    if (!nav) return;
    nav.classList.remove("is-open");
    if (burger) {
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Открыть меню");
    }
  }

  if (burger && nav) {
    burger.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(isOpen));
      burger.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
    });

    // Закрываем меню при клике по ссылке-якорю
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Закрываем по Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    // При переходе на десктоп сбрасываем состояние
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024) closeMenu();
    });
  }

  /* ---------- 2. Тень шапки при прокрутке ---------- */
  const header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Аккордеон FAQ ---------- */
  const triggers = document.querySelectorAll(".acc-trigger");
  triggers.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const item = btn.closest(".acc-item");
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      const isOpen = btn.getAttribute("aria-expanded") === "true";

      // Закрыть все остальные (режим «одна открыта за раз»)
      triggers.forEach(function (other) {
        if (other === btn) return;
        other.setAttribute("aria-expanded", "false");
        const oItem = other.closest(".acc-item");
        const oPanel = document.getElementById(other.getAttribute("aria-controls"));
        if (oItem) oItem.classList.remove("is-open");
        if (oPanel) oPanel.hidden = true;
      });

      // Переключить текущий
      btn.setAttribute("aria-expanded", String(!isOpen));
      if (item) item.classList.toggle("is-open", !isOpen);
      if (panel) panel.hidden = isOpen;
    });
  });

  /* ---------- 4. Появление блоков (.reveal) ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // Фолбэк для старых браузеров — показать всё сразу
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- 5. Форма записи (демо-заглушка) ---------- */
  const form = document.getElementById("enroll-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Простая клиентская валидка обязательных полей
      let valid = true;
      ["name", "phone", "level"].forEach(function (id) {
        const field = document.getElementById(id);
        if (!field) return;
        const wrap = field.closest(".field");
        const empty = !field.value || field.value.trim() === "";
        if (wrap) wrap.classList.toggle("invalid", empty);
        if (empty) valid = false;
      });

      if (!valid) {
        alert("Пожалуйста, заполните имя, телефон и уровень.");
        return;
      }

      // Здесь в боевой версии был бы fetch() на сервер/CRM.
      // Для демо — просто уведомление.
      alert("Заявка отправлена (демо)");
      form.reset();
    });

    // Убираем подсветку ошибки при вводе
    form.querySelectorAll("input, select").forEach(function (el) {
      el.addEventListener("input", function () {
        const wrap = el.closest(".field");
        if (wrap) wrap.classList.remove("invalid");
      });
    });
  }

  /* ---------- 6. Текущий год в футере ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
