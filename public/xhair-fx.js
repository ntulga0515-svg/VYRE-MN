/* VYRE.MN — crosshair grows and turns blue when the cursor is over a button or link */
(function () {
  var hero = document.getElementById("hero");
  if (!hero || !matchMedia("(hover:hover) and (pointer:fine)").matches) return;
  function xh() { return document.querySelector(".xhair"); }
  hero.addEventListener("pointerover", function (e) {
    var el = xh(); if (!el) return;
    el.classList.toggle("lock", !!e.target.closest("a,button"));
  });
  hero.addEventListener("pointerleave", function () { var el = xh(); if (el) el.classList.remove("lock"); });
})();
