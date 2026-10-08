/* VYRE.MN - shared Steam login helper */
let VYRE_USER = null;

function steamLogin() {
    location.href = VYRE_USER ? "/api/auth/logout" : "/api/auth/steam";
}

(async function () {
    try {
        const me = await fetch("/api/auth/me").then(r => r.json());
        VYRE_USER = me.loggedIn ? me.user : null;
    } catch (e) { VYRE_USER = null; }
    if (!VYRE_USER) return;
    const label = "LOGOUT";
    document.querySelectorAll(".steam-login, .top-steam").forEach(b => {
        const t = b.querySelector(".steam-label");
        if (t) t.textContent = label;
        else b.lastChild.textContent = " " + label;
    });
})();
