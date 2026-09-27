<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>SKINCHANGER — VYRE.MN</title>

    <link rel="stylesheet" href="/style.css">

    <style>

        /* =====================================================
           VYRE.MN — LEET STYLE SKINCHANGER
           ===================================================== */

        .skin-page {
            padding: 30px 34px 60px;
        }

        .skin-head {
            margin-bottom: 25px;
        }

        .skin-eyebrow {
            font-size: 11px;
            letter-spacing: 3px;
            opacity: .45;
            margin-bottom: 8px;
        }

        .skin-head h1 {
            margin: 0;
            font-size: 32px;
            letter-spacing: -1px;
        }

        .skin-head p {
            margin-top: 8px;
            color: rgba(255,255,255,.48);
            font-size: 13px;
        }

        /* PLAYER */

        .skin-player {
            display: flex;
            gap: 10px;
            margin-bottom: 18px;
        }

        .skin-player input {
            flex: 1;
            height: 48px;
            padding: 0 16px;

            background: rgba(255,255,255,.035);
            border: 1px solid rgba(255,255,255,.08);
            color: white;

            outline: none;
            border-radius: 6px;

            font-size: 13px;
        }

        .skin-player input:focus {
            border-color: rgba(255,255,255,.22);
        }

        .skin-player button {
            width: 110px;
            border: 0;
            border-radius: 6px;

            background: white;
            color: black;

            font-weight: 800;
            cursor: pointer;
        }

        /* MAIN TABS */

        .skin-main-tabs {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-bottom: 18px;
        }

        .skin-main-tab {
            min-height: 65px;

            background: rgba(255,255,255,.025);
            border: 1px solid rgba(255,255,255,.07);

            color: rgba(255,255,255,.5);
            border-radius: 6px;

            cursor: pointer;
            text-align: left;

            padding: 12px 15px;

            transition: .2s;
        }

        .skin-main-tab strong {
            display: block;
            color: white;
            font-size: 13px;
            margin-bottom: 4px;
        }

        .skin-main-tab span {
            font-size: 10px;
            opacity: .5;
        }

        .skin-main-tab:hover {
            border-color: rgba(255,255,255,.18);
        }

        .skin-main-tab.active {
            background: rgba(255,255,255,.08);
            border-color: rgba(255,255,255,.25);
        }

        /* TEAM + SEARCH */

        .skin-controls {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }

        .team-buttons {
            display: flex;
            background: rgba(255,255,255,.035);
            border: 1px solid rgba(255,255,255,.07);
            border-radius: 6px;
            padding: 3px;
        }

        .team-buttons button {
            border: 0;
            background: transparent;
            color: rgba(255,255,255,.45);

            padding: 9px 18px;
            border-radius: 4px;

            cursor: pointer;
            font-weight: 700;
            font-size: 11px;
        }

        .team-buttons button.active {
            background: white;
            color: black;
        }

        .skin-search-box {
            flex: 1;
            position: relative;
        }

        .skin-search-box span {
            position: absolute;
            left: 14px;
            top: 13px;
            opacity: .45;
        }

        .skin-search-box input {
            width: 100%;
            height: 42px;

            box-sizing: border-box;

            padding: 0 14px 0 38px;

            background: rgba(255,255,255,.035);
            border: 1px solid rgba(255,255,255,.07);

            color: white;
            outline: none;

            border-radius: 6px;
        }

        /* WEAPON CATEGORIES */

        .weapon-categories {
            display: flex;
            gap: 7px;
            overflow-x: auto;

            padding-bottom: 5px;
            margin-bottom: 20px;
        }

        .weapon-category {
            white-space: nowrap;

            border: 1px solid rgba(255,255,255,.07);
            background: rgba(255,255,255,.025);

            color: rgba(255,255,255,.5);

            padding: 10px 14px;
            border-radius: 5px;

            cursor: pointer;
            font-size: 10px;
            font-weight: 700;
        }

        .weapon-category:hover {
            color: white;
        }

        .weapon-category.active {
            background: rgba(255,255,255,.1);
            color: white;
            border-color: rgba(255,255,255,.2);
        }

        /* COLLECTION HEADER */

        .collection-bar {
            display: flex;
            justify-content: space-between;
            align-items: end;

            margin-bottom: 12px;
        }

        .collection-bar small {
            color: rgba(255,255,255,.35);
            font-size: 10px;
        }

        .collection-bar strong {
            font-size: 15px;
        }

        /* WEAPON SELECT */

        .weapon-select-row {
            margin-bottom: 15px;
        }

        .weapon-select-row select {
            width: 100%;
            height: 42px;

            background: #111;
            color: white;

            border: 1px solid rgba(255,255,255,.08);
            border-radius: 5px;

            padding: 0 12px;
            outline: none;
        }

        /* SKIN GRID */

        .mirage-style-grid {
            display: grid;

            grid-template-columns:
                repeat(auto-fill, minmax(190px, 1fr));

            gap: 10px;
        }

        .mirage-skin-card {
            position: relative;

            padding: 0;

            background: rgba(255,255,255,.025);

            border: 1px solid rgba(255,255,255,.065);
            border-radius: 7px;

            overflow: hidden;

            text-align: left;

            cursor: pointer;

            color: white;

            transition:
                transform .18s,
                border-color .18s,
                background .18s;
        }

        .mirage-skin-card:hover {
            transform: translateY(-2px);
            border-color: rgba(255,255,255,.2);
            background: rgba(255,255,255,.05);
        }

        .mirage-skin-card.selected {
            border-color: white;
            box-shadow: 0 0 0 1px rgba(255,255,255,.12);
        }

        .skin-card-image {
            height: 125px;

            display: flex;
            align-items: center;
            justify-content: center;

            position: relative;

            background:
                radial-gradient(
                    circle at center,
                    rgba(255,255,255,.08),
                    rgba(255,255,255,.015) 65%
                );
        }

        .skin-watermark {
            font-size: 28px;
            font-weight: 900;
            letter-spacing: 5px;
            opacity: .08;
        }

        .weapon-label {
            position: absolute;
            right: 9px;
            top: 8px;

            font-size: 9px;
            opacity: .4;
            font-weight: 800;
        }

        .skin-card-info {
            padding: 12px;
            border-top: 1px solid rgba(255,255,255,.055);
        }

        .skin-card-info small {
            display: block;

            font-size: 9px;
            color: rgba(255,255,255,.35);

            margin-bottom: 5px;
            text-transform: uppercase;
        }

        .skin-card-info strong {
            display: block;
            font-size: 13px;
            color: white;
        }

        /* EMPTY */

        .skin-empty {
            grid-column: 1 / -1;

            padding: 60px 20px;
            text-align: center;

            border: 1px dashed rgba(255,255,255,.1);
            border-radius: 7px;
        }

        .skin-empty strong {
            display: block;
            font-size: 13px;
        }

        .skin-empty span {
            display: block;
            margin-top: 7px;
            font-size: 11px;
            opacity: .4;
        }

        /* SELECTED */

        .selected-loadout {
            margin-top: 25px;

            border-top: 1px solid rgba(255,255,255,.08);
            padding-top: 22px;
        }

        .selected-title {
            display: flex;
            justify-content: space-between;
            align-items: center;

            margin-bottom: 12px;
        }

        .selected-title span {
            display: block;
            font-size: 9px;
            opacity: .4;
            letter-spacing: 1.5px;
        }

        .selected-title strong {
            display: block;
            margin-top: 4px;
            font-size: 15px;
        }

        .selected-title button {
            background: transparent;
            border: 1px solid rgba(255,255,255,.08);
            color: rgba(255,255,255,.5);

            border-radius: 4px;

            padding: 7px 12px;
            cursor: pointer;
        }

        .selected-card {
            display: flex;

            min-height: 120px;

            background: rgba(255,255,255,.025);
            border: 1px solid rgba(255,255,255,.07);

            border-radius: 7px;
            overflow: hidden;
        }

        .selected-image {
            width: 190px;

            display: flex;
            align-items: center;
            justify-content: center;

            background:
                radial-gradient(
                    circle,
                    rgba(255,255,255,.09),
                    rgba(255,255,255,.01)
                );

            font-size: 25px;
            font-weight: 900;
            letter-spacing: 5px;
            opacity: .6;
        }

        .selected-info {
            padding: 20px;
        }

        .selected-info small {
            display: block;
            font-size: 9px;
            opacity: .35;
            margin-bottom: 4px;
            margin-top: 7px;
        }

        .selected-info small:first-child {
            margin-top: 0;
        }

        .selected-info strong {
            font-size: 14px;
        }

        /* EXTRA SETTINGS */

        .skin-settings {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-top: 10px;
        }

        .skin-setting {
            padding: 12px;

            background: rgba(255,255,255,.025);
            border: 1px solid rgba(255,255,255,.06);

            border-radius: 5px;
        }

        .skin-setting span {
            display: block;
            font-size: 9px;
            opacity: .35;
            margin-bottom: 5px;
        }

        .skin-setting strong {
            font-size: 12px;
        }

        /* STEAM */

        .steam-loadout {
            margin-top: 10px;

            padding: 15px;

            background: rgba(255,255,255,.02);
            border: 1px solid rgba(255,255,255,.06);

            border-radius: 6px;
        }

        .steam-loadout-header {
            font-size: 9px;
            opacity: .35;
            letter-spacing: 1.5px;
            margin-bottom: 12px;
        }

        .steam-user-row {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .steam-circle {
            width: 38px;
            height: 38px;

            display: flex;
            align-items: center;
            justify-content: center;

            background: rgba(255,255,255,.07);
            border-radius: 50%;

            font-weight: 900;
        }

        .steam-user-row strong {
            display: block;
            font-size: 12px;
        }

        .steam-user-row small {
            display: block;
            margin-top: 3px;
            opacity: .4;
            font-size: 9px;
        }

        .steam-connect {
            margin-top: 14px;

            width: 100%;
            height: 40px;

            border: 1px solid rgba(255,255,255,.1);
            background: rgba(255,255,255,.04);

            color: white;

            border-radius: 5px;
            cursor: pointer;

            font-size: 10px;
            font-weight: 800;
        }

        .save-loadout {
            width: 100%;
            height: 48px;

            margin-top: 10px;

            border: 0;
            border-radius: 5px;

            background: white;
            color: black;

            font-weight: 900;
            cursor: pointer;
        }

        .save-loadout span {
            float: right;
            margin-right: 5px;
        }

        /* OTHER */

        .other-area {
            padding: 35px 0;
        }

        .other-header span {
            font-size: 9px;
            opacity: .4;
            letter-spacing: 2px;
        }

        .other-header h2 {
            margin: 6px 0 0;
        }

        .other-empty {
            margin-top: 15px;

            padding: 60px 20px;
            text-align: center;

            border: 1px dashed rgba(255,255,255,.1);
            border-radius: 7px;
        }

        .other-empty div {
            font-size: 25px;
            opacity: .3;
        }

        .other-empty strong {
            display: block;
            margin-top: 10px;
        }

        .other-empty p {
            font-size: 11px;
            opacity: .35;
        }

        /* RESPONSIVE */

        @media(max-width: 800px) {

            .skin-page {
                padding: 20px;
            }

            .skin-main-tabs {
                grid-template-columns: repeat(2, 1fr);
            }

            .skin-controls {
                flex-direction: column;
            }

            .skin-settings {
                grid-template-columns: repeat(2, 1fr);
            }

            .selected-image {
                width: 130px;
            }

        }

        @media(max-width: 500px) {

            .skin-main-tabs {
                grid-template-columns: 1fr;
            }

            .mirage-style-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .selected-card {
                flex-direction: column;
            }

            .selected-image {
                width: 100%;
                height: 100px;
            }

        }

    </style>
</head>


<body>

<div class="app">

    <!-- =====================================================
         SIDEBAR
         ===================================================== -->

    <aside class="sidebar">

        <div class="brand">

            <div class="brand-mark">
                V
            </div>

            <div>
                <strong>VYRE</strong>
                <span>.MN</span>
            </div>

        </div>


        <div class="sidebar-label">
            NAVIGATION
        </div>


        <nav class="nav">

            <a href="/" class="nav-item">
                <span>⌂</span>
                HOME
            </a>

            <a href="/servers" class="nav-item">
                <span>▣</span>
                SERVERS
            </a>

            <a href="/skins" class="nav-item active">
                <span>◈</span>
                SKINCHANGER
            </a>

            <a href="/leaderboard" class="nav-item">
                <span>♛</span>
                LEADERBOARD
            </a>

            <a href="/players" class="nav-item">
                <span>◉</span>
                PLAYERS
            </a>

            <a href="/clans" class="nav-item">
                <span>◆</span>
                CLANS
            </a>

            <a
                href="https://discord.gg/mAa7dct57"
                target="_blank"
                rel="noopener noreferrer"
                class="nav-item"
            >
                <span>◌</span>
                DISCORD
            </a>

        </nav>


        <div class="sidebar-bottom">

            <div class="sidebar-status">
                <span class="status-dot"></span>
                VYRE NETWORK ONLINE
            </div>


            <button
                class="steam-login"
                onclick="steamLogin()"
            >
                STEAM LOGIN
                <span>↗</span>
            </button>

        </div>

    </aside>


    <!-- =====================================================
         MAIN
         ===================================================== -->

    <main class="main">


        <header class="topbar">

            <div class="topbar-left">

                <span class="page-location">
                    VYRE.MN
                </span>

                <span class="slash">
                    /
                </span>

                <span class="page-current">
                    SKINCHANGER
                </span>

            </div>


            <div class="topbar-right">

                <div class="network-indicator">

                    <span></span>
                    ONLINE

                </div>


                <button
                    class="top-steam"
                    onclick="steamLogin()"
                >
                    STEAM LOGIN
                </button>

            </div>

        </header>


        <!-- =================================================
             SKIN PAGE
             ================================================= -->

        <section class="skin-page">


            <div class="skin-head">

                <div class="skin-eyebrow">
                    VYRE.MN / LOADOUT
                </div>

                <h1>
                    SKINCHANGER
                </h1>

                <p>
                    Customize your Counter-Strike 2 loadout.
                </p>

            </div>


            <!-- PLAYER SEARCH -->

            <div class="skin-player">

                <input
                    id="playerSearch"
                    type="text"
                    placeholder="PLAYER NAME / LINK / STEAMID"
                >

                <button
                    onclick="loadPlayer()"
                >
                    LOAD
                </button>

            </div>


            <!-- MAIN CATEGORIES -->

            <div class="skin-main-tabs">


                <button
                    class="skin-main-tab active"
                    onclick="skinCategory('weapons', this)"
                >

                    <strong>
                        SKIN
                    </strong>

                    <span>
                        Зэвсгийн skin сонгох
                    </span>

                </button>


                <button
                    class="skin-main-tab"
                    onclick="skinCategory('agents', this)"
                >

                    <strong>
                        AGENT
                    </strong>

                    <span>
                        Agent сонгох
                    </span>

                </button>


                <button
                    class="skin-main-tab"
                    onclick="skinCategory('music', this)"
                >

                    <strong>
                        MUSIC
                    </strong>

                    <span>
                        Music kit сонгох
                    </span>

                </button>


                <button
                    class="skin-main-tab"
                    onclick="skinCategory('medals', this)"
                >

                    <strong>
                        MEDAL
                    </strong>

                    <span>
                        Medal сонгох
                    </span>

                </button>

            </div>


            <!-- WEAPON AREA -->

            <div id="weaponArea">


                <!-- TEAM + SEARCH -->

                <div class="skin-controls">


                    <div class="team-buttons">

                        <button
                            class="active"
                            onclick="teamFilter('ALL', this)"
                        >
                            ALL
                        </button>

                        <button
                            onclick="teamFilter('T', this)"
                        >
                            T
                        </button>

                        <button
                            onclick="teamFilter('CT', this)"
                        >
                            CT
                        </button>

                    </div>


                    <div class="skin-search-box">

                        <span>
                            ⌕
                        </span>

                        <input
                            id="skinSearch"
                            type="text"
                            placeholder="Нэрээр хайх..."
                            oninput="searchSkins()"
                        >

                    </div>

                </div>


                <!-- WEAPON CATEGORIES -->

                <div class="weapon-categories">


                    <button
                        class="weapon-category active"
                        onclick="weaponCategory('ALL', this)"
                    >
                        БҮХ ЗЭВСЭГ
                    </button>


                    <button
                        class="weapon-category"
                        onclick="weaponCategory('PISTOL', this)"
                    >
                        ГАР БУУ
                    </button>


                    <button
                        class="weapon-category"
                        onclick="weaponCategory('SMG', this)"
                    >
                        ХАГАС АВТОМАТ
                    </button>


                    <button
                        class="weapon-category"
                        onclick="weaponCategory('RIFLE', this)"
                    >
                        ВИНТОВ
                    </button>


                    <button
                        class="weapon-category"
                        onclick="weaponCategory('SHOTGUN', this)"
                    >
                        АВТОМАТ / SHOTGUN
                    </button>


                    <button
                        class="weapon-category"
                        onclick="weaponCategory('SNIPER', this)"
                    >
                        SNIPER
                    </button>


                    <button
                        class="weapon-category"
                        onclick="weaponCategory('KNIFE', this)"
                    >
                        ХУТГА
                    </button>


                    <button
                        class="weapon-category"
                        onclick="weaponCategory('GLOVE', this)"
                    >
                        БЭЭЛИЙ
                    </button>

                </div>


                <!-- WEAPON -->

                <div class="weapon-select-row">

                    <select
                        id="weaponSelect"
                        onchange="changeWeapon(this.value)"
                    >

                        <option value="AK-47">
                            AK-47
                        </option>

                        <option value="M4A4">
                            M4A4
                        </option>

                        <option value="M4A1-S">
                            M4A1-S
                        </option>

                        <option value="AWP">
                            AWP
                        </option>

                        <option value="Glock-18">
                            Glock-18
                        </option>

                        <option value="USP-S">
                            USP-S
                        </option>

                        <option value="Desert Eagle">
                            Desert Eagle
                        </option>

                        <option value="P250">
                            P250
                        </option>

                        <option value="FAMAS">
                            FAMAS
                        </option>

                        <option value="Galil AR">
                            Galil AR
                        </option>

                        <option value="AUG">
                            AUG
                        </option>

                        <option value="SG 553">
                            SG 553
                        </option>

                        <option value="SSG 08">
                            SSG 08
                        </option>

                        <option value="SCAR-20">
                            SCAR-20
                        </option>

                        <option value="G3SG1">
                            G3SG1
                        </option>

                        <option value="MAC-10">
                            MAC-10
                        </option>

                        <option value="MP9">
                            MP9
                        </option>

                        <option value="MP7">
                            MP7
                        </option>

                        <option value="MP5-SD">
                            MP5-SD
                        </option>

                        <option value="UMP-45">
                            UMP-45
                        </option>

                        <option value="P90">
                            P90
                        </option>

                        <option value="PP-Bizon">
                            PP-Bizon
                        </option>

                        <option value="Nova">
                            Nova
                        </option>

                        <option value="XM1014">
                            XM1014
                        </option>

                        <option value="MAG-7">
                            MAG-7
                        </option>

                        <option value="Sawed-Off">
                            Sawed-Off
                        </option>

                        <option value="M249">
                            M249
                        </option>

                        <option value="Negev">
                            Negev
                        </option>

                    </select>

                </div>


                <!-- COLLECTION -->

                <div class="collection-bar">

                    <div>

                        <small>
                            SKIN COLLECTION
                        </small>

                        <br>

                        <strong id="weaponTitle">
                            AK-47
                        </strong>

                    </div>


                    <small id="skinCount">
                        0 SKINS
                    </small>

                </div>


                <div
                    id="skinGrid"
                    class="mirage-style-grid"
                ></div>

            </div>


            <!-- OTHER -->

            <div
                id="otherArea"
                class="other-area"
                style="display:none;"
            >

                <div class="other-header">

                    <span>
                        COLLECTION
                    </span>

                    <h2 id="otherTitle">
                        AGENTS
                    </h2>

                </div>


                <div class="other-empty">

                    <div>
                        ◈
                    </div>

                    <strong id="otherMessage">
                        AGENTS COLLECTION
                    </strong>

                    <p>
                        Collection will be available here.
                    </p>

                </div>

            </div>


            <!-- SELECTED -->

            <div class="selected-loadout">


                <div class="selected-title">

                    <div>

                        <span>
                            СКИНЫН НЭМЭЛТ ТОХИРГОО
                        </span>

                        <strong id="selectedSkin">
                            NONE
                        </strong>

                    </div>


                    <button
                        onclick="clearSelected()"
                    >
                        CLEAR
                    </button>

                </div>


                <div
                    id="selectedCard"
                    class="selected-card"
                >

                    <div class="selected-image">
                        VYRE
                    </div>


                    <div class="selected-info">

                        <small>
                            WEAPON
                        </small>

                        <strong id="selectedWeapon">
                            —
                        </strong>


                        <small>
                            SKIN
                        </small>

                        <strong id="selectedSkinSmall">
                            NONE
                        </strong>

                    </div>

                </div>


                <!-- EXTRA SETTINGS -->

                <div class="skin-settings">

                    <div class="skin-setting">
                        <span>WEAR</span>
                        <strong id="settingWear">
                            FACTORY NEW
                        </strong>
                    </div>

                    <div class="skin-setting">
                        <span>FLOAT</span>
                        <strong id="settingFloat">
                            0.000
                        </strong>
                    </div>

                    <div class="skin-setting">
                        <span>PATTERN</span>
                        <strong id="settingPattern">
                            0
                        </strong>
                    </div>

                    <div class="skin-setting">
                        <span>STATTRAK</span>
                        <strong id="settingStatTrak">
                            NO
                        </strong>
                    </div>

                </div>


                <!-- STEAM -->

                <div class="steam-loadout">

                    <div class="steam-loadout-header">
                        STEAM ACCOUNT
                    </div>


                    <div
                        id="steamDisconnected"
                        class="steam-user-row"
                    >

                        <div class="steam-circle">
                            S
                        </div>


                        <div>

                            <strong>
                                NOT CONNECTED
                            </strong>

                            <small>
                                Connect Steam to use skins
                            </small>

                        </div>

                    </div>


                    <div
                        id="steamConnected"
                        class="steam-user-row"
                        style="display:none;"
                    >

                        <div class="steam-circle">
                            S
                        </div>


                        <div>

                            <strong id="steamName">
                                Steam User
                            </strong>

                            <small>
                                CONNECTED
                            </small>

                        </div>

                    </div>


                    <button
                        class="steam-connect"
                        onclick="steamLogin()"
                    >
                        CONNECT STEAM
                    </button>

                </div>


                <button
                    class="save-loadout"
                    onclick="saveLoadout()"
                >

                    SAVE LOADOUT

                    <span>
                        →
                    </span>

                </button>

            </div>

        </section>


        <footer class="footer">

            <div>
                <strong>VYRE.MN</strong>
                <span>CS2 COMMUNITY</span>
            </div>

            <div>
                © 2026 VYRE.MN
            </div>

        </footer>

    </main>

</div>


<script src="/script.js"></script>

</body>
</html>
