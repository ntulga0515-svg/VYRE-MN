const API = "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en";

const ENDPOINTS = {
    skins: `${API}/skins.json`,
    agents: `${API}/agents.json`,
    music: `${API}/music_kits.json`,
    collectibles: `${API}/collectibles.json`
};

const state = {
    skins: [],
    agents: [],
    music: [],
    collectibles: [],
    tab: "skins",
    team: "all",
    weapon: "ALL",
    query: "",
    selected: null,
    loadout: {}
};

const KNIFE_WORDS = [
    "knife", "karambit", "bayonet", "talon", "kukri", "ursus",
    "nomad", "stiletto", "navaja", "bowie", "falchion", "huntsman",
    "paracord", "skeleton", "survival", "shadow daggers", "butterfly",
    "classic knife"
];

const GLOVE_WORDS = [
    "glove", "hand wraps", "sport gloves", "specialist gloves",
    "driver gloves", "moto gloves", "hydra gloves",
    "broken fang gloves", "bloodhound gloves"
];

function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function getName(item) {
    return item?.name || item?.market_hash_name || "Unknown";
}

function getImage(item) {
    return item?.image || item?.icon_url || "";
}

function getWeaponName(item) {
    return item?.weapon?.name || item?.weapon?.id || "";
}

function getTeam(item) {
    const team = item?.team;

    if (!team) return "all";

    const value = String(
        team?.id ||
        team?.name ||
        team
    ).toLowerCase();

    if (
        value.includes("terror") ||
        value === "t" ||
        value.includes("counter")
    ) {
        if (value.includes("counter")) return "ct";
        return "t";
    }

    if (
        value.includes("counter") ||
        value.includes("ct")
    ) {
        return "ct";
    }

    return "all";
}

function isKnife(item) {
    const name = getName(item).toLowerCase();
    const weapon = getWeaponName(item).toLowerCase();

    return KNIFE_WORDS.some(x =>
        name.includes(x) ||
        weapon.includes(x)
    );
}

function isGlove(item) {
    const name = getName(item).toLowerCase();
    const weapon = getWeaponName(item).toLowerCase();

    return GLOVE_WORDS.some(x =>
        name.includes(x) ||
        weapon.includes(x)
    );
}

function weaponGroup(name) {
    const x = String(name || "").toLowerCase();

    if (
        x.includes("glock") ||
        x.includes("usp") ||
        x.includes("p2000") ||
        x.includes("p250") ||
        x.includes("deagle") ||
        x.includes("desert eagle") ||
        x.includes("five-seven") ||
        x.includes("tec-9") ||
        x.includes("cz75") ||
        x.includes("dual berettas") ||
        x.includes("r8 revolver")
    ) return "PISTOLS";

    if (
        x.includes("mac-10") ||
        x.includes("mp9") ||
        x.includes("mp7") ||
        x.includes("mp5") ||
        x.includes("ump") ||
        x.includes("p90") ||
        x.includes("pp-bizon")
    ) return "SMGS";

    if (
        x.includes("ak-47") ||
        x.includes("m4a4") ||
        x.includes("m4a1-s") ||
        x.includes("galil") ||
        x.includes("famas") ||
        x.includes("aug") ||
        x.includes("sg 553")
    ) return "RIFLES";

    if (
        x.includes("awp") ||
        x.includes("ssg 08") ||
        x.includes("scar-20") ||
        x.includes("g3sg1")
    ) return "SNIPERS";

    if (
        x.includes("nova") ||
        x.includes("xm1014") ||
        x.includes("mag-7") ||
        x.includes("sawed-off")
    ) return "SHOTGUNS";

    if (
        x.includes("m249") ||
        x.includes("negev")
    ) return "MACHINE GUNS";

    return "OTHER";
}

