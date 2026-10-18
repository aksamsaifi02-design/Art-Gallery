const express = require("express");

const {
    registerArtist,
    loginArtist,
    logoutArtist,
    getArtistProfile,
    updateArtistProfile
} = require("../controllers/artistController");

const router = express.Router();


// ============================================
// REGISTER
// ============================================

router.post(
    "/register",
    registerArtist
);


// ============================================
// LOGIN
// ============================================

router.post(
    "/login",
    loginArtist
);


// ============================================
// LOGOUT
// ============================================

router.post(
    "/logout",
    logoutArtist
);


// ============================================
// PROFILE
// ============================================

router.get(
    "/profile",
    getArtistProfile
);

// ============================================
// UPDATE PROFILE
// ============================================

router.put(
    "/profile",
    updateArtistProfile
);

module.exports = router;