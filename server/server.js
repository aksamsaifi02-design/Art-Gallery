const express = require("express");
const session = require("express-session");
const path = require("path");

const db = require("./config/db");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;


// ============================================
// MIDDLEWARE
// ============================================

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// ============================================
// SESSION
// ============================================

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,

        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);


// ============================================
// SERVE FRONTEND
// ============================================

app.use(
    express.static(
        path.join(__dirname, "../client")
    )
);

// ============================================
// SERVE UPLOADED IMAGES
// ============================================

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


// ============================================
// ARTIST ROUTES
// ============================================

const artistRoutes = require("./routes/artistRoutes");

app.use(
    "/api/artists",
    artistRoutes
);



//adding artwork routes
const artworkRoutes =
    require("./routes/artworkRoutes");

app.use(
    "/api/artworks",
    artworkRoutes
);


const enquiryRoutes =
    require("./routes/enquiryRoutes");

app.use(
    "/api/enquiries",
    enquiryRoutes
);

const adminRoutes =
    require("./routes/adminRoutes");

app.use(
    "/api/admin",
    adminRoutes
);

// ============================================
// HOME TEST
// ============================================

app.get("/", (req, res) => {
    res.send("Art Gallery Server is Running!");
});


// ============================================
// DATABASE TEST
// ============================================

app.get("/test-db", async (req, res) => {

    try {

        const [rows] = await db.query(
            "SELECT 1 AS result"
        );

        res.json({
            success: true,
            message: "MySQL database connected successfully!",
            data: rows
        });

    } catch (error) {

        console.error(
            "Database Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});


// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {

    console.log(
        `Art Gallery Server running on http://localhost:${PORT}`
    );

});

