/* =========================================================
   VYRE.MN — SKINS
   ========================================================= */

let currentWeapon = "AK-47";
let currentTeam = "ALL";
let currentCategory = "ALL";
let selectedSkin = null;


/* =========================================================
   SKIN DATA
   ========================================================= */

const skinData = {

    "AK-47": [
        ["Redline","ALL"],
        ["Vulcan","ALL"],
        ["Neon Rider","ALL"],
        ["Asiimov","ALL"],
        ["Bloodsport","ALL"],
        ["The Empress","ALL"],
        ["Legion of Anubis","ALL"],
        ["Fire Serpent","ALL"],
        ["Fuel Injector","ALL"],
        ["Frontside Misty","ALL"],
        ["Jaguar","ALL"],
        ["Point Disarray","ALL"]
    ],

    "M4A4": [
        ["Howl","CT"],
        ["Asiimov","CT"],
        ["Neo-Noir","CT"],
        ["The Emperor","CT"],
        ["Desolate Space","CT"],
        ["Buzz Kill","CT"],
        ["Temukau","CT"],
        ["Dragon King","CT"],
        ["X-Ray","CT"]
    ],

    "M4A1-S": [
        ["Printstream","CT"],
        ["Player Two","CT"],
        ["Hyper Beast","CT"],
        ["Golden Coil","CT"],
        ["Decimator","CT"],
        ["Nightmare","CT"],
        ["Mecha Industries","CT"],
        ["Chantico's Fire","CT"],
        ["Blue Phosphor","CT"]
    ],

    "AWP": [
        ["Dragon Lore","ALL"],
        ["Asiimov","ALL"],
        ["Hyper Beast","ALL"],
        ["Printstream","ALL"],
        ["Containment Breach","ALL"],
        ["Wildfire","ALL"],
        ["Neo-Noir","ALL"],
        ["Fever Dream","ALL"],
        ["Redline","ALL"],
        ["BOOM","ALL"],
        ["Lightning Strike","ALL"]
    ],

    "Glock-18": [
        ["Fade","T"],
        ["Gamma Doppler","T"],
        ["Vogue","T"],
        ["Water Elemental","T"],
        ["Bullet Queen","T"],
        ["Wraiths","T"],
        ["Neo-Noir","T"],
        ["Snack Attack","T"]
    ],

    "USP-S": [
        ["Kill Confirmed","CT"],
        ["Printstream","CT"],
        ["The Traitor","CT"],
        ["Cortex","CT"],
        ["Neo-Noir","CT"],
        ["Blueprint","CT"],
        ["Ticket to Hell","CT"],
        ["Whiteout","CT"]
    ],

    "Desert Eagle": [
        ["Blaze","ALL"],
        ["Printstream","ALL"],
        ["Code Red","ALL"],
        ["Ocean Drive","ALL"],
        ["Kumicho Dragon","ALL"],
        ["Mecha Industries","ALL"],
        ["Conspiracy","ALL"],
        ["Trigger Discipline","ALL"]
    ],

    "P250": [
        ["See Ya Later","ALL"],
        ["Mehndi","ALL"],
        ["Asiimov","ALL"],
        ["Nevermore","ALL"],
        ["Undertow","ALL"],
        ["Muertos","ALL"],
        ["Vino Primo","ALL"]
    ],

    "FAMAS": [
        ["Commemoration","CT"],
        ["Meow 36","CT"],
        ["Roll Cage","CT"],
        ["Eye of Athena","CT"],
        ["Afterimage","CT"],
        ["Valence","CT"],
        ["Pulse","CT"]
    ],

    "Galil AR": [
        ["Sugar Rush","T"],
        ["Chromatic Aberration","T"],
        ["Eco","T"],
        ["Rocket Pop","T"],
        ["Stone Cold","T"],
        ["Firefight","T"],
        ["Signal","T"]
    ],

    "AUG": [
        ["Akihabara Accept","CT"],
        ["Chameleon","CT"],
        ["Momentum","CT"],
        ["Death by Puppy","CT"],
        ["Stymphalian","CT"],
        ["Torque","CT"],
        ["Arctic Wolf","CT"]
    ],

    "SG 553": [
        ["Integrale","T"],
        ["Cyrex","T"],
        ["Pulse","T"],
        ["Colony IV","T"],
        ["Darkwing","T"],
        ["Phantom","T"]
    ],

    "SSG 08": [
        ["Dragonfire","ALL"],
        ["Blood in the Water","ALL"],
        ["Fever Dream","ALL"],
        ["Ghost Crusader","ALL"],
        ["Big Iron","ALL"],
        ["Death Strike","ALL"],
        ["Turbo Peek","ALL"]
    ],

    "SCAR-20": [
        ["Bloodsport","CT"],
        ["Cardiac","CT"],
        ["Cyrex","CT"],
        ["Emerald","CT"],
        ["Crimson Web","CT"],
        ["Grotto","CT"]
    ],

    "G3SG1": [
        ["The Executioner","T"],
        ["Flux","T"],
        ["High Seas","T"],
        ["Demeter","T"],
        ["Chronos","T"],
        ["Stinger","T"]
    ],

    "MAC-10": [
        ["Stalker","T"],
        ["Neon Rider","T"],
        ["Disco Tech","T"],
        ["Propaganda","T"],
        ["Gold Brick","T"],
        ["Heat","T"],
        ["Fade","T"]
    ],

    "MP9": [
        ["Starlight Protector","CT"],
        ["Food Chain","CT"],
        ["Mount Fuji","CT"],
        ["Hydra","CT"],
        ["Airlock","CT"],
        ["Ruby Poison Dart","CT"]
    ],

    "MP7": [
        ["Bloodsport","ALL"],
        ["Nemesis","ALL"],
        ["Fade","ALL"],
        ["Abyssal Apparition","ALL"],
        ["Ocean Foam","ALL"],
        ["Cirrus","ALL"]
    ],

    "MP5-SD": [
        ["Phosphor","CT"],
        ["Condition Zero","CT"],
        ["Agent","CT"],
        ["Nitro","CT"],
        ["Kitbash","CT"],
        ["Liquidation","CT"]
    ],

    "UMP-45": [
        ["Primal Saber","ALL"],
        ["Momentum","ALL"],
        ["Blaze","ALL"],
        ["Neo-Noir","ALL"],
        ["Arctic Wolf","ALL"],
        ["Wild Child","ALL"]
    ],

    "P90": [
        ["Asiimov","ALL"],
        ["Death by Kitty","ALL"],
        ["Emerald Dragon","ALL"],
        ["Trigon","ALL"],
        ["Shallow Grave","ALL"],
        ["Attack Vector","ALL"]
    ],

    "PP-Bizon": [
        ["Judgement of Anubis","ALL"],
        ["High Roller","ALL"],
        ["Embargo","ALL"],
        ["Space Cat","ALL"],
        ["Fuel Rod","ALL"]
    ],

    "Nova": [
        ["Hyper Beast","ALL"],
        ["Koi","ALL"],
        ["Antique","ALL"],
        ["Toy Soldier","ALL"],
        ["Clear Polymer","ALL"],
        ["Bloomstick","ALL"]
    ],

    "XM1014": [
        ["Entombed","ALL"],
        ["Incinegator","ALL"],
        ["XOXO","ALL"],
        ["Black Tie","ALL"],
        ["Seasons","ALL"],
        ["Tranquility","ALL"]
    ],

    "MAG-7": [
        ["Justice","ALL"],
        ["BI-POD","ALL"],
        ["SWAG-7","ALL"],
        ["Petroglyph","ALL"],
        ["Hard Water","ALL"],
        ["Heat","ALL"]
    ],

    "Sawed-Off": [
        ["The Kraken","T"],
        ["Wasteland Princess","T"],
        ["Devourer","T"],
        ["Apocalypto","T"],
        ["Serenity","T"],
        ["Kiss♥Love","T"]
    ],

    "M249": [
        ["Emerald Poison Dart","ALL"],
        ["Nebula Crusader","ALL"],
        ["Downtown","ALL"],
        ["Spectre","ALL"],
        ["Warbird","ALL"]
    ],

    "Negev": [
        ["Power Loader","ALL"],
        ["Mjölnir","ALL"],
        ["Lionfish","ALL"],
        ["Dazzle","ALL"],
        ["Prototype","ALL"],
        ["Terrain","ALL"]
    ]

};


