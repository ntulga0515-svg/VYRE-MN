const express = require("express");
const path = require("path");
const Database = require("better-sqlite3");
const session = require("express-session");
const passport = require("passport");
const SteamStrategy = require("passport-steam").Strategy;

const app = express();
const PORT = process.env.PORT || 3000;


/* =========================================================
   DATABASE
   ========================================================= */

const db = new Database("vyre.db");

db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    steam_id TEXT UNIQUE,
    name TEXT NOT NULL,
    avatar TEXT,
    rank TEXT DEFAULT 'PLAYER',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS servers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    ip TEXT,
    port INTEGER,
    status TEXT DEFAULT 'offline'
);

CREATE TABLE IF NOT EXISTS bans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    steam_id TEXT NOT NULL,
    name TEXT,
    reason TEXT,
    admin_steam_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loadouts (
    steam_id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);


/* =========================================================
   DATABASE MIGRATION
   ========================================================= */

try {
    db.prepare("ALTER TABLE players ADD COLUMN avatar TEXT").run();
} catch (error) {
    // avatar column already exists
}


/* =========================================================
   SEED SERVERS
   ========================================================= */

const serverCount = db
    .prepare("SELECT COUNT(*) AS count FROM servers")
    .get().count;

if (serverCount === 0) {

    const insertServer = db.prepare(`
        INSERT INTO servers
        (name, type, ip, port, status)
        VALUES (?, ?, ?, ?, ?)
    `);

    insertServer.run(
        "VYRE DM #1",
        "Deathmatch",
        "vyre-mn.onrender.com",
        27016,
        "offline"
    );

    insertServer.run(
        "VYRE DM #2",
        "Deathmatch",
        "vyre-mn.onrender.com",
        27017,
        "offline"
    );

    insertServer.run(
        "VYRE DM #3",
        "Deathmatch",
        "vyre-mn.onrender.com",
        27018,
        "offline"
    );

    insertServer.run(
        "VYRE RETAKE #1",
        "Retake",
        "vyre-mn.onrender.com",
        27021,
        "offline"
    );

    insertServer.run(
        "VYRE RETAKE #2",
        "Retake",
        "vyre-mn.onrender.com",
        27022,
        "offline"
    );

    insertServer.run(
        "VYRE RETAKE #3",
        "Retake",
        "vyre-mn.onrender.com",
        27023,
        "offline"
    );

    for (let i = 1; i <= 20; i++) {

        insertServer.run(
            `VYRE 5V5 #${i}`,
            "5v5",
            "vyre-mn.onrender.com",
            27100 + i,
            "offline"
        );

    }
}


/* =========================================================
   MIDDLEWARE
   ========================================================= */

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


/* =========================================================
   SESSION
   ========================================================= */

app.set("trust proxy", 1);

app.use(
    session({
        secret:
            process.env.SESSION_SECRET ||
            "vyre-mn-change-this-secret",

        resave: false,

        saveUninitialized: false,

        cookie: {
            secure:
                process.env.NODE_ENV === "production",

            httpOnly: true,

            maxAge:
                7 * 24 * 60 * 60 * 1000
        }
    })
);


/* =========================================================
   PASSPORT
   ========================================================= */

app.use(passport.initialize());
app.use(passport.session());


/* =========================================================
   STATIC
   ========================================================= */

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


/* =========================================================
   SERIALIZE
   ========================================================= */

passport.serializeUser(
    (user, done) => {
        done(null, user);
    }
);

passport.deserializeUser(
    (user, done) => {
        done(null, user);
    }
);


/* =========================================================
   STEAM AUTH
   ========================================================= */

passport.use(
    new SteamStrategy(
        {
            returnURL:
                "https://vyre-mn.onrender.com/api/auth/steam/return",

            realm:
                "https://vyre-mn.onrender.com/",

            apiKey:
                process.env.STEAM_API_KEY
        },

        (identifier, profile, done) => {

            try {

                const steamId =
                    profile.id;

                const name =
                    profile.displayName ||
                    "Steam Player";


                /* STEAM AVATAR */

                let avatar = null;

                if (
                    profile.photos &&
                    profile.photos.length > 0
                ) {

                    avatar =
                        profile.photos[
                            profile.photos.length - 1
                        ].value;

                }


                /* FIND PLAYER */

                const existing =
                    db.prepare(`
                        SELECT *
                        FROM players
                        WHERE steam_id = ?
                    `).get(steamId);


                /* CREATE PLAYER */

                if (!existing) {

                    db.prepare(`
                        INSERT INTO players
                        (steam_id, name, avatar)
                        VALUES (?, ?, ?)
                    `).run(
                        steamId,
                        name,
                        avatar
                    );

                }

                /* UPDATE PLAYER */

                else {

                    db.prepare(`
                        UPDATE players
                        SET
                            name = ?,
                            avatar = ?
                        WHERE steam_id = ?
                    `).run(
                        name,
                        avatar,
                        steamId
                    );

                }


                return done(
                    null,
                    {
                        steam_id:
                            steamId,

                        name:
                            name,

                        avatar:
                            avatar
                    }
                );


            } catch (error) {

                console.error(
                    "STEAM AUTH ERROR:",
                    error
                );

                return done(error);

            }

        }
    )
);


