/* VYRE.MN — sidebar menu cursor effects: gliding highlight + cursor spotlight + magnetic pull */
(function () {
  var nav = document.querySelector(".sidebar nav");
  if (!nav || !matchMedia("(hover:hover) and (pointer:fine)").matches) return;
  var reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  var glider = document.createElement("div");
  glider.className = "nav-glider";
  glider.setAttribute("aria-hidden", "true");
  nav.insertBefore(glider, nav.firstChild);

  function moveTo(a) {
    glider.style.height = a.offsetHeight + "px";
    glider.style.transform = "translateY(" + a.offsetTop + "px)";
    nav.classList.add("glide");
  }
  nav.querySelectorAll(".nav-item").forEach(function (a) {
    a.addEventListener("pointerenter", function () { moveTo(a); });
    a.addEventListener("pointermove", function (e) {
      var r = a.getBoundingClientRect();
      a.style.setProperty("--mx", (e.clientX - r.left) + "px");
      a.style.setProperty("--my", (e.clientY - r.top) + "px");
      if (!reduce) {
        var dx = ((e.clientX - r.left) / r.width - 0.5) * 8;
        a.style.transform = "translateX(" + (4 + dx) + "px)";
      }
    });
    a.addEventListener("pointerleave", function () { a.style.transform = ""; });
  });
  nav.addEventListener("pointerleave", function () { nav.classList.remove("glide"); });
})();