async function loadData() {
    try {
        const [skins, agents, music, collectibles] = await Promise.all([
            fetch(ENDPOINTS.skins).then(r => r.json()),
            fetch(ENDPOINTS.agents).then(r => r.json()),
            fetch(ENDPOINTS.music).then(r => r.json()),
            fetch(ENDPOINTS.collectibles).then(r => r.json())
        ]);

        state.skins = Array.isArray(skins) ? skins : [];
        state.agents = Array.isArray(agents) ? agents : [];
        state.music = Array.isArray(music) ? music : [];
        state.collectibles = Array.isArray(collectibles) ? collectibles : [];

        renderWeaponBar();
        renderItems();

    } catch (error) {
        console.error("CS2 data load error:", error);

        const grid = document.getElementById("skinGrid");

        if (grid) {
            grid.innerHTML = `
                <div style="padding:30px;color:#ff5b5b;">
                    Failed to load CS2 data.
                </div>
            `;
        }
    }
}

async function loadSavedLoadout() {
    try {
        const response = await fetch("/api/loadout", {
            credentials: "include"
        });

        if (!response.ok) return;

        const data = await response.json();

        state.loadout = data.loadout || {};

        renderSavedLoadout();

    } catch (error) {
        console.error("Loadout load error:", error);
    }
}

async function saveLoadout() {
    try {
        const response = await fetch("/api/loadout", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                loadout: state.loadout
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Steam login required");
            return;
        }

        state.loadout = data.loadout || state.loadout;

        renderSavedLoadout();

        alert("LOADOUT SAVED");

    } catch (error) {
        console.error("Save loadout error:", error);
        alert("Failed to save loadout");
    }
}

function selectItem(item, type = "skin") {
    const name = getName(item);

    let key = "";

    if (type === "skin") {
        const weapon = getWeaponName(item) || name;
        key = `skin:${weapon}`;
    }

    if (type === "agent") {
        const team = getTeam(item);
        key = `agent:${team}`;
    }

    if (type === "music") {
        key = "music";
    }

    if (type === "medal") {
        key = "medal";
    }

    state.selected = {
        id: item.id || item.name || name,
        name,
        image: getImage(item),
        tab: type,
        weapon: getWeaponName(item)
    };

    state.selected.key = key;

    updateSelectedPreview();
}

function saveSelected() {
    if (!state.selected) {
        alert("Select a skin/item first.");
        return;
    }

    const key = state.selected.key;

    state.loadout[key] = {
        id: state.selected.id,
        name: state.selected.name,
        image: state.selected.image,
        tab: state.selected.tab,
        weapon: state.selected.weapon
    };

    saveLoadout();
}

function removeSelected() {
    if (!state.selected?.key) return;

    delete state.loadout[state.selected.key];

    state.selected = null;

    updateSelectedPreview();
    renderSavedLoadout();

    saveLoadout();
}

function updateSelectedPreview() {
    const image = document.getElementById("selectedImage");
    const name = document.getElementById("selectedName");

    if (!image || !name) return;

    if (!state.selected) {
        image.src = "";
        image.style.display = "none";
        name.textContent = "NO ITEM SELECTED";
        return;
    }

    name.textContent = state.selected.name;

    if (state.selected.image) {
        image.src = state.selected.image;
        image.style.display = "block";
    } else {
        image.style.display = "none";
    }
}

function renderSavedLoadout() {
    const box = document.getElementById("savedLoadout");

    if (!box) return;

    const entries = Object.entries(state.loadout);

    if (!entries.length) {
        box.innerHTML = `
            <div class="empty-loadout">
                NO SAVED LOADOUT
            </div>
        `;
        return;
    }

    box.innerHTML = entries.map(([key, item]) => `
        <div class="saved-item">
            ${
                item.image
                    ? `<img src="${escapeHTML(item.image)}" loading="lazy">`
                    : ""
            }

            <div>
                <strong>${escapeHTML(item.name)}</strong>
                <small>${escapeHTML(key)}</small>
            </div>
        </div>
    `).join("");
}

function renderWeaponBar() {
    const bar = document.getElementById("weaponBar");

    if (!bar) return;

    if (state.tab !== "skins") {
        bar.innerHTML = "";
        return;
    }

    const weapons = new Set();

    state.skins.forEach(item => {
        const weapon = getWeaponName(item);

        if (weapon) {
            weapons.add(weapon);
        }
    });

    const sorted = [...weapons].sort();

    bar.innerHTML = `
        <button
            class="${state.weapon === "ALL" ? "active" : ""}"
            data-weapon="ALL"
        >
            ALL
        </button>

        ${sorted.map(weapon => `
            <button
                class="${state.weapon === weapon ? "active" : ""}"
                data-weapon="${escapeHTML(weapon)}"
            >
                ${escapeHTML(weapon)}
            </button>
        `).join("")}
    `;

    bar.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", () => {
            state.weapon = button.dataset.weapon;
            renderWeaponBar();
            renderItems();
        });
    });
}

