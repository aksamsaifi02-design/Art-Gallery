const bcrypt = require("bcrypt");
const db = require("../config/db");


// ============================================
// ADMIN LOGIN
// ============================================

const loginAdmin = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const [admins] = await db.query(
            "SELECT * FROM admins WHERE email = ?",
            [email]
        );

        if (admins.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const admin = admins[0];

        const passwordMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        req.session.adminId = admin.admin_id;
        req.session.adminName = admin.name;
        req.session.adminEmail = admin.email;

        res.json({
            success: true,
            message: "Login successful.",
            admin: {
                id: admin.admin_id,
                name: admin.name,
                email: admin.email
            }
        });

    } catch (error) {

        console.error("Admin Login Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during login."
        });
    }
};


// ============================================
// ADMIN LOGOUT
// ============================================

const logoutAdmin = (req, res) => {

    req.session.destroy((error) => {

        if (error) {
            return res.status(500).json({
                success: false,
                message: "Logout failed."
            });
        }

        res.json({
            success: true,
            message: "Logout successful."
        });
    });
};


// ============================================
// ADMIN SESSION CHECK
// ============================================

const checkAdminSession = (req, res) => {

    if (!req.session.adminId) {
        return res.status(401).json({
            success: false,
            message: "Not logged in."
        });
    }

    res.json({
        success: true,
        admin: {
            id: req.session.adminId,
            name: req.session.adminName,
            email: req.session.adminEmail
        }
    });
};


// ============================================
// ADMIN DASHBOARD STATISTICS
// ============================================

const getDashboardStats = async (
    req,
    res
) => {

    try {

        // Require an authenticated admin session
        if (!req.session.adminId) {
            return res.status(401).json({
                success: false,
                message: "Please login as admin first."
            });
        }


        // --------------------------------------
        // ARTIST COUNT
        // --------------------------------------

        const [artistResult] =
            await db.query(

                `SELECT COUNT(*) AS total
                 FROM artists
                 WHERE role = 'artist'`

            );


        // --------------------------------------
        // ARTWORK COUNT
        // --------------------------------------

        const [artworkResult] =
            await db.query(

                `SELECT COUNT(*) AS total
                 FROM artworks`

            );


        // --------------------------------------
        // ENQUIRY COUNT
        // --------------------------------------

        const [enquiryResult] =
            await db.query(

                `SELECT COUNT(*) AS total
                 FROM enquiries`

            );


        // --------------------------------------
        // RESPONSE
        // --------------------------------------

        res.json({

            success: true,

            stats: {

                artists:
                    artistResult[0].total,

                artworks:
                    artworkResult[0].total,

                enquiries:
                    enquiryResult[0].total

            }

        });


    } catch (error) {

        console.error(
            "Admin Stats Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to load dashboard statistics."

        });

    }

};


module.exports = {
    loginAdmin,
    logoutAdmin,
    checkAdminSession,
    getDashboardStats
};