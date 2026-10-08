/* =========================================================
   VYRE.MN — FX LAYER
   Presentation only: mobile menu, scroll reveal, pointer glow,
   count-up numbers, hero crosshair, first-load list stagger.
   It never touches page data or API logic.
   ========================================================= */
(function () {
    "use strict";

    var doc = document;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var $ = function (s, r) { return (r || doc).querySelector(s); };
    var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };

    doc.documentElement.classList.add("js");

    /* ---------- tiny notice (non-blocking replacement for alert) ---------- */
    window.vyreNotify = function (msg, bad) {
        var t = $("#vyreNotify");
        if (!t) {
            t = doc.createElement("div");
            t.id = "vyreNotify";
            t.className = "vyre-toast";
            t.setAttribute("role", "status");
            doc.body.appendChild(t);
        }
        t.textContent = msg;
        t.classList.toggle("bad", !!bad);
        t.classList.add("show");
        clearTimeout(t._h);
        t._h = setTimeout(function () { t.classList.remove("show"); }, 2400);
    };

    /* ---------- mobile sidebar drawer ---------- */
    function initMenu() {
        var side = $("#sidebar");
        var btn = $("#menuToggle");
        if (!side) return;

        if (!btn) {
            /* pages without a topbar (steam login) get a floating button */
            btn = doc.createElement("button");
            btn.className = "menu-toggle";
            btn.id = "menuToggle";
            btn.type = "button";
            btn.setAttribute("aria-label", "Menu");
            btn.setAttribute("aria-controls", "sidebar");
            btn.setAttribute("aria-expanded", "false");
            btn.innerHTML = "<span></span><span></span><span></span>";
            btn.style.cssText = "position:fixed;left:16px;top:14px;z-index:950";
            doc.body.appendChild(btn);
        }

        var scrim = doc.createElement("div");
        scrim.className = "scrim";
        doc.body.appendChild(scrim);

        function set(open) {
            side.classList.toggle("open", open);
            scrim.classList.toggle("show", open);
            btn.setAttribute("aria-expanded", open ? "true" : "false");
            doc.body.style.overflow = open ? "hidden" : "";
        }
        btn.addEventListener("click", function () { set(!side.classList.contains("open")); });
        scrim.addEventListener("click", function () { set(false); });
        doc.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
        $$(".nav-item", side).forEach(function (a) { a.addEventListener("click", function () { set(false); }); });
        window.addEventListener("resize", function () { if (window.innerWidth > 980) set(false); });
    }

    /* ---------- pointer glow on cards ---------- */
    var GLOW = ".feature-card,.stat-card,.clan-card,.srv-card,.wcard,.skin-card,.profile-panel,.admin-card,.stat-box,.server-card";
    function initGlow() {
        if (!finePointer || reduce) return;
        var raf = 0, ev = null;
        doc.addEventListener("pointermove", function (e) {
            ev = e;
            if (raf) return;
            raf = requestAnimationFrame(function () {
                raf = 0;
                var el = ev.target.closest && ev.target.closest(GLOW);
                if (!el) return;
                var r = el.getBoundingClientRect();
                el.style.setProperty("--mx", (ev.clientX - r.left) + "px");
                el.style.setProperty("--my", (ev.clientY - r.top) + "px");
            });
        }, { passive: true });
    }

    /* ---------- scroll reveal (static blocks) ---------- */
    var REVEAL = ".section-head,.stats-grid,.feature-card,.page-header,.clan-actions,.skin-header,.srv-head," +
        ".profile-section,.admin-header,.admin-stats,.admin-card,.players-tools,.login-notice,.group-tabs,.steam-box";
    function initReveal() {
        var els = $$(REVEAL);
        if (reduce || !("IntersectionObserver" in window)) { return; }

        els.forEach(function (el, i) {
            el.classList.add("reveal");
            var sibs = el.parentElement ? $$(":scope > " + (el.classList.contains("feature-card") ? ".feature-card" : ".__none__"), el.parentElement) : [];
            var idx = sibs.indexOf(el);
            if (idx > 0) el.style.setProperty("--d", (idx * 0.09) + "s");
        });

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (!en.isIntersecting) return;
                var el = en.target;
                io.unobserve(el);
                el.classList.add("in");
                /* drop the helper classes afterwards so hover transforms work again */
                var delay = parseFloat(el.style.getPropertyValue("--d") || 0) * 1000;
                setTimeout(function () { el.classList.remove("reveal", "in"); }, 1000 + delay);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

        els.forEach(function (el) { io.observe(el); });
    }

    /* ---------- number count-up ---------- */
    function parseNum(txt) {
        var m = String(txt).trim().match(/^(\d+(?:\.\d+)?)(.*)$/);
        if (!m) return null;
        var dec = (m[1].split(".")[1] || "").length;
        var pad = (!dec && m[1].length > 1 && m[1][0] === "0") ? m[1].length : 0;
        return { n: parseFloat(m[1]), dec: dec, pad: pad, suf: m[2] };
    }
    function fmt(p, v) {
        var s = p.dec ? v.toFixed(p.dec) : String(Math.round(v));
        if (p.pad) while (s.length < p.pad) s = "0" + s;
        return s + p.suf;
    }
    function countUp(el, finalText) {
        var p = parseNum(finalText);
        if (!p || reduce || p.n === 0) { el._last = finalText; el.textContent = finalText; return; }
        var start = performance.now(), dur = 1200;
        cancelAnimationFrame(el._raf || 0);
        (function step(now) {
            var t = Math.min((now - start) / dur, 1);
            var e = 1 - Math.pow(1 - t, 4);
            var txt = t < 1 ? fmt(p, p.n * e) : finalText;
            el._last = txt;
            el.textContent = txt;
            if (t < 1) el._raf = requestAnimationFrame(step);
        })(start);
    }
    function initCounters() {
        /* static numbers on the home page: count when scrolled into view */
        var statics = $$(".stats-grid .stat-number");
        if (statics.length && "IntersectionObserver" in window && !reduce) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (en) {
                    if (!en.isIntersecting) return;
                    io.unobserve(en.target);
                    countUp(en.target, en.target._final);
                });
            }, { threshold: 0.4 });
            statics.forEach(function (el) {
                var p = parseNum(el.textContent);
                el._final = el.textContent.trim();
                if (p) { el.textContent = fmt(p, 0); el._last = el.textContent; }
                io.observe(el);
            });
        }

        /* numbers filled in later by page scripts (profile, admin): animate on change */
        var dyn = $$(".stat-value,.admin-stats .stat-number");
        dyn.forEach(function (el) {
            el._last = el.textContent;
            new MutationObserver(function () {
                var now = el.textContent;
                if (now === el._last) return;
                countUp(el, now.trim());
            }).observe(el, { childList: true, characterData: true, subtree: true });
        });
    }

    /* ---------- first-load stagger for async lists ---------- */
    var LISTS = ["srvGrid", "leaderboardBody", "playersBody", "clanGrid", "recentMatches",
        "weaponGrid", "skinGrid", "serversList", "playersTable"];
    function initStagger() {
        if (reduce) return;
        LISTS.forEach(function (id) {
            var box = doc.getElementById(id);
            if (!box) return;
            var seen = false;
            var mo = new MutationObserver(function () {
                if (seen || !box.children.length) return;
                var first = box.children[0];
                /* skip "Loading..." placeholders */
                if (first.className && /empty|srv-empty/.test(first.className) && box.children.length === 1) return;
                if (box.children.length === 1 && !first.className && /loading/i.test(box.textContent)) return;
                seen = true;
                $$(":scope > *", box).forEach(function (c, i) { c.style.setProperty("--i", Math.min(i, 24)); });
                box.classList.add("stagger-in");
                setTimeout(function () { box.classList.remove("stagger-in"); }, 1600);
                mo.disconnect();
            });
            mo.observe(box, { childList: true });
        });
    }

    /* ---------- hero crosshair ---------- */
    function initCrosshair() {
        var hero = $("#hero");
        if (!hero || !finePointer || reduce) return;
        var x = 0, y = 0, cx = 0, cy = 0, on = false, raf = 0;
        var el = doc.createElement("div");
        el.className = "xhair";
        doc.body.appendChild(el);

        function loop() {
            cx += (x - cx) * 0.2;
            cy += (y - cy) * 0.2;
            var t = "translate(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px)";
            el.style.transform = t;
            el.style.setProperty("--t", t);
            raf = on || Math.abs(x - cx) > 0.3 || Math.abs(y - cy) > 0.3 ? requestAnimationFrame(loop) : 0;
        }
        hero.addEventListener("pointermove", function (e) {
            x = e.clientX; y = e.clientY;
            if (!on) { on = true; cx = x; cy = y; el.classList.add("on"); }
            if (!raf) raf = requestAnimationFrame(loop);
        });
        hero.addEventListener("pointerleave", function () { on = false; el.classList.remove("on"); });
        hero.addEventListener("pointerdown", function () {
            el.classList.remove("hit"); void el.offsetWidth; el.classList.add("hit");
        });
    }

    /* ---------- wide tables scroll on small screens ---------- */
    function initTables() {
        $$("table.leaderboard-table,table.players-table").forEach(function (t) {
            if (t.parentElement && t.parentElement.classList.contains("table-scroll")) return;
            var w = doc.createElement("div");
            w.className = "table-scroll";
            t.parentNode.insertBefore(w, t);
            w.appendChild(t);
        });
    }


    /* =====================================================
       ROUND 2 — extra motion
       ===================================================== */

    /* ---------- constellation particles ---------- */
    function initParticles() {
        if (reduce) return;
        var cv = doc.createElement("canvas");
        cv.id = "fxCanvas";
        doc.body.appendChild(cv);
        var ctx = cv.getContext("2d");
        var W = 0, H = 0, dpr = 1, pts = [], visible = true, mx = -999, my = -999;

        function size() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            W = window.innerWidth; H = window.innerHeight;
            cv.width = W * dpr; cv.height = H * dpr;
            cv.style.width = W + "px"; cv.style.height = H + "px";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            var n = Math.max(24, Math.min(64, Math.round(W * H / 26000)));
            pts = [];
            for (var i = 0; i < n; i++) pts.push({
                x: Math.random() * W, y: Math.random() * H,
                vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22 - .05,
                r: Math.random() * 1.4 + .5, red: Math.random() < .55
            });
        }
        window.addEventListener("pointermove", function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
        doc.addEventListener("visibilitychange", function () { visible = !doc.hidden; });
        window.addEventListener("resize", size);
        size();

        var LINK = 130;
        (function frame() {
            if (visible) {
                ctx.clearRect(0, 0, W, H);
                for (var i = 0; i < pts.length; i++) {
                    var a = pts[i];
                    a.x += a.vx; a.y += a.vy;
                    if (a.x < -10) a.x = W + 10; if (a.x > W + 10) a.x = -10;
                    if (a.y < -10) a.y = H + 10; if (a.y > H + 10) a.y = -10;
                    var col = a.red ? "255,51,71" : "47,123,255";
                    ctx.beginPath();
                    ctx.fillStyle = "rgba(" + col + ",.75)";
                    ctx.arc(a.x, a.y, a.r, 0, 6.283);
                    ctx.fill();
                    for (var j = i + 1; j < pts.length; j++) {
                        var b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
                        if (d < LINK * LINK) {
                            ctx.strokeStyle = "rgba(" + col + "," + (0.16 * (1 - Math.sqrt(d) / LINK)).toFixed(3) + ")";
                            ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                        }
                    }
                    var mdx = a.x - mx, mdy = a.y - my, md = mdx * mdx + mdy * mdy;
                    if (md < 170 * 170) {
                        ctx.strokeStyle = "rgba(255,255,255," + (0.22 * (1 - Math.sqrt(md) / 170)).toFixed(3) + ")";
                        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mx, my); ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(frame);
        })();
    }

    /* ---------- cursor spotlight + scroll progress ---------- */
    function initSpotAndProgress() {
        if (!reduce) {
            var bar = doc.createElement("div");
            bar.className = "scroll-progress";
            doc.body.appendChild(bar);
            var tick = 0;
            var upd = function () {
                tick = 0;
                var max = doc.documentElement.scrollHeight - window.innerHeight;
                bar.style.setProperty("--p", max > 0 ? Math.min(window.scrollY / max, 1).toFixed(4) : 0);
            };
            window.addEventListener("scroll", function () { if (!tick) tick = requestAnimationFrame(upd); }, { passive: true });
            upd();
        }
        if (finePointer && !reduce) {
            var spot = doc.createElement("div");
            spot.className = "fx-spot";
            doc.body.appendChild(spot);
            var r = 0, sx = 0, sy = 0;
            window.addEventListener("pointermove", function (e) {
                sx = e.clientX; sy = e.clientY;
                if (r) return;
                r = requestAnimationFrame(function () {
                    r = 0;
                    spot.style.setProperty("--sx", sx + "px");
                    spot.style.setProperty("--sy", sy + "px");
                });
            }, { passive: true });
        }
    }

    /* ---------- 3D tilt + magnetic buttons ---------- */
    var TILT = ".feature-card,.wcard,.skin-card,.srv-card,.clan-card,.profile-stats .stat-card,.stat-box,.hud-chip";
    var MAG = ".primary-btn,.secondary-btn,.create-clan,.save,.steam-login,.steam-login-btn";
    function initTiltMagnet() {
        if (!finePointer || reduce) return;
        var cur = null, raf = 0, last = null;

        function clearTilt(el) {
            if (!el) return;
            el.classList.remove("tilting");
            el.style.removeProperty("--rx"); el.style.removeProperty("--ry");
        }
        doc.addEventListener("pointermove", function (e) {
            last = e;
            if (raf) return;
            raf = requestAnimationFrame(function () {
                raf = 0;
                var tg = last.target;
                if (!tg || !tg.closest) return;

                var card = tg.closest(TILT);
                if (card !== cur) { clearTilt(cur); cur = card; }
                if (card && !card.classList.contains("reveal")) {
                    var r = card.getBoundingClientRect();
                    var px = (last.clientX - r.left) / r.width - .5;
                    var py = (last.clientY - r.top) / r.height - .5;
                    var max = card.classList.contains("hud-chip") ? 6 : 7;
                    card.style.setProperty("--ry", (px * max * 2).toFixed(2) + "deg");
                    card.style.setProperty("--rx", (-py * max * 2).toFixed(2) + "deg");
                    card.classList.add("tilting");
                }

                $$(MAG).forEach(function (b) {
                    var br = b.getBoundingClientRect();
                    var cx = br.left + br.width / 2, cy = br.top + br.height / 2;
                    var dx = last.clientX - cx, dy = last.clientY - cy;
                    var dist = Math.sqrt(dx * dx + dy * dy), reach = Math.max(br.width, br.height) * .85;
                    if (dist < reach) {
                        b.style.setProperty("--bx", (dx * .18).toFixed(1) + "px");
                        b.style.setProperty("--by", (dy * .22).toFixed(1) + "px");
                    } else if (b.style.getPropertyValue("--bx")) {
                        b.style.removeProperty("--bx"); b.style.removeProperty("--by");
                    }
                });
            });
        }, { passive: true });
        doc.addEventListener("pointerleave", function () { clearTilt(cur); cur = null; }, true);
    }

    /* ---------- smooth page transitions ---------- */
    function initTransitions() {
        if (reduce) return;
        doc.addEventListener("click", function (e) {
            var a = e.target.closest && e.target.closest("a[href]");
            if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            if (a.target && a.target !== "_self") return;
            var u;
            try { u = new URL(a.href, location.href); } catch (_) { return; }
            if (u.origin !== location.origin) return;
            if (u.pathname === location.pathname && u.search === location.search) return;
            if (/^\/(api|discord)\b/.test(u.pathname)) return;
            e.preventDefault();
            doc.documentElement.classList.add("leaving");
            setTimeout(function () { location.href = u.href; }, 240);
        });
        window.addEventListener("pageshow", function () { doc.documentElement.classList.remove("leaving"); });
    }

    /* ---------- skin rarity colour -> card glow ---------- */
    function initRarity() {
        var grid = doc.getElementById("skinGrid");
        if (!grid) return;
        function paint() {
            $$(".skin-card", grid).forEach(function (c) {
                var n = c.querySelector(".skin-info strong");
                if (!n) return;
                var col = n.style.borderBottomColor;
                if (col) c.style.setProperty("--rar", col);
            });
        }
        new MutationObserver(paint).observe(grid, { childList: true });
        paint();
    }

    /* ---------- loading placeholders ---------- */
    function initSkeleton() {
        $$(".srv-empty,td.empty,#weaponGrid").forEach(function (el) {
            if (!/^\s*loading/i.test(el.textContent)) return;
            el.classList.add("skel");
            var mo = new MutationObserver(function () { el.classList.remove("skel"); mo.disconnect(); });
            mo.observe(el, { childList: true, characterData: true, subtree: true });
        });
    }

    function init() {
        initMenu();
        initGlow();
        initTables();
        initReveal();
        initCounters();
        initStagger();
        initCrosshair();
        initParticles();
        initSpotAndProgress();
        initTiltMagnet();
        initTransitions();
        initRarity();
        initSkeleton();
    }

    if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init);
    else init();
})();
