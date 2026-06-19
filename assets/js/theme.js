(function () {
  var KEY = "soar-theme"; // stored value: "light" | "dark" | "auto" (missing = auto)

  function pref() {
    try {
      var v = localStorage.getItem(KEY);
      return (v === "light" || v === "dark") ? v : "auto";
    } catch (e) { return "auto"; }
  }

  // 1) Apply the saved choice immediately (runs in <head>, before paint — no flash).
  //    "auto" => no data-theme attribute, so the CSS prefers-color-scheme media query
  //    decides, i.e. the page follows the visitor's computer / phone setting by default.
  function apply(p) {
    if (p === "light" || p === "dark") {
      document.documentElement.setAttribute("data-theme", p);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }
  apply(pref());

  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  // "Auto" = follow device: a monitor/display icon.
  var AUTO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>';

  function deviceIsDark() {
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  // Cycle order: auto -> light -> dark -> auto
  var NEXT = { auto: "light", light: "dark", dark: "auto" };

  function paintToggle(btn) {
    var p = pref();
    var icon, label;
    if (p === "auto") {
      icon = AUTO;
      label = "Theme: Auto — matches your device (" + (deviceIsDark() ? "dark" : "light") + "). Click for light.";
    } else if (p === "light") {
      icon = SUN;
      label = "Theme: Light. Click for dark.";
    } else {
      icon = MOON;
      label = "Theme: Dark. Click for auto.";
    }
    btn.innerHTML = icon;
    btn.setAttribute("aria-label", label);
    btn.setAttribute("title", label);
  }

  function initToggle() {
    var nav = document.querySelector(".site-nav");
    if (!nav || nav.querySelector(".theme-toggle")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    paintToggle(btn);
    btn.addEventListener("click", function () {
      var next = NEXT[pref()];
      try { localStorage.setItem(KEY, next); } catch (e) {}
      apply(next);
      paintToggle(btn);
    });
    nav.appendChild(btn);

    // Live-update when the device theme changes while in Auto mode.
    if (window.matchMedia) {
      var mq = window.matchMedia("(prefers-color-scheme: dark)");
      var onChange = function () { if (pref() === "auto") paintToggle(btn); };
      if (mq.addEventListener) mq.addEventListener("change", onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  // 2) Back-to-top button (appears after scrolling down).
  function initToTop() {
    if (document.querySelector(".to-top")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "to-top";
    btn.setAttribute("aria-label", "Back to top");
    btn.setAttribute("title", "Back to top");
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    document.body.appendChild(btn);
    function onScroll() {
      if (window.scrollY > 400) btn.classList.add("show");
      else btn.classList.remove("show");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // 3) Mobile hamburger menu.
  function initHamburger() {
    var header = document.querySelector(".site-header");
    var wrap = header && header.querySelector(".wrap");
    if (!wrap || wrap.querySelector(".nav-toggle")) return;
    var nav = wrap.querySelector(".site-nav");
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "nav-toggle";
    btn.setAttribute("aria-label", "Menu");
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    btn.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    wrap.insertBefore(btn, nav);
    if (nav) nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") header.classList.remove("nav-open");
    });
  }

  function init() { initToggle(); initHamburger(); initToTop(); }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