/* =========================================================
   WEAPON CATEGORIES
   ========================================================= */

const weaponCategories = {

    PISTOL: [
        "Glock-18",
        "USP-S",
        "Desert Eagle",
        "P250"
    ],

    SMG: [
        "MAC-10",
        "MP9",
        "MP7",
        "MP5-SD",
        "UMP-45",
        "P90",
        "PP-Bizon"
    ],

    RIFLE: [
        "AK-47",
        "M4A4",
        "M4A1-S",
        "FAMAS",
        "Galil AR",
        "AUG",
        "SG 553"
    ],

    SHOTGUN: [
        "Nova",
        "XM1014",
        "MAG-7",
        "Sawed-Off",
        "M249",
        "Negev"
    ],

    SNIPER: [
        "AWP",
        "SSG 08",
        "SCAR-20",
        "G3SG1"
    ],

    KNIFE: [],
    GLOVE: []

};


/* =========================================================
   INIT
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        buildWeaponSelect();

        changeWeapon("AK-47");

        checkSteamLogin();

    }
);


/* =========================================================
   WEAPON SELECT
   ========================================================= */

function buildWeaponSelect(){

    const select =
        document.getElementById(
            "weaponSelect"
        );

    if(!select) return;

    select.innerHTML = "";

    Object.keys(skinData).forEach(
        weapon => {

            const option =
                document.createElement(
                    "option"
                );

            option.value = weapon;

            option.textContent = weapon;

            select.appendChild(option);

        }
    );

}


