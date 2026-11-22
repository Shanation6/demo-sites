/* =========================================================
   PAKULOV TATTOO — интерактив
   1) Бургер-меню      2) Reveal-анимации (IntersectionObserver)
   3) FAQ-аккордеон    4) Заглушка формы записи (alert)
   5) Подсветка активного пункта меню + год в футере
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 1. БУРГЕР-МЕНЮ ---------- */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("mainNav");

  function closeMenu() {
    if (!nav || !burger) return;
    nav.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Открыть меню");
  }

  if (burger && nav) {
    burger.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("is-open");
      burger.classList.toggle("is-open", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
      burger.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
    });

    // Закрываем меню при клике по ссылке (якорь)
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

  /* ---------- 2. REVEAL-АНИМАЦИИ ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target); // анимируем один раз
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // Фолбэк для старых браузеров — сразу показываем
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- 3. FAQ-АККОРДЕОН ---------- */
  const triggers = document.querySelectorAll(".acc-trigger");
  triggers.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const item = btn.closest(".acc-item");
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      const isOpen = item.classList.contains("open");

      // Закрываем остальные (одиночное раскрытие)
      document.querySelectorAll(".acc-item.open").forEach(function (other) {
        if (other !== item) {
          other.classList.remove("open");
          const oBtn = other.querySelector(".acc-trigger");
          const oPanel = other.querySelector(".acc-panel");
          if (oBtn) oBtn.setAttribute("aria-expanded", "false");
          if (oPanel) oPanel.hidden = true;
        }
      });

      // Переключаем текущий
      item.classList.toggle("open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
      if (panel) panel.hidden = isOpen;
    });
  });

  /* ---------- 4. ФОРМА ЗАПИСИ (заглушка, без бэкенда) ---------- */
  const form = document.getElementById("bookingForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = form.name.value.trim();
      const phone = form.phone.value.trim();

      // Простейшая клиентская валидация обязательных полей
      if (!name || !phone) {
        alert("Пожалуйста, заполните имя и телефон.");
        (name ? form.phone : form.name).focus();
        return;
      }

      // ДЕМОНСТРАЦИЯ: данные никуда не отправляются.
      // Здесь можно подключить отправку на сервер / в Telegram-бот / на почту.
      alert("Заявка отправлена (демо)");
      form.reset();
    });
  }

  /* ---------- 5. ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ ПРИ СКРОЛЛЕ ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-list a[href^='#']");
  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    const map = {};
    navLinks.forEach(function (l) { map[l.getAttribute("href").slice(1)] = l; });

    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.style.color = ""; });
          const active = map[entry.target.id];
          if (active) active.style.color = "#fff";
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- 6. ТЕКУЩИЙ ГОД В ФУТЕРЕ ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