/* =========================================================
   STEAM LOGIN
   ========================================================= */

app.get(
    "/api/auth/steam",

    passport.authenticate("steam")
);


/* =========================================================
   STEAM CALLBACK
   ========================================================= */

app.get(
    "/api/auth/steam/return",

    passport.authenticate(
        "steam",
        {
            failureRedirect: "/"
        }
    ),

    (req, res) => {

        res.redirect("/");

    }
);


/* =========================================================
   CURRENT USER
   ========================================================= */

app.get(
    "/api/auth/me",

    (req, res) => {

        if (!req.isAuthenticated()) {

            return res.json({
                loggedIn: false
            });

        }


        res.json({

            loggedIn: true,

            user: req.user

        });

    }
);


/* =========================================================
   LOGOUT
   ========================================================= */

app.get(
    "/api/auth/logout",

    (req, res) => {

        req.logout(() => {

            req.session.destroy(() => {

                res.redirect("/");

            });

        });

    }
);


/* =========================================================
   STATUS
   ========================================================= */

app.get(
    "/api/status",

    (req, res) => {

        res.json({

            online: true,

            name: "VYRE.MN",

            time:
                new Date().toISOString()

        });

    }
);


/* =========================================================
   PLAYERS
   ========================================================= */

app.get(
    "/api/players",

    (req, res) => {

        const players =
            db.prepare(`
                SELECT *
                FROM players
                ORDER BY id DESC
            `).all();

        res.json(players);

    }
);


/* =========================================================
   SINGLE PLAYER
   ========================================================= */

app.get(
    "/api/players/:steam_id",

    (req, res) => {

        const player =
            db.prepare(`
                SELECT *
                FROM players
                WHERE steam_id = ?
            `).get(
                req.params.steam_id
            );


        if (!player) {

            return res.status(404).json({

                error:
                    "Player not found"

            });

        }


        res.json(player);

    }
);


/* =========================================================
   ADD PLAYER
   ========================================================= */

app.post(
    "/api/players",

    (req, res) => {

        const {
            steam_id,
            name,
            avatar,
            rank
        } = req.body;


        if (!steam_id || !name) {

            return res.status(400).json({

                error:
                    "steam_id and name are required"

            });

        }


        try {

            const result =
                db.prepare(`
                    INSERT INTO players
                    (steam_id, name, avatar, rank)
                    VALUES (?, ?, ?, ?)
                `).run(
                    steam_id,
                    name,
                    avatar || null,
                    rank || "PLAYER"
                );


            res.json({

                success: true,

                id:
                    result.lastInsertRowid

            });

        } catch (error) {

            res.status(400).json({

                error:
                    error.message

            });

        }

    }
);


/* =========================================================
   UPDATE RANK
   ========================================================= */

app.post(
    "/api/players/rank",

    (req, res) => {

        const {
            steam_id,
            rank
        } = req.body;


        if (!steam_id || !rank) {

            return res.status(400).json({

                error:
                    "steam_id and rank are required"

            });

        }


        db.prepare(`
            UPDATE players
            SET rank = ?
            WHERE steam_id = ?
        `).run(
            rank,
            steam_id
        );


        res.json({

            success: true

        });

    }
);


/* =========================================================
   SERVERS
   ========================================================= */

app.get(
    "/api/servers",

    (req, res) => {

        const servers =
            db.prepare(`
                SELECT *
                FROM servers
                ORDER BY id ASC
            `).all();

        res.json(servers);

    }
);


/* =========================================================
   SERVER STATUS
   ========================================================= */

app.post(
    "/api/servers/status",

    (req, res) => {

        const {
            id,
            status
        } = req.body;


        if (!id || !status) {

            return res.status(400).json({

                error:
                    "id and status are required"

            });

        }


        db.prepare(`
            UPDATE servers
            SET status = ?
            WHERE id = ?
        `).run(
            status,
            id
        );


        res.json({

            success: true

        });

    }
);


/* =========================================================
   BANS
   ========================================================= */

app.get(
    "/api/bans",

    (req, res) => {

        const bans =
            db.prepare(`
                SELECT *
                FROM bans
                ORDER BY created_at DESC
            `).all();

        res.json(bans);

    }
);


/* =========================================================
   ADD BAN
   ========================================================= */

