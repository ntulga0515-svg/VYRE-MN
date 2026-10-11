/* VYRE.MN 2026: smooth cursor orb + heading scramble */
(function () {
  var reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  if (!reduce && matchMedia("(hover:hover) and (pointer:fine)").matches) {
    var orb = document.createElement("div"); orb.className = "v26-orb"; document.body.appendChild(orb);
    var x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;
    addEventListener("pointermove", function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function loop() { x += (tx - x) * .08; y += (ty - y) * .08; orb.style.transform = "translate(" + x + "px," + y + "px)"; requestAnimationFrame(loop); })();
  }
  if (reduce) return;
  var G = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/<>";
  document.querySelectorAll("main h1, .page-header h1, .skin-header h1, .srv-head h1").forEach(function (h) {
    if (h.children.length) return;
    var t = h.textContent, n = 0;
    var id = setInterval(function () {
      h.textContent = t.split("").map(function (c, i) { return c === " " || i < n ? c : G[Math.random() * G.length | 0]; }).join("");
      if ((n += .6) >= t.length) { h.textContent = t; clearInterval(id); }
    }, 28);
  });
})();
