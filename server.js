const express = require("express");
const path = require("path");
const Database = require("better-sqlite3");
const session = require("express-session");
const passport = require("passport");
const SteamStrategy = require("passport-steam").Strategy;

const app = express();
const PORT = process.env.PORT || 3000;

// =========================
// DATABASE
// =========================

const db = new Database("vyre.db");

db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    steam_id TEXT UNIQUE,
    name TEXT NOT NULL,
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
`);

// =========================
// DEFAULT SERVERS
// =========================

const serverCount = db
    .prepare("SELECT COUNT(*) AS count FROM servers")
    .get();

if (serverCount.count === 0) {

    const insertServer = db.prepare(`
        INSERT INTO servers
        (name, type, ip, port, status)
        VALUES (?, ?, ?, ?, ?)
    `);

    // Deathmatch
    for (let i = 1; i <= 3; i++) {

        insertServer.run(
            `VYRE.MN DM #${i}`,
            "Deathmatch",
            "127.0.0.1",
            27015 + i,
            "offline"
        );

    }

    // Retake
    for (let i = 1; i <= 3; i++) {

        insertServer.run(
            `VYRE.MN Retake #${i}`,
            "Retake",
            "127.0.0.1",
            27020 + i,
            "offline"
        );

    }

    // 5v5
    for (let i = 1; i <= 20; i++) {

        insertServer.run(
            `VYRE.MN 5v5 #${String(i).padStart(2, "0")}`,
            "5v5",
            "127.0.0.1",
            27100 + i,
            "offline"
        );

    }
}