app.post(
    "/api/bans",

    (req, res) => {

        const {
            steam_id,
            name,
            reason,
            admin_steam_id
        } = req.body;


        if (!steam_id) {

            return res.status(400).json({

                error:
                    "steam_id is required"

            });

        }


        const result =
            db.prepare(`
                INSERT INTO bans
                (steam_id, name, reason, admin_steam_id)
                VALUES (?, ?, ?, ?)
            `).run(
                steam_id,
                name || null,
                reason || null,
                admin_steam_id || null
            );


        res.json({

            success: true,

            id:
                result.lastInsertRowid

        });

    }
);


/* =========================================================
   DELETE BAN
   ========================================================= */

app.delete(
    "/api/bans/:steam_id",

    (req, res) => {

        db.prepare(`
            DELETE FROM bans
            WHERE steam_id = ?
        `).run(
            req.params.steam_id
        );


        res.json({

            success: true

        });

    }
);


/* =========================================================
   SKIN LOADOUT
   ========================================================= */

app.get(
    "/api/loadout",

    (req, res) => {

        if (
            !req.isAuthenticated ||
            !req.isAuthenticated()
        ) {

            return res.status(401).json({

                message:
                    "Steam login required"

            });

        }


        const row =
            db.prepare(`
                SELECT data
                FROM loadouts
                WHERE steam_id = ?
            `).get(
                req.user.steam_id
            );


        let loadout = {};


        try {

            if (row) {

                loadout =
                    JSON.parse(row.data);

            }

        } catch (error) {

            loadout = {};

        }


        res.json({

            loggedIn: true,

            steam_id:
                req.user.steam_id,

            loadout:
                loadout

        });

    }
);


app.post(
    "/api/loadout",

    (req, res) => {

        if (
            !req.isAuthenticated ||
            !req.isAuthenticated()
        ) {

            return res.status(401).json({

                message:
                    "Steam login required"

            });

        }


        const loadout =
            req.body?.loadout;


        if (
            !loadout ||
            typeof loadout !== "object"
        ) {

            return res.status(400).json({

                message:
                    "Invalid loadout"

            });

        }


        const clean = {};


        for (
            const [key, value]
            of Object.entries(loadout)
        ) {

            if (
                !value ||
                typeof value !== "object"
            ) {

                continue;

            }


            clean[
                String(key).slice(0, 100)
            ] = {

                id:
                    String(
                        value.id ?? ""
                    ).slice(0, 200),

                name:
                    String(
                        value.name ?? ""
                    ).slice(0, 300),

                image:
                    String(
                        value.image ?? ""
                    ).slice(0, 1000),

                tab:
                    String(
                        value.tab ?? ""
                    ).slice(0, 50),

                weapon:
                    String(
                        value.weapon ?? ""
                    ).slice(0, 150)

            };

        }


        db.prepare(`
            INSERT INTO loadouts
            (
                steam_id,
                data,
                updated_at
            )
            VALUES
            (
                ?,
                ?,
                CURRENT_TIMESTAMP
            )

            ON CONFLICT(steam_id)

            DO UPDATE SET
                data = excluded.data,
                updated_at = CURRENT_TIMESTAMP
        `).run(
            req.user.steam_id,
            JSON.stringify(clean)
        );


        res.json({

            success: true,

            loadout:
                clean

        });

    }
);


/* =========================================================
   PAGES
   ========================================================= */

app.get(
    "/",

    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "public",
                "index.html"
            )
        );

    }
);


app.get(
    "/servers",

    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "public",
                "servers.html"
            )
        );

    }
);


app.get(
    "/skins",

    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "public",
                "skins.html"
            )
        );

    }
);


app.get(
    "/leaderboard",

    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "public",
                "leaderboard.html"
            )
        );

    }
);


app.get(
    "/players",

    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "public",
                "players.html"
            )
        );

    }
);


app.get(
    "/clans",

    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "public",
                "clans.html"
            )
        );

    }
);


app.get(
    "/discord",

    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "public",
                "discord.html"
            )
        );

    }
);


/* =========================================================
   PROFILE
   ========================================================= */

app.get(
    "/profile",

    (req, res) => {

        if (!req.isAuthenticated()) {

            return res.redirect("/");

        }


        res.redirect(
            "/profile/" +
            req.user.steam_id
        );

    }
);


app.get(
    "/profile/:steam_id",

    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "public",
                "profile.html"
            )
        );

    }
);


/* =========================================================
   ADMIN
   ========================================================= */

app.get(
    "/admin",

    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "public",
                "admin.html"
            )
        );

    }
);


/* =========================================================
   START
   ========================================================= */

app.listen(
    PORT,

    () => {

        console.log(
            `VYRE.MN running on port ${PORT}`
        );

    }
);
