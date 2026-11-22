/* =========================================================
   Юлия — финансовый юрист · demo landing
   Vanilla JS: бургер-меню, scroll-reveal, FAQ-аккордеон, форма
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Текущий год в футере ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Бургер-меню ---------- */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");

  function closeMenu() {
    if (!nav || !burger) return;
    nav.classList.remove("is-open");
    burger.classList.remove("is-active");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (burger && nav) {
    burger.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      burger.classList.toggle("is-active", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
      // блокируем прокрутку только когда меню открыто на мобильных
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // закрытие при клике по ссылке навигации
    nav.addEventListener("click", function (e) {
      if (e.target.closest(".nav-link")) closeMenu();
    });

    // закрытие по Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    // сброс состояния при возврате на десктоп
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768) closeMenu();
    });
  }

  /* ---------- Scroll-reveal через IntersectionObserver ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // fallback для старых браузеров — показать всё сразу
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- FAQ-аккордеон ---------- */
  var accItems = document.querySelectorAll(".acc-item");

  accItems.forEach(function (item) {
    var head = item.querySelector(".acc-head");
    var body = item.querySelector(".acc-body");
    if (!head || !body) return;

    head.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");

      // закрываем остальные (режим одного открытого пункта)
      accItems.forEach(function (other) {
        if (other !== item && other.classList.contains("is-open")) {
          other.classList.remove("is-open");
          var ob = other.querySelector(".acc-body");
          var oh = other.querySelector(".acc-head");
          if (ob) ob.style.maxHeight = null;
          if (oh) oh.setAttribute("aria-expanded", "false");
        }
      });

      if (isOpen) {
        item.classList.remove("is-open");
        body.style.maxHeight = null;
        head.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("is-open");
        body.style.maxHeight = body.scrollHeight + "px";
        head.setAttribute("aria-expanded", "true");
      }
    });
  });

  // пересчёт высоты открытой панели при ресайзе
  window.addEventListener("resize", function () {
    document.querySelectorAll(".acc-item.is-open .acc-body").forEach(function (b) {
      b.style.maxHeight = b.scrollHeight + "px";
    });
  });

  /* ---------- Обработка формы заявки ---------- */
  var form = document.getElementById("lead-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.elements["name"].value.trim();
      var contact = form.elements["contact"].value.trim();
      var message = form.elements["message"].value.trim();

      if (!name || !contact || !message) {
        alert("Пожалуйста, заполните все поля.");
        return;
      }

      alert("Заявка отправлена (демо)");
      form.reset();
    });
  }
})();
