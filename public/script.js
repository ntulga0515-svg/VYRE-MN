/* =========================================================
   LEET STYLE SKIN PAGE — EXTRA FUNCTIONS
   ========================================================= */

let currentWeaponCategory = "ALL";


/* =========================================================
   WEAPON CATEGORY
   ========================================================= */

function weaponCategory(category, button) {

    currentWeaponCategory = category;

    document
        .querySelectorAll(".weapon-category")
        .forEach(btn => {
            btn.classList.remove("active");
        });

    if (button) {
        button.classList.add("active");
    }

    renderSkinsByCategory();
}


/* =========================================================
   WEAPON CATEGORY MAP
   ========================================================= */

function getWeaponCategory(weapon) {

    const categories = {

        /* PISTOLS */
        "Glock-18": "PISTOL",
        "USP-S": "PISTOL",
        "Desert Eagle": "PISTOL",
        "P250": "PISTOL",

        /* SMG */
        "MAC-10": "SMG",
        "MP9": "SMG",
        "MP7": "SMG",
        "MP5-SD": "SMG",
        "UMP-45": "SMG",
        "P90": "SMG",
        "PP-Bizon": "SMG",

        /* RIFLES */
        "AK-47": "RIFLE",
        "M4A4": "RIFLE",
        "M4A1-S": "RIFLE",
        "FAMAS": "RIFLE",
        "Galil AR": "RIFLE",
        "AUG": "RIFLE",
        "SG 553": "RIFLE",

        /* SHOTGUN */
        "Nova": "SHOTGUN",
        "XM1014": "SHOTGUN",
        "MAG-7": "SHOTGUN",
        "Sawed-Off": "SHOTGUN",

        /* SNIPER */
        "AWP": "SNIPER",
        "SSG 08": "SNIPER",
        "SCAR-20": "SNIPER",
        "G3SG1": "SNIPER",

        /* HEAVY */
        "M249": "SHOTGUN",
        "Negev": "SHOTGUN"

    };

    return categories[weapon] || "ALL";
}


/* =========================================================
   RENDER BY CATEGORY
   ========================================================= */

function renderSkinsByCategory() {

    const select =
        document.getElementById("weaponSelect");

    if (!select) return;

    const options =
        Array.from(select.options);

    options.forEach(option => {

        const weapon =
            option.value;

        if (
            currentWeaponCategory === "ALL" ||
            getWeaponCategory(weapon) === currentWeaponCategory
        ) {

            option.style.display = "";

        } else {

            option.style.display = "none";

        }

    });

    const currentCategory =
        getWeaponCategory(currentWeapon);

    if (
        currentWeaponCategory !== "ALL" &&
        currentCategory !== currentWeaponCategory
    ) {

        const firstWeapon =
            options.find(option =>
                getWeaponCategory(option.value) ===
                currentWeaponCategory
            );

        if (firstWeapon) {

            select.value =
                firstWeapon.value;

            changeWeapon(
                firstWeapon.value
            );

            return;

        }

    }

    renderSkins();

}


/* =========================================================
   PLAYER SEARCH
   ========================================================= */

async function loadPlayer() {

    const input =
        document.getElementById("playerSearch");

    if (!input) return;

    const value =
        input.value.trim();

    if (!value) {

        alert("PLAYER NAME / STEAMID ОРУУЛНА УУ.");

        return;

    }

    /*
       SteamID байвал profile API ашиглана.
    */

    const steamIdMatch =
        value.match(/^\d{17}$/);

    if (steamIdMatch) {

        try {

            const response =
                await fetch(
                    "/api/players/" + value
                );

            if (!response.ok) {

                alert("PLAYER ОЛДСОНГҮЙ.");

                return;

            }

            const player =
                await response.json();

            showLoadedPlayer(player);

            return;

        } catch (error) {

            console.error(error);

            alert("PLAYER LOAD ХИЙХЭД АЛДАА ГАРЛАА.");

            return;

        }

    }

    /*
       Steam profile link доторх SteamID
    */

    const linkMatch =
        value.match(/7656119\d{10}/);

    if (linkMatch) {

        try {

            const response =
                await fetch(
                    "/api/players/" +
                    linkMatch[0]
                );

            if (!response.ok) {

                alert("PLAYER ОЛДСОНГҮЙ.");

                return;

            }

            const player =
                await response.json();

            showLoadedPlayer(player);

            return;

        } catch (error) {

            console.error(error);

            alert("PLAYER LOAD ХИЙХЭД АЛДАА ГАРЛАА.");

            return;

        }

    }

    alert(
        "SteamID64 эсвэл Steam profile link оруулна уу."
    );

}


