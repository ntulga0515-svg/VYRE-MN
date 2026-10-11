/* Set ENABLE to true ONLY after vyre.mn is connected in Render (Custom Domains) and works.
   Sends visitors from the old onrender.com address to vyre.mn. */
(function () {
  var ENABLE = false;
  if (ENABLE && /\.onrender\.com$/.test(location.hostname)) {
    location.replace("https://vyre-mn.onrender.com" + location.pathname + location.search + location.hash);
  }
})();
