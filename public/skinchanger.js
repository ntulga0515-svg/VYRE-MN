/* VYRE.MN skinchanger - weapon grid on top, skins open below (leet.mn style) */

const S = { weapons: [], mine: {}, weapon: null, team: 0, group: "all", pick: null, user: null };
const $ = id => document.getElementById(id);
const TEAM_ID = { ALL: 0, T: 2, CT: 3 };
const WEAR_FLOAT = { FN: 0.01, MW: 0.10, FT: 0.25, WW: 0.41, BS: 0.70 };
const GROUPS = [
    ["all", "БҮХ ЗЭВСЭГ"], ["pistols", "ГАР БУУ"], ["smgs", "ХАГАС АВТОМАТ"],
    ["heavy", "АВТОМАТ / ШОТГАН"], ["rifles", "ВИНТОВ"], ["knives", "ХУТГА"], ["gloves", "БЭЭЛИЙ"],
];
const GROUP_ORDER = GROUPS.map(g => g[0]);

function toast(msg, bad) {
    let t = $("vyreToast");
    if (!t) {
        t = document.createElement("div");
        t.id = "vyreToast";
        t.style.cssText = "position:fixed;bottom:22px;right:22px;padding:11px 16px;border-radius:3px;" +
            "font-size:10px;font-weight:800;z-index:99;color:#000;transition:.2s";
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.background = bad ? "#ff5b5b" : "#fff";
    t.style.opacity = "1";
    clearTimeout(t._h);
    t._h = setTimeout(() => (t.style.opacity = "0"), 2200);
}

/* ---------- account ---------- */

function steamLogin() {
    location.href = S.user ? "/api/auth/logout" : "/api/auth/steam";
}

function renderAccount() {
    const on = !!S.user;
    $("loginNotice").hidden = on;
    if (on) $("accountLine").textContent = (S.user.name || "Steam User") + " · нэвтэрсэн";
    const label = on ? "LOGOUT" : "STEAM LOGIN";
    document.querySelectorAll(".steam-label").forEach(b => (b.textContent = label));
}

/* ---------- data ---------- */

async function init() {
    try {
        const me = await fetch("/api/auth/me").then(r => r.json());
        S.user = me.loggedIn ? me.user : null;
    } catch { S.user = null; }
    renderAccount();

    try {
        const res = await fetch("/api/skins/catalog");
        if (!res.ok) throw new Error();
        S.weapons = await res.json();
    } catch {
        $("weaponGrid").textContent = "Skin жагсаалтыг ачаалж чадсангүй. Түр хүлээгээд дахин оролдоно уу.";
        return;
    }

    if (S.user) await loadMine();
    renderGroups();
    renderWeapons();
}

async function loadMine() {
    S.mine = {};
    try {
        const res = await fetch("/api/skins/mine");
        if (res.ok) (await res.json()).forEach(r => (S.mine[r.weapon_team + ":" + r.weapon_defindex] = r));
    } catch { /* ignore */ }
}

const savedFor = defindex => S.mine[(S.team || 2) + ":" + defindex];

function equippedSkin(w) {
    const row = savedFor(w.defindex);
    if (!row || !row.equipped) return null;
    return w.skins.find(s => s.paint === row.weapon_paint_id) || null;
}

/* ---------- weapon grid ---------- */

function renderGroups() {
    const bar = $("groupTabs");
    bar.textContent = "";
    GROUPS.forEach(([key, label]) => {
        const count = key === "all" ? S.weapons.length : S.weapons.filter(w => w.group === key).length;
        if (!count) return;
        const b = document.createElement("button");
        b.type = "button";
        b.className = "group-tab" + (S.group === key ? " active" : "");
        b.textContent = label;
        const em = document.createElement("em");
        em.textContent = count;
        b.appendChild(em);
        b.onclick = () => { S.group = key; renderGroups(); renderWeapons(); };
        bar.appendChild(b);
    });
}

function renderWeapons() {
    const grid = $("weaponGrid");
    grid.textContent = "";
    const list = S.weapons
        .filter(w => S.group === "all" || w.group === S.group)
        .sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group) || a.name.localeCompare(b.name));

    list.forEach(w => {
        const eq = equippedSkin(w);
        const card = document.createElement("button");
        card.type = "button";
        card.className = "wcard" + (eq ? " has" : "") + (S.weapon && S.weapon.defindex === w.defindex ? " active" : "");

        const pic = document.createElement("div");
        pic.className = "wimg";
        const src = (eq && eq.image) || w.image;
        if (src) {
            const img = document.createElement("img");
            img.src = src; img.loading = "lazy"; img.alt = "";
            pic.appendChild(img);
        }
        const name = document.createElement("strong");
        name.textContent = w.name;
        const sub = document.createElement("small");
        sub.textContent = eq ? eq.name : w.skins.filter(s => s.paint).length + " skins";

        card.append(pic, name, sub);
        card.onclick = () => openWeapon(w.defindex);
        grid.appendChild(card);
    });
}

/* ---------- skin panel ---------- */

function openWeapon(defindex) {
    S.weapon = S.weapons.find(w => w.defindex === Number(defindex));
    S.pick = null;
    $("skinPanel").hidden = false;
    $("weaponTitle").textContent = S.weapon.name;
    $("skinSearch").value = "";
    renderWeapons();

    const saved = savedFor(S.weapon.defindex);
    const skin = saved && saved.equipped && S.weapon.skins.find(x => x.paint === saved.weapon_paint_id);
    renderSkins();
    skin ? pickSkin(skin, saved) : updatePreview();

    $("skinPanel").scrollIntoView({ behavior: "smooth", block: "start" });
}

function closePanel() {
    S.weapon = null;
    S.pick = null;
    $("skinPanel").hidden = true;
    renderWeapons();
}

function renderSkins() {
    const grid = $("skinGrid");
    const q = ($("skinSearch").value || "").toLowerCase().trim();
    const list = S.weapon.skins.filter(s => !q || s.name.toLowerCase().includes(q));
    const saved = savedFor(S.weapon.defindex);

    $("skinCount").textContent = list.length + " SKINS";
    grid.textContent = "";
    if (!list.length) {
        const e = document.createElement("div");
        e.className = "empty";
        e.textContent = "SKIN ОЛДСОНГҮЙ";
        grid.appendChild(e);
        return;
    }

    list.forEach(skin => {
        const card = document.createElement("button");
        card.type = "button";
        const isPick = S.pick && S.pick.paint === skin.paint;
        const isSaved = saved && saved.equipped && saved.weapon_paint_id === skin.paint;
        card.className = "skin-card" + (isPick || (!S.pick && isSaved) ? " selected" : "");

        const pic = document.createElement("div");
        pic.className = "skin-picture";
        if (skin.image) {
            const img = document.createElement("img");
            img.src = skin.image; img.loading = "lazy"; img.alt = "";
            pic.appendChild(img);
        } else {
            pic.style.fontSize = "10px";
            pic.style.fontWeight = "900";
            pic.textContent = skin.name.toUpperCase();
        }
        if (isSaved) {
            const tag = document.createElement("span");
            tag.className = "skin-short";
            tag.textContent = "EQUIPPED";
            pic.appendChild(tag);
        }

        const info = document.createElement("div");
        info.className = "skin-info";
        const small = document.createElement("small");
        small.textContent = S.weapon.name;
        const name = document.createElement("strong");
        name.textContent = skin.name;
        if (skin.color) name.style.borderBottom = "2px solid " + skin.color;
        info.append(small, name);

        card.append(pic, info);
        card.onclick = () => pickSkin(skin);
        grid.appendChild(card);
    });
}

function pickSkin(skin, savedRow) {
    S.pick = skin;
    const saved = savedRow || savedFor(S.weapon.defindex);
    const same = saved && saved.equipped && saved.weapon_paint_id === skin.paint;
    $("settingFloat").value = same ? saved.weapon_wear : WEAR_FLOAT.FN;
    $("settingPattern").value = same ? saved.weapon_seed : 0;
    syncWearLabel();
    updatePreview();
    renderSkins();
}

function updatePreview() {
    const skin = S.pick;
    $("selectedSkin").textContent = skin ? skin.name : "NONE";
    $("selectedWeapon").textContent = S.weapon ? S.weapon.name : "—";
    const box = $("selectedPicture");
    box.textContent = "";
    if (skin && skin.image) {
        const img = document.createElement("img");
        img.src = skin.image; img.alt = "";
        box.appendChild(img);
    } else {
        const s = document.createElement("span");
        s.textContent = skin ? skin.name.toUpperCase() : "Skin сонгоно уу";
        box.appendChild(s);
    }
}

/* ---------- wear / float ---------- */

function wearFromFloat(f) {
    return f < 0.07 ? "FN" : f < 0.15 ? "MW" : f < 0.38 ? "FT" : f < 0.45 ? "WW" : "BS";
}
function syncWearLabel() { $("settingWear").value = wearFromFloat(Number($("settingFloat").value)); }
function wearChanged() { $("settingFloat").value = WEAR_FLOAT[$("settingWear").value]; }

/* ---------- team filter ---------- */

function teamFilter(team, btn) {
    S.team = TEAM_ID[team];
    document.querySelectorAll(".team-filter button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderWeapons();
    if (S.weapon) openWeaponNoScroll();
}

function openWeaponNoScroll() {
    const keep = S.weapon.defindex;
    S.pick = null;
    renderSkins();
    const saved = savedFor(keep);
    const skin = saved && saved.equipped && S.weapon.skins.find(x => x.paint === saved.weapon_paint_id);
    skin ? pickSkin(skin, saved) : updatePreview();
}

/* ---------- save / reset ---------- */

async function saveLoadout() {
    if (!S.user) { toast("Steam-ээр нэвтэрнэ үү", true); return; }
    if (!S.pick) { toast("Эхлээд skin сонгоно уу", true); return; }

    const res = await fetch("/api/skins/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            defindex: S.weapon.defindex,
            paint: S.pick.paint,
            team: S.team,
            wear: $("settingFloat").value,
            seed: $("settingPattern").value,
        }),
    });
    if (!res.ok) { toast("Хадгалж чадсангүй", true); return; }

    await loadMine();
    renderWeapons();
    renderSkins();
    toast(S.weapon.name + " | " + S.pick.name + " хадгалагдлаа");
}

async function clearSelected() {
    if (!S.weapon) return;
    if (S.user && savedFor(S.weapon.defindex)) {
        const res = await fetch("/api/skins/select/" + S.weapon.defindex + "?team=" + S.team, { method: "DELETE" });
        if (res.ok) { await loadMine(); toast("Анхны skin болгосон"); }
    }
    S.pick = null;
    updatePreview();
    renderWeapons();
    renderSkins();
}

document.addEventListener("DOMContentLoaded", () => {
    $("skinSearch").oninput = () => S.weapon && renderSkins();
    $("settingWear").onchange = wearChanged;
    $("settingFloat").oninput = syncWearLabel;
    init();
});