/* =========================================================
   SHOW PLAYER
   ========================================================= */

function showLoadedPlayer(player) {

    const input =
        document.getElementById("playerSearch");

    if (!player) return;

    if (input && player.steam_id) {

        input.value =
            player.steam_id;

    }

    const steamName =
        document.getElementById("steamName");

    if (steamName) {

        steamName.textContent =
            player.name ||
            player.steam_name ||
            "Steam User";

    }

    const steamDisconnected =
        document.getElementById(
            "steamDisconnected"
        );

    const steamConnected =
        document.getElementById(
            "steamConnected"
        );

    if (steamDisconnected) {

        steamDisconnected.style.display =
            "none";

    }

    if (steamConnected) {

        steamConnected.style.display =
            "flex";

    }

}


/* =========================================================
   FIX MAIN CATEGORY ACTIVE BUTTON
   ========================================================= */

function skinCategory(category, button) {

    document
        .querySelectorAll(".skin-main-tab")
        .forEach(tab => {

            tab.classList.remove("active");

        });

    if (button) {

        button.classList.add("active");

    }

    const weaponArea =
        document.getElementById("weaponArea");

    const otherArea =
        document.getElementById("otherArea");

    if (category === "weapons") {

        if (weaponArea) {

            weaponArea.style.display =
                "block";

        }

        if (otherArea) {

            otherArea.style.display =
                "none";

        }

        renderSkins();

        return;

    }

    if (weaponArea) {

        weaponArea.style.display =
            "none";

    }

    if (otherArea) {

        otherArea.style.display =
            "block";

    }

    const title =
        document.getElementById("otherTitle");

    const message =
        document.getElementById("otherMessage");

    const names = {

        agents: "AGENTS",
        music: "MUSIC",
        medals: "MEDALS"

    };

    const selected =
        names[category] ||
        category.toUpperCase();

    if (title) {

        title.textContent =
            selected;

    }

    if (message) {

        message.textContent =
            selected + " COLLECTION";

    }

}


/* =========================================================
   SELECTED SKIN SETTINGS
   ========================================================= */

function selectSkin(
    weapon,
    skin,
    team,
    card
) {

    selectedSkin = {

        weapon,
        skin,
        team

    };

    const selected =
        document.getElementById(
            "selectedSkin"
        );

    const selectedSmall =
        document.getElementById(
            "selectedSkinSmall"
        );

    const selectedWeapon =
        document.getElementById(
            "selectedWeapon"
        );

    if (selected) {

        selected.textContent =
            skin;

    }

    if (selectedSmall) {

        selectedSmall.textContent =
            skin;

    }

    if (selectedWeapon) {

        selectedWeapon.textContent =
            weapon;

    }

    document
        .querySelectorAll(
            ".mirage-skin-card"
        )
        .forEach(item => {

            item.classList.remove(
                "selected"
            );

        });

    if (card) {

        card.classList.add(
            "selected"
        );

    }

    /*
       LEET style settings
    */

    const wear =
        document.getElementById(
            "settingWear"
        );

    const floatValue =
        document.getElementById(
            "settingFloat"
        );

    const pattern =
        document.getElementById(
            "settingPattern"
        );

    const stattrak =
        document.getElementById(
            "settingStatTrak"
        );

    if (wear) {

        wear.textContent =
            "FACTORY NEW";

    }

    if (floatValue) {

        floatValue.textContent =
            "0.000";

    }

    if (pattern) {

        pattern.textContent =
            "0";

    }

    if (stattrak) {

        stattrak.textContent =
            "NO";

    }

}


/* =========================================================
   INIT
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const select =
            document.getElementById(
                "weaponSelect"
            );

        if (select) {

            select.value =
                "AK-47";

        }

        currentWeapon =
            "AK-47";

        currentTeam =
            "ALL";

        currentWeaponCategory =
            "ALL";

        renderSkins();

        checkSteamLogin();

    }
);
