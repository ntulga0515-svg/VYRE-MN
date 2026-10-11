/* VYRE.MN v3: per-card cursor spotlight + scroll progress fallback */
(function () {
  var bar = document.createElement("div"); bar.className = "v27-prog"; document.body.appendChild(bar);
  if (!CSS.supports("animation-timeline:scroll()")) {
    addEventListener("scroll", function () {
      var h = document.documentElement; bar.style.transform = "scaleX(" + (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) + ")";
    }, { passive: true });
  }
  if (!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
  document.addEventListener("pointermove", function (e) {
    var c = e.target.closest && e.target.closest(".feature-card,.srv-card,.clan-card,.skin-card,.wcard");
    if (!c) return;
    var r = c.getBoundingClientRect();
    c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px");
  }, { passive: true });
})();
