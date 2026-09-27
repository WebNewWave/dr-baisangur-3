/* ============================================================
   Концепт 3 — Smile Story SPA
   Чистый JS: hash-роутер, прогресс, мобильное меню,
   появления при скролле (ken-burns реализован в CSS).
   ============================================================ */
(function () {
  "use strict";

  var views = Array.prototype.slice.call(document.querySelectorAll(".view"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".site-nav a[data-link]"));
  var header = document.getElementById("siteHeader");
  var progress = document.querySelector(".scroll-progress");

  function nameFromHash() {
    var h = window.location.hash || "#/";
    var name = h.replace(/^#\/?/, "").split("?")[0];
    if (!name) return "hero";
    return name;
  }

  function highlightNav(name) {
    navLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-link") === name);
    });
  }

  function showView(name) {
    var target = null;
    views.forEach(function (v) {
      var match = v.getAttribute("data-view") === name;
      v.classList.toggle("is-active", match);
      if (match) target = v;
    });
    if (!target && views.length) {
      views[0].classList.add("is-active");
      name = views[0].getAttribute("data-view");
    }
    highlightNav(name);
    window.scrollTo({ top: 0, behavior: "auto" });
    observeReveals();
  }

  function navigate() { showView(nameFromHash()); }

  document.addEventListener("click", function (e) {
    var link = e.target.closest("a[data-link], a[href^='#/']");
    if (!link) return;
    closeNav();
  });

  window.addEventListener("popstate", navigate);
  window.addEventListener("hashchange", navigate);

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle("scrolled", y > 20);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? (y / h) * 100 : 0;
      progress.style.width = p + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  var toggle = document.querySelector(".nav-toggle");
  function closeNav() {
    if (toggle) { toggle.classList.remove("active"); toggle.setAttribute("aria-expanded", "false"); }
    var nav = document.querySelector(".site-nav");
    if (nav) nav.classList.remove("open");
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      var nav = document.querySelector(".site-nav");
      var open = nav.classList.toggle("open");
      toggle.classList.toggle("active", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var io = null;
  function observeReveals() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
      return;
    }
    if (io) io.disconnect();
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal:not(.in)").forEach(function (el) { io.observe(el); });
  }

  function tagReveals() {
    var groups = [".service-card", ".tech-row", ".advantage-item", ".myth-card", ".rec-item", ".story-block", ".about-photo", ".contact-aside", ".contact-cta", ".pull-quote"];
    groups.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el, i) {
        if (!el.classList.contains("reveal")) {
          el.classList.add("reveal");
          el.style.transitionDelay = Math.min(i * 60, 360) + "ms";
        }
      });
    });
  }

  function init() {
    tagReveals();
    onScroll();
    navigate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