/* =========================================================
   CHANGE WEAPON
   ========================================================= */

function changeWeapon(weapon){

    currentWeapon = weapon;

    const select =
        document.getElementById(
            "weaponSelect"
        );

    if(select){
        select.value = weapon;
    }

    const title =
        document.getElementById(
            "weaponTitle"
        );

    if(title){
        title.textContent = weapon;
    }

    renderSkins();

}


/* =========================================================
   CATEGORY
   ========================================================= */

function weaponCategory(
    category,
    button
){

    currentCategory = category;

    document
        .querySelectorAll(
            ".weapon-tab"
        )
        .forEach(
            btn =>
                btn.classList.remove(
                    "active"
                )
        );

    if(button){
        button.classList.add(
            "active"
        );
    }

    const select =
        document.getElementById(
            "weaponSelect"
        );

    if(!select) return;

    let allowed;

    if(category === "ALL"){

        allowed =
            Object.keys(skinData);

    }else{

        allowed =
            weaponCategories[
                category
            ] || [];

    }

    select.innerHTML = "";

    allowed.forEach(
        weapon => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                weapon;

            option.textContent =
                weapon;

            select.appendChild(
                option
            );

        }
    );

    if(allowed.includes(currentWeapon)){

        select.value =
            currentWeapon;

    }else if(allowed.length){

        currentWeapon =
            allowed[0];

        select.value =
            currentWeapon;

    }

    renderSkins();

}


/* =========================================================
   TEAM
   ========================================================= */

function teamFilter(
    team,
    button
){

    currentTeam = team;

    document
        .querySelectorAll(
            ".team-switch button"
        )
        .forEach(
            btn =>
                btn.classList.remove(
                    "active"
                )
        );

    if(button){
        button.classList.add(
            "active"
        );
    }

    renderSkins();

}


/* =========================================================
   RENDER
   ========================================================= */