// =========================
// MIDDLEWARE
// =========================

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(session({
    secret:
        process.env.SESSION_SECRET ||
        "vyre-mn-change-this-secret",

    resave: false,

    saveUninitialized: false,

    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

// =========================
// STEAM LOGIN
// =========================

passport.serializeUser((user, done) => {

    done(null, user);

});

passport.deserializeUser((user, done) => {

    done(null, user);

});


passport.use(
    new SteamStrategy(
        {

            returnURL:
                process.env.STEAM_RETURN_URL ||
                "http://localhost:3000/api/auth/steam/return",

            realm:
                process.env.STEAM_REALM ||
                "http://localhost:3000/",

            apiKey:
                process.env.STEAM_API_KEY

        },

        (identifier, profile, done) => {

            try {

                const steamId = profile.id;

                const name =
                    profile.displayName ||
                    "Steam Player";

                const avatar =
                    profile.photos &&
                    profile.photos.length
                        ? profile.photos[
                            profile.photos.length - 1
                        ].value
                        : null;


                const existing = db
                    .prepare(`
                        SELECT *
                        FROM players
                        WHERE steam_id = ?
                    `)
                    .get(steamId);


                if (!existing) {

                    db.prepare(`
                        INSERT INTO players
                        (steam_id, name)
                        VALUES (?, ?)
                    `).run(
                        steamId,
                        name
                    );

                } else {

                    db.prepare(`
                        UPDATE players
                        SET name = ?
                        WHERE steam_id = ?
                    `).run(
                        name,
                        steamId
                    );

                }


                return done(null, {

                    steam_id: steamId,

                    name: name,

                    avatar: avatar

                });

            } catch (error) {

                return done(error);

            }

        }
    )
);


// =========================
// STEAM LOGIN ROUTES
// =========================

app.get(
    "/api/auth/steam",

    passport.authenticate("steam")
);


app.get(
    "/api/auth/steam/return",

    passport.authenticate("steam", {
        failureRedirect: "/"
    }),

    (req, res) => {

        res.redirect("/");

    }
);


// =========================
// CURRENT USER
// =========================

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


// =========================
// LOGOUT
// =========================

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


// =========================
// API STATUS
// =========================

app.get(
    "/api/status",
    (req, res) => {

        const servers = db
            .prepare(
                "SELECT * FROM servers"
            )
            .all();


        res.json({

            name: "VYRE.MN",

            status: "online",

            servers: servers.length

        });

    }
);


// =========================
// PLAYERS
// =========================

app.get(
    "/api/players",
    (req, res) => {

        const players = db
            .prepare(`
                SELECT *
                FROM players
                ORDER BY id DESC
            `)
            .all();


        res.json(players);

    }
);


app.post(
    "/api/players",
    (req, res) => {

        const {
            steam_id,
            name
        } = req.body;


        if (!steam_id || !name) {

            return res.status(400).json({

                error:
                    "steam_id and name are required"

            });

        }


        try {

            const result = db
                .prepare(`
                    INSERT INTO players
                    (steam_id, name)
                    VALUES (?, ?)
                `)
                .run(
                    steam_id,
                    name
                );


            res.json({

                success: true,

                id: result.lastInsertRowid

            });

        } catch (error) {

            res.status(400).json({

                error:
                    "Player already exists"

            });

        }

    }
);


// =========================
// CHANGE RANK
// =========================

app.post(
    "/api/players/rank",
    (req, res) => {

        const {
            steam_id,
            rank
        } = req.body;


        const allowedRanks = [

            "PLAYER",

            "VIP",

            "ADMIN",

            "BOSS"

        ];


        if (!allowedRanks.includes(rank)) {

            return res.status(400).json({

                error:
                    "Invalid rank"

            });

        }


        const result = db
            .prepare(`
                UPDATE players
                SET rank = ?
                WHERE steam_id = ?
            `)
            .run(
                rank,
                steam_id
            );


        if (result.changes === 0) {

            return res.status(404).json({

                error:
                    "Player not found"

            });

        }


        res.json({

            success: true,

            steam_id,

            rank

        });

    }
);


// =========================
// SERVERS
// =========================

app.get(
    "/api/servers",
    (req, res) => {

        const servers = db
            .prepare(`
                SELECT *
                FROM servers
                ORDER BY id ASC
            `)
            .all();


        res.json(servers);

    }
);


// =========================
// SERVER STATUS
// =========================

app.post(
    "/api/servers/status",
    (req, res) => {

        const {
            id,
            status
        } = req.body;


        const allowedStatus = [

            "online",

            "offline",

            "maintenance"

        ];


        if (!allowedStatus.includes(status)) {

            return res.status(400).json({

                error:
                    "Invalid server status"

            });

        }


        const result = db
            .prepare(`
                UPDATE servers
                SET status = ?
                WHERE id = ?
            `)
            .run(
                status,
                id
            );


        if (result.changes === 0) {

            return res.status(404).json({

                error:
                    "Server not found"

            });

        }


        res.json({

            success: true

        });

    }
);


// =========================
// BANS
// =========================

app.get(
    "/api/bans",
    (req, res) => {

        const bans = db
            .prepare(`
                SELECT *
                FROM bans
                ORDER BY id DESC
            `)
            .all();


        res.json(bans);

    }
);


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


        const result = db
            .prepare(`
                INSERT INTO bans
                (
                    steam_id,
                    name,
                    reason,
                    admin_steam_id
                )
                VALUES (?, ?, ?, ?)
            `)
            .run(

                steam_id,

                name || "",

                reason || "",

                admin_steam_id || ""

            );


        res.json({

            success: true,

            id: result.lastInsertRowid

        });

    }
);


// =========================
// UNBAN
// =========================

app.delete(
    "/api/bans/:steam_id",
    (req, res) => {

        const result = db
            .prepare(`
                DELETE FROM bans
                WHERE steam_id = ?
            `)
            .run(
                req.params.steam_id
            );


        res.json({

            success:
                result.changes > 0

        });

    }
);


// =========================
// PAGES
// =========================

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


// =========================
// 404
// =========================

app.use(
    (req, res) => {

        res.redirect("/");

    }
);


// =========================
// START
// =========================

app.listen(
    PORT,
    () => {

        console.log(
            `VYRE.MN running on port ${PORT}`
        );

    }
);