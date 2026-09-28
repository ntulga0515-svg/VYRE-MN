/* VYRE.MN skinchanger (weapons) - talks to /api/skins/* */

const S = { weapons: [], mine: {}, weapon: null, team: 0, pick: null, user: null, kind: "weapon" };
const KIND_OF = { weapons: "weapon", knives: "knife", gloves: "gloves" };
const $ = id => document.getElementById(id);
const TEAM_ID = { ALL: 0, T: 2, CT: 3 };
const WEAR_FLOAT = { FN: 0.01, MW: 0.10, FT: 0.25, WW: 0.41, BS: 0.70 };

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
    $("steamDisconnected").style.display = on ? "none" : "flex";
    $("steamConnected").style.display = on ? "flex" : "none";
    if (on) {
        $("steamName").textContent = S.user.name || "Steam User";
        const av = $("steamAvatar");
        av.textContent = "";
        if (S.user.avatar) {
            const img = document.createElement("img");
            img.src = S.user.avatar;
            img.alt = "";
            av.appendChild(img);
        }
    }
    const label = on ? "LOGOUT" : "STEAM LOGIN";
    document.querySelectorAll(".top-steam").forEach(b => (b.textContent = label));
    document.querySelectorAll(".account button").forEach(b => (b.textContent = on ? "LOGOUT" : "CONNECT STEAM"));
    document.querySelectorAll(".steam-login").forEach(b => (b.firstChild.textContent = label + " "));
}

/* ---------- data ---------- */

async function init() {
    const grid = $("skinGrid");
    grid.textContent = "Loading skins...";

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
        grid.textContent = "Skin catalog could not be loaded. Please refresh in a minute.";
        return;
    }

    if (S.user) await loadMine();

    firstOfKind();
}

function firstOfKind() {
    const list = S.weapons.filter(w => w.kind === S.kind);
    changeWeapon((list.find(w => w.name === "AK-47") || list[0]).defindex);
}

async function loadMine() {
    S.mine = {};
    try {
        const res = await fetch("/api/skins/mine");
        if (res.ok) (await res.json()).forEach(r => (S.mine[r.weapon_team + ":" + r.weapon_defindex] = r));
    } catch { /* ignore */ }
}

const savedFor = defindex => S.mine[(S.team || 2) + ":" + defindex];

/* ---------- render ---------- */

function renderWeapons() {
    const bar = $("weaponBar");
    bar.textContent = "";
    S.weapons.filter(w => w.kind === S.kind).forEach(w => {
        const b = document.createElement("button");
        b.className = "weapon-tab" + (S.weapon && S.weapon.defindex === w.defindex ? " active" : "");
        b.textContent = w.name.toUpperCase();
        b.onclick = () => changeWeapon(w.defindex);
        bar.appendChild(b);
    });
}

function changeWeapon(defindex) {
    S.weapon = S.weapons.find(w => w.defindex === Number(defindex));
    S.pick = null;
    $("weaponTitle").textContent = S.weapon.name;
    const s = $("skinSearch"); if (s) s.value = "";
    renderWeapons();
    renderSkins();
    const saved = savedFor(S.weapon.defindex);
    const skin = saved && S.weapon.skins.find(x => x.paint === saved.weapon_paint_id);
    skin ? pickSkin(skin, saved) : updatePreview();
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
        e.textContent = "NO SKINS FOUND";
        grid.appendChild(e);
        return;
    }

    list.forEach(skin => {
        const card = document.createElement("button");
        card.type = "button";
        const isPick = S.pick && S.pick.paint === skin.paint;
        const isSaved = saved && saved.weapon_paint_id === skin.paint;
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
        if (isSaved && saved.equipped) {
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
    const row = savedRow || (savedFor(S.weapon.defindex) && savedFor(S.weapon.defindex).weapon_paint_id === skin.paint
        ? savedFor(S.weapon.defindex) : null);
    $("settingFloat").value = row ? row.weapon_wear : WEAR_FLOAT.FN;
    $("settingPattern").value = row ? row.weapon_seed : 0;
    syncWearLabel();
    updatePreview();
    renderSkins();
}

function updatePreview() {
    const skin = S.pick;
    $("selectedSkin").textContent = skin ? skin.name : "NONE";
    $("selectedSkinSmall").textContent = skin ? skin.name : "NONE";
    $("selectedWeapon").textContent = skin ? S.weapon.name : "—";
    const box = $("selectedPicture");
    box.textContent = "";
    if (skin && skin.image) {
        const img = document.createElement("img");
        img.src = skin.image; img.alt = "";
        box.appendChild(img);
    } else if (skin) {
        const s = document.createElement("span");
        s.textContent = skin.name.toUpperCase();
        box.appendChild(s);
    } else {
        const s = document.createElement("span");
        s.textContent = "VYRE";
        box.appendChild(s);
    }
}

/* ---------- wear / float ---------- */

function wearFromFloat(f) {
    return f < 0.07 ? "FN" : f < 0.15 ? "MW" : f < 0.38 ? "FT" : f < 0.45 ? "WW" : "BS";
}
function syncWearLabel() { $("settingWear").value = wearFromFloat(Number($("settingFloat").value)); }
function wearChanged() { $("settingFloat").value = WEAR_FLOAT[$("settingWear").value]; }

/* ---------- filters ---------- */

function teamFilter(team, btn) {
    S.team = TEAM_ID[team];
    document.querySelectorAll(".team-filter button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    changeWeapon(S.weapon.defindex);
}

function skinCategory(category, btn) {
    if (!KIND_OF[category] || !S.weapons.length) return;
    S.kind = KIND_OF[category];
    document.querySelectorAll(".main-tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    firstOfKind();
}

/* ---------- save / clear ---------- */

async function saveLoadout() {
    if (!S.user) { toast("Steam-ээр нэвтэрнэ үү", true); return; }
    if (!S.pick) { toast("Эхлээд skin сонгоно уу", true); return; }

    const body = {
        defindex: S.weapon.defindex,
        paint: S.pick.paint,
        team: S.team,
        wear: $("settingFloat").value,
        seed: $("settingPattern").value,
    };
    const res = await fetch("/api/skins/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!res.ok) { toast("Хадгалж чадсангүй", true); return; }

    await loadMine();
    renderSkins();
    toast(S.weapon.name + " | " + S.pick.name + " сонгогдлоо");
}

async function clearSelected() {
    if (S.user && S.weapon && savedFor(S.weapon.defindex)) {
        const res = await fetch("/api/skins/select/" + S.weapon.defindex + "?team=" + S.team, { method: "DELETE" });
        if (res.ok) { await loadMine(); toast("Анхны skin болгосон"); }
    }
    S.pick = null;
    updatePreview();
    renderSkins();
}

document.addEventListener("DOMContentLoaded", () => {
    $("skinSearch").oninput = renderSkins;
    $("settingWear").onchange = wearChanged;
    $("settingFloat").oninput = syncWearLabel;
    init();
});
