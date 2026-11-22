/* ===== Lili Gerc — interactions ===== */
(function () {
  "use strict";

  /* ---- Текущий год в футере ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Тень/рамка шапки при скролле ---- */
  var header = document.querySelector(".site-header");
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 20);
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---- Бургер-меню ---- */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");

  function closeMenu() {
    if (!burger || !nav) return;
    burger.classList.remove("active");
    nav.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  }

  if (burger && nav) {
    burger.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      burger.classList.toggle("active", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
    });

    // Закрытие при клике по пункту меню
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Закрытие по Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---- Плавный скролл к якорям с учётом липкой шапки ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = this.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = 70; // высота шапки
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* ---- Scroll-reveal через IntersectionObserver ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // Фолбэк для старых браузеров — показать всё сразу
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---- FAQ аккордеон ---- */
  var accItems = document.querySelectorAll(".acc-item");
  accItems.forEach(function (item) {
    var head = item.querySelector(".acc-head");
    var body = item.querySelector(".acc-body");
    if (!head || !body) return;

    head.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");

      // Закрываем остальные (одиночное раскрытие)
      accItems.forEach(function (other) {
        other.classList.remove("open");
        var ob = other.querySelector(".acc-body");
        var oh = other.querySelector(".acc-head");
        if (ob) ob.style.maxHeight = null;
        if (oh) oh.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("open");
        body.style.maxHeight = body.scrollHeight + "px";
        head.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---- Обработчик формы заявки ---- */
  var form = document.getElementById("booking-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.elements["name"].value.trim();
      var contact = form.elements["contact"].value.trim();
      var type = form.elements["type"].value;

      if (!name || !contact || !type) {
        alert("Пожалуйста, заполните имя, контакт и тип съёмки.");
        return;
      }

      alert("Заявка отправлена (демо)");
      form.reset();
    });
  }
})();
