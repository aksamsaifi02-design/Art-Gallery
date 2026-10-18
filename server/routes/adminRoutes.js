const express = require("express");

const router =
    express.Router();


const {
    loginAdmin,
    logoutAdmin,
    checkAdminSession,
    getDashboardStats
} = require(
    "../controllers/adminController"
);


// ============================================
// ADMIN LOGIN / LOGOUT / SESSION
// ============================================

router.post(
    "/login",
    loginAdmin
);

router.post(
    "/logout",
    logoutAdmin
);

router.get(
    "/session",
    checkAdminSession
);


// ============================================
// ADMIN DASHBOARD STATISTICS
// ============================================

router.get(
    "/stats",
    getDashboardStats
);


module.exports = router;