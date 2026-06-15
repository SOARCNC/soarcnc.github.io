(function () {
  var zh = (document.documentElement.lang || "").indexOf("zh") === 0;
  var t = {
    copied:   zh ? "已複製：" : "Copied: ",
    askEmail: zh ? "已複製。要開啟郵件程式寄信給 " : "Copied. Open your email app to write to ",
    askPhone: zh ? "已複製。要現在撥打 " : "Copied. Call ",
    askMap:   zh ? "已複製。要在 Google 地圖開啟此地址嗎？" : "Copied. Open this address in Google Maps?",
    q:        zh ? "？" : "?"
  };

  function toast(msg) {
    var el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add("show"); });
    setTimeout(function () {
      el.classList.remove("show");
      setTimeout(function () { el.remove(); }, 250);
    }, 2200);
  }

  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      ta.remove();
      resolve();
    });
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-contact]");
    if (!btn || btn.disabled) return;
    var type = btn.getAttribute("data-contact");
    var val = btn.getAttribute("data-value");
    if (!val) return;

    copy(val).then(function () {
      toast(t.copied + val);
      if (type === "email") {
        if (confirm(t.askEmail + val + t.q)) window.location.href = "mailto:" + val;
      } else if (type === "phone") {
        if (confirm(t.askPhone + val + t.q)) window.location.href = "tel:" + val.replace(/\s+/g, "");
      } else if (type === "address") {
        if (confirm(t.askMap)) {
          window.open("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(val), "_blank");
        }
      }
    });
  });

  // Lead form (display-only preview): confirm receipt, store nothing yet.
  var form = document.getElementById("lead-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nameEl = form.querySelector('[name="first"]');
      var name = nameEl ? nameEl.value.trim() : "";
      var msg = zh
        ? ("謝謝" + (name ? "，" + name : "") + "！我們已收到您的訊息（預覽模式，尚未儲存）。")
        : ("Thanks" + (name ? ", " + name : "") + "! We received your message (preview — not stored yet).");
      toast(msg);
      form.reset();
    });
  }
})();