function getCurrentItems() {
    let items = [];

    if (state.tab === "skins") {
        items = state.skins;
    }

    if (state.tab === "agents") {
        items = state.agents;
    }

    if (state.tab === "music") {
        items = state.music;
    }

    if (state.tab === "medals") {
        items = state.collectibles;
    }

    if (state.team !== "all") {
        items = items.filter(item => {
            return getTeam(item) === state.team;
        });
    }

    if (state.tab === "skins" && state.weapon !== "ALL") {
        items = items.filter(item => {
            return getWeaponName(item) === state.weapon;
        });
    }

    if (state.query.trim()) {
        const query = state.query.toLowerCase();

        items = items.filter(item => {
            return getName(item)
                .toLowerCase()
                .includes(query);
        });
    }

    return items;
}

function renderItems() {
    const grid = document.getElementById("skinGrid");

    if (!grid) return;

    const items = getCurrentItems();

    if (!items.length) {
        grid.innerHTML = `
            <div style="padding:30px;opacity:.6;">
                NO ITEMS FOUND
            </div>
        `;
        return;
    }

    grid.innerHTML = items.map((item, index) => {
        let type = state.tab === "skins"
            ? "skin"
            : state.tab === "agents"
                ? "agent"
                : state.tab === "music"
                    ? "music"
                    : "medal";

        const image = getImage(item);
        const name = getName(item);
        const weapon = getWeaponName(item);

        return `
            <button
                class="skin-card"
                data-index="${index}"
                type="button"
            >
                <div class="skin-image">
                    ${
                        image
                            ? `<img src="${escapeHTML(image)}" loading="lazy" alt="">`
                            : `<span>NO IMAGE</span>`
                    }
                </div>

                <div class="skin-name">
                    ${escapeHTML(name)}
                </div>

                ${
                    weapon
                        ? `<div class="skin-weapon">${escapeHTML(weapon)}</div>`
                        : ""
                }
            </button>
        `;
    }).join("");

    grid.querySelectorAll(".skin-card").forEach(card => {
        card.addEventListener("click", () => {
            const index = Number(card.dataset.index);
            const item = items[index];

            let type = state.tab === "skins"
                ? "skin"
                : state.tab === "agents"
                    ? "agent"
                    : state.tab === "music"
                        ? "music"
                        : "medal";

            selectItem(item, type);
        });
    });
}

function setupTabs() {
    document.querySelectorAll("[data-tab]").forEach(button => {
        button.addEventListener("click", () => {
            state.tab = button.dataset.tab;
            state.weapon = "ALL";

            document
                .querySelectorAll("[data-tab]")
                .forEach(x => x.classList.remove("active"));

            button.classList.add("active");

            renderWeaponBar();
            renderItems();
        });
    });
}

function setupTeamButtons() {
    document.querySelectorAll("[data-team]").forEach(button => {
        button.addEventListener("click", () => {
            state.team = button.dataset.team;

            document
                .querySelectorAll("[data-team]")
                .forEach(x => x.classList.remove("active"));

            button.classList.add("active");

            renderItems();
        });
    });
}

function setupSearch() {
    const search = document.getElementById("skinSearch");

    if (!search) return;

    search.addEventListener("input", () => {
        state.query = search.value;
        renderItems();
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    setupTabs();
    setupTeamButtons();
    setupSearch();

    const saveButton = document.getElementById("saveSkin");

    if (saveButton) {
        saveButton.addEventListener("click", saveSelected);
    }

    const removeButton = document.getElementById("removeSkin");

    if (removeButton) {
        removeButton.addEventListener("click", removeSelected);
    }

    await Promise.all([
        loadData(),
        loadSavedLoadout()
    ]);

    updateSelectedPreview();
});
