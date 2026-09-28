// skins-api.js - VYRE.MN skinchanger API
// Mounted in server.js: app.use("/api/skins", require("./skins-api")(db));
const express = require("express");

const BASE_URL =
    "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/base_weapons.json";
const CATALOG_URL =
    "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json";

// CS2 weapon item definition indexes
const DEFINDEX = {
    weapon_deagle: 1, weapon_elite: 2, weapon_fiveseven: 3, weapon_glock: 4,
    weapon_ak47: 7, weapon_aug: 8, weapon_awp: 9, weapon_famas: 10,
    weapon_g3sg1: 11, weapon_galilar: 13, weapon_m249: 14, weapon_m4a1: 16,
    weapon_mac10: 17, weapon_p90: 19, weapon_mp5sd: 23, weapon_ump45: 24,
    weapon_xm1014: 25, weapon_bizon: 26, weapon_mag7: 27, weapon_negev: 28,
    weapon_sawedoff: 29, weapon_tec9: 30, weapon_hkp2000: 32, weapon_mp7: 33,
    weapon_mp9: 34, weapon_nova: 35, weapon_p250: 36, weapon_scar20: 38,
    weapon_sg556: 39, weapon_ssg08: 40, weapon_m4a1_silencer: 60,
    weapon_usp_silencer: 61, weapon_cz75a: 63, weapon_revolver: 64,
};

// Weapon groups shown as filters on the site
const GROUP_OF = {};
[[1, 2, 3, 4, 30, 32, 36, 61, 63, 64], [17, 19, 23, 24, 26, 33, 34],
 [14, 25, 27, 28, 29, 35], [7, 8, 9, 10, 11, 13, 16, 38, 39, 40, 60]]
    .forEach((ids, i) => ids.forEach(id => (GROUP_OF[id] = ["pistols", "smgs", "heavy", "rifles"][i])));

// Knife class name -> item definition index
const KNIFE_DEFINDEX = {
    weapon_bayonet: 500, weapon_knife_css: 503, weapon_knife_flip: 505,
    weapon_knife_gut: 506, weapon_knife_karambit: 507, weapon_knife_m9_bayonet: 508,
    weapon_knife_tactical: 509, weapon_knife_falchion: 512, weapon_knife_survival_bowie: 514,
    weapon_knife_butterfly: 515, weapon_knife_push: 516, weapon_knife_cord: 517,
    weapon_knife_canis: 518, weapon_knife_ursus: 519, weapon_knife_gypsy_jackknife: 520,
    weapon_knife_outdoor: 521, weapon_knife_stiletto: 522, weapon_knife_widowmaker: 523,
    weapon_knife_skeleton: 525, weapon_knife_kukri: 526,
};
const KNIFE_CLASS = Object.fromEntries(Object.entries(KNIFE_DEFINDEX).map(([c, d]) => [d, c]));

// Glove name -> item definition index (used if the catalog has no numeric id)
const GLOVE_DEFINDEX = {
    "Broken Fang Gloves": 4725, "Bloodhound Gloves": 5027, "Sport Gloves": 5030,
    "Driver Gloves": 5031, "Hand Wraps": 5032, "Moto Gloves": 5033,
    "Specialist Gloves": 5034, "Hydra Gloves": 5035,
};
const GLOVE_IDS = new Set(Object.values(GLOVE_DEFINDEX));