function renderSkins(){

    const grid =
        document.getElementById(
            "skinGrid"
        );

    if(!grid) return;

    const searchInput =
        document.getElementById(
            "skinSearch"
        );

    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";

    let skins =
        skinData[
            currentWeapon
        ] || [];


    if(currentTeam !== "ALL"){

        skins =
            skins.filter(
                skin =>
                    skin[1] === "ALL" ||
                    skin[1] === currentTeam
            );

    }


    if(search){

        skins =
            skins.filter(
                skin =>
                    skin[0]
                        .toLowerCase()
                        .includes(search)
            );

    }


    grid.innerHTML = "";


    const count =
        document.getElementById(
            "skinCount"
        );

    if(count){

        count.textContent =
            skins.length +
            " SKINS";

    }


    if(!skins.length){

        grid.innerHTML = `
            <div class="empty">
                <strong>NO SKINS FOUND</strong>
                <p>Өөр нэрээр хайж үзнэ үү.</p>
            </div>
        `;

        return;

    }


    skins.forEach(
        skin => {

            const name =
                skin[0];

            const team =
                skin[1];

            const card =
                document.createElement(
                    "button"
                );

            card.className =
                "skin-card";

            card.onclick =
                () =>
                    selectSkin(
                        currentWeapon,
                        name,
                        team,
                        card
                    );


            card.innerHTML = `

                <div class="skin-picture">

                    <div class="skin-watermark">
                        VYRE
                    </div>

                    <div class="skin-short">
                        ${weaponShort(
                            currentWeapon
                        )}
                    </div>

                </div>

                <div class="skin-info">

                    <small>
                        ${currentWeapon}
                    </small>

                    <strong>
                        ${name}
                    </strong>

                </div>

            `;

            grid.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   SHORT NAME
   ========================================================= */

function weaponShort(weapon){

    const map = {

        "AK-47":"AK",
        "M4A4":"M4",
        "M4A1-S":"M4S",
        "AWP":"AWP",
        "Glock-18":"G18",
        "USP-S":"USP",
        "Desert Eagle":"DE",
        "P250":"P250",
        "FAMAS":"FAM",
        "Galil AR":"GAL",
        "AUG":"AUG",
        "SG 553":"SG",
        "SSG 08":"SSG",
        "SCAR-20":"SC20",
        "G3SG1":"G3",
        "MAC-10":"M10",
        "MP9":"MP9",
        "MP7":"MP7",
        "MP5-SD":"MP5",
        "UMP-45":"UMP",
        "P90":"P90",
        "PP-Bizon":"BZN",
        "Nova":"NOV",
        "XM1014":"XM",
        "MAG-7":"MAG",
        "Sawed-Off":"SO",
        "M249":"M249",
        "Negev":"NEG"

    };

    return map[weapon] || "CS2";

}


/* =========================================================
   SELECT SKIN
   ========================================================= */

function selectSkin(
    weapon,
    skin,
    team,
    card
){

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


    if(selected){
        selected.textContent =
            skin;
    }

    if(selectedSmall){
        selectedSmall.textContent =
            skin;
    }

    if(selectedWeapon){
        selectedWeapon.textContent =
            weapon;
    }


    document
        .querySelectorAll(
            ".skin-card"
        )
        .forEach(
            item =>
                item.classList.remove(
                    "selected"
                )
        );


    if(card){
        card.classList.add(
            "selected"
        );
    }

}


/* =========================================================
   CLEAR
   ========================================================= */

function clearSelected(){

    selectedSkin = null;

    document.getElementById(
        "selectedSkin"
    ).textContent = "NONE";

    document.getElementById(
        "selectedSkinSmall"
    ).textContent = "NONE";

    document.getElementById(
        "selectedWeapon"
    ).textContent = "—";

    document
        .querySelectorAll(
            ".skin-card"
        )
        .forEach(
            card =>
                card.classList.remove(
                    "selected"
                )
        );

}


/* =========================================================
   MAIN CATEGORY
   ========================================================= */

function skinCategory(
    category,
    button
){

    document
        .querySelectorAll(
            ".skin-tab"
        )
        .forEach(
            tab =>
                tab.classList.remove(
                    "active"
                )
        );

    if(button){
        button.classList.add(
            "active"
        );
    }


    const weapons =
        document.getElementById(
            "weaponArea"
        );

    const other =
        document.getElementById(
            "otherArea"
        );


    if(category === "weapons"){

        weapons.style.display =
            "block";

        other.style.display =
            "none";

        return;

    }


    weapons.style.display =
        "none";

    other.style.display =
        "block";


    const title =
        document.getElementById(
            "otherTitle"
        );

    const message =
        document.getElementById(
            "otherMessage"
        );


    const names = {

        agents:"АГЕНТ",
        music:"ХӨГЖИМ",
        medals:"МЕДАЛЬ"

    };


    const name =
        names[category] ||
        category.toUpperCase();


    title.textContent =
        name;

    message.textContent =
        name +
        " COLLECTION";

}


/* =========================================================
   PLAYER
   ========================================================= */

async function loadPlayer(){

    const input =
        document.getElementById(
            "playerSearch"
        );

    if(!input) return;

    const value =
        input.value.trim();

    if(!value){

        alert(
            "PLAYER NAME / LINK / STEAMID ОРУУЛНА УУ."
        );

        return;

    }


    const match =
        value.match(
            /7656119\d{10}/
        );


    if(!match){

        alert(
            "SteamID64 эсвэл Steam profile link оруулна уу."
        );

        return;

    }


    const steamId =
        match[0];


    try{

        const response =
            await fetch(
                "/api/players/" +
                steamId
            );


        if(!response.ok){

            alert(
                "PLAYER ОЛДСОНГҮЙ."
            );

            return;

        }


        const player =
            await response.json();


        showPlayer(
            player
        );


    }catch(error){

        console.error(
            error
        );

        alert(
            "PLAYER LOAD АЛДАА."
        );

    }

}


/* =========================================================
   SHOW PLAYER
   ========================================================= */

function showPlayer(player){

    const disconnected =
        document.getElementById(
            "steamDisconnected"
        );

    const connected =
        document.getElementById(
            "steamConnected"
        );

    const name =
        document.getElementById(
            "steamName"
        );

    const avatar =
        document.getElementById(
            "steamAvatar"
        );


    if(disconnected)
        disconnected.style.display =
            "none";

    if(connected)
        connected.style.display =
            "flex";


    if(name){

        name.textContent =
            player.name ||
            player.steam_name ||
            "Steam User";

    }


    if(
        avatar &&
        player.avatar
    ){

        avatar.innerHTML = `
            <img
                src="${player.avatar}"
                alt=""
            >
        `;

    }

}


/* =========================================================
   STEAM LOGIN
   ========================================================= */

function steamLogin(){

    window.location.href =
        "/api/auth/steam";

}


/* =========================================================
   STEAM CHECK
   ========================================================= */

async function checkSteamLogin(){

    try{

        const response =
            await fetch(
                "/api/auth/me"
            );

        const data =
            await response.json();


        if(!data.loggedIn)
            return;


        const disconnected =
            document.getElementById(
                "steamDisconnected"
            );

        const connected =
            document.getElementById(
                "steamConnected"
            );

        const name =
            document.getElementById(
                "steamName"
            );

        const avatar =
            document.getElementById(
                "steamAvatar"
            );


        if(disconnected)
            disconnected.style.display =
                "none";

        if(connected)
            connected.style.display =
                "flex";


        if(
            name &&
            data.user
        ){

            name.textContent =
                data.user.name ||
                "Steam User";

        }


        if(
            avatar &&
            data.user &&
            data.user.avatar
        ){

            avatar.innerHTML = `
                <img
                    src="${data.user.avatar}"
                    alt=""
                >
            `;

        }

    }catch(error){

        console.error(
            "Steam auth check failed:",
            error
        );

    }

}


/* =========================================================
   SAVE
   ========================================================= */

function saveLoadout(){

    if(!selectedSkin){

        alert(
            "SELECT A SKIN FIRST."
        );

        return;

    }


    alert(
        "LOADOUT SAVED\n\n" +
        selectedSkin.weapon +
        " | " +
        selectedSkin.skin
    );

}