module.exports = function skinsRouter(db) {
    const router = express.Router();

    // Column names match the cs2-WeaponPaints plugin (team 2 = T, 3 = CT)
    db.exec(`CREATE TABLE IF NOT EXISTS wp_player_skins (
        steamid TEXT NOT NULL,
        weapon_team INTEGER NOT NULL,
        weapon_defindex INTEGER NOT NULL,
        weapon_paint_id INTEGER NOT NULL,
        weapon_wear REAL NOT NULL DEFAULT 0.000001,
        weapon_seed INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (steamid, weapon_team, weapon_defindex)
    )`);

    // Equipped knife / gloves per team (cs2-WeaponPaints layout).
    // The knife's / gloves' paint itself lives in wp_player_skins under their defindex.
    db.exec(`CREATE TABLE IF NOT EXISTS wp_player_knife (
        steamid TEXT NOT NULL,
        weapon_team INTEGER NOT NULL,
        knife TEXT NOT NULL,
        PRIMARY KEY (steamid, weapon_team)
    )`);
    db.exec(`CREATE TABLE IF NOT EXISTS wp_player_gloves (
        steamid TEXT NOT NULL,
        weapon_team INTEGER NOT NULL,
        weapon_defindex INTEGER NOT NULL,
        PRIMARY KEY (steamid, weapon_team)
    )`);

    let catalog = { weapons: [], valid: new Set(), byDef: new Map() };
    let loading = null;

    async function loadCatalog() {
        const res = await fetch(CATALOG_URL);
        if (!res.ok) throw new Error("catalog HTTP " + res.status);
        const skins = await res.json();

        // default (skinless) weapon pictures; optional, falls back to a skin picture
        const baseImg = {};
        try {
            const b = await fetch(BASE_URL);
            if (b.ok) for (const x of await b.json()) {
                if (!x.image) continue;
                if (x.id) baseImg[x.id] = x.image;
                if (x.name) baseImg[x.name] = x.image;
            }
        } catch { /* ignore */ }

        const byWeapon = new Map();
        const valid = new Set();

        for (const s of skins) {
            const w = s.weapon || {};
            const cat = (s.category && s.category.id) || "";
            const paint = Number(s.paint_index);
            if (!paint) continue;

            let kind, defindex;
            if (KNIFE_DEFINDEX[w.id]) {
                kind = "knife"; defindex = KNIFE_DEFINDEX[w.id];
            } else if (cat.includes("gloves") || /gloves|hand wraps/i.test(w.name || "")) {
                kind = "gloves"; defindex = GLOVE_DEFINDEX[w.name] || Number(w.weapon_id) || 0;
                if (!GLOVE_IDS.has(defindex)) continue;
            } else if (DEFINDEX[w.id]) {
                kind = "weapon"; defindex = DEFINDEX[w.id];
            } else {
                continue;
            }

            if (!byWeapon.has(defindex)) {
                byWeapon.set(defindex, { defindex, name: w.name, kind, skins: [] });
            }
            byWeapon.get(defindex).skins.push({
                paint,
                name: String(s.name).split("|").slice(1).join("|").trim() || String(s.name),
                image: s.image,
                color: (s.rarity && s.rarity.color) || null,
            });
            valid.add(defindex + ":" + paint);
        }

        const weapons = [...byWeapon.values()].sort((a, b) => a.name.localeCompare(b.name));
        const classOf = d => KNIFE_CLASS[d] || Object.keys(DEFINDEX).find(k => DEFINDEX[k] === d);
        weapons.forEach(w => {
            w.skins.sort((a, b) => a.name.localeCompare(b.name));
            w.group = w.kind === "knife" ? "knives" : w.kind === "gloves" ? "gloves" : GROUP_OF[w.defindex] || "rifles";
            w.image = (w.kind !== "gloves" && (baseImg[classOf(w.defindex)] || baseImg[w.name])) ||
                (w.skins.find(x => x.image) || {}).image || null;
            if (w.kind === "knife") {
                // plain knife without a finish
                w.skins.unshift({ paint: 0, name: "Vanilla", image: null, color: null });
                valid.add(w.defindex + ":0");
            }
        });
        catalog = { weapons, valid, byDef: new Map(weapons.map(w => [w.defindex, w])) };
    }

    function ensureCatalog() {
        if (!loading) {
            loading = loadCatalog().catch(err => { loading = null; throw err; });
        }
        return loading;
    }
    ensureCatalog().catch(err => console.error("[skins] catalog load failed:", err.message));

    const needLogin = (req, res, next) =>
        req.isAuthenticated() && req.user.steam_id
            ? next()
            : res.status(401).json({ error: "Steam login required" });

    router.get("/catalog", async (req, res) => {
        try {
            await ensureCatalog();
            res.set("Cache-Control", "public, max-age=3600");
            res.json(catalog.weapons);
        } catch {
            res.status(503).json({ error: "Skin catalog unavailable, try again later" });
        }
    });

    router.get("/mine", needLogin, (req, res) => {
        const sid = req.user.steam_id;
        const rows = db.prepare(
            `SELECT weapon_team, weapon_defindex, weapon_paint_id, weapon_wear, weapon_seed
             FROM wp_player_skins WHERE steamid = ?`
        ).all(sid);
        const knives = new Map(db.prepare(
            "SELECT weapon_team, knife FROM wp_player_knife WHERE steamid = ?"
        ).all(sid).map(r => [r.weapon_team, r.knife]));
        const gloves = new Map(db.prepare(
            "SELECT weapon_team, weapon_defindex FROM wp_player_gloves WHERE steamid = ?"
        ).all(sid).map(r => [r.weapon_team, r.weapon_defindex]));

        res.json(rows.map(r => ({
            ...r,
            equipped: KNIFE_CLASS[r.weapon_defindex]
                ? knives.get(r.weapon_team) === KNIFE_CLASS[r.weapon_defindex]
                : GLOVE_IDS.has(r.weapon_defindex)
                    ? gloves.get(r.weapon_team) === r.weapon_defindex
                    : true,
        })));
    });

    // body: { defindex, paint, team (0 = both, 2 = T, 3 = CT), wear, seed }
    router.post("/select", needLogin, express.json(), async (req, res) => {
        try { await ensureCatalog(); }
        catch { return res.status(503).json({ error: "Skin catalog unavailable" }); }

        const defindex = Number(req.body.defindex);
        const paint = Number(req.body.paint);
        if (!catalog.valid.has(defindex + ":" + paint)) {
            return res.status(400).json({ error: "Unknown skin" });
        }

        const team = Number(req.body.team);
        const teams = team === 2 ? [2] : team === 3 ? [3] : [2, 3];
        const wear = Math.min(1, Math.max(0.000001, Number(req.body.wear) || 0.000001));
        const seed = Math.min(1000, Math.max(0, parseInt(req.body.seed, 10) || 0));

        const upsert = db.prepare(
            `INSERT INTO wp_player_skins
                (steamid, weapon_team, weapon_defindex, weapon_paint_id, weapon_wear, weapon_seed)
             VALUES (?, ?, ?, ?, ?, ?)
             ON CONFLICT (steamid, weapon_team, weapon_defindex) DO UPDATE SET
                weapon_paint_id = excluded.weapon_paint_id,
                weapon_wear = excluded.weapon_wear,
                weapon_seed = excluded.weapon_seed`
        );
        const kind = catalog.byDef.get(defindex).kind;
        const sid = req.user.steam_id;
        const equipKnife = db.prepare(
            `INSERT INTO wp_player_knife (steamid, weapon_team, knife) VALUES (?, ?, ?)
             ON CONFLICT (steamid, weapon_team) DO UPDATE SET knife = excluded.knife`
        );
        const equipGloves = db.prepare(
            `INSERT INTO wp_player_gloves (steamid, weapon_team, weapon_defindex) VALUES (?, ?, ?)
             ON CONFLICT (steamid, weapon_team) DO UPDATE SET weapon_defindex = excluded.weapon_defindex`
        );
        db.transaction(() => {
            for (const t of teams) {
                upsert.run(sid, t, defindex, paint, wear, seed);
                if (kind === "knife") equipKnife.run(sid, t, KNIFE_CLASS[defindex]);
                if (kind === "gloves") equipGloves.run(sid, t, defindex);
            }
        })();
        res.json({ ok: true });
    });

    // DELETE /api/skins/select/:defindex?team=0|2|3
    router.delete("/select/:defindex", needLogin, (req, res) => {
        const team = Number(req.query.team);
        const teams = team === 2 ? [2] : team === 3 ? [3] : [2, 3];
        const del = db.prepare(
            "DELETE FROM wp_player_skins WHERE steamid = ? AND weapon_defindex = ? AND weapon_team = ?"
        );
        const defindex = Number(req.params.defindex);
        const sid = req.user.steam_id;
        db.transaction(() => {
            for (const t of teams) {
                del.run(sid, defindex, t);
                if (KNIFE_CLASS[defindex]) {
                    db.prepare("DELETE FROM wp_player_knife WHERE steamid = ? AND weapon_team = ? AND knife = ?")
                        .run(sid, t, KNIFE_CLASS[defindex]);
                }
                if (GLOVE_IDS.has(defindex)) {
                    db.prepare("DELETE FROM wp_player_gloves WHERE steamid = ? AND weapon_team = ? AND weapon_defindex = ?")
                        .run(sid, t, defindex);
                }
            }
        })();
        res.json({ ok: true });
    });

    return router;
};
