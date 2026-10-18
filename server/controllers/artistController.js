const bcrypt = require("bcrypt");
const db = require("../config/db");

// ============================================
// ARTIST REGISTRATION
// ============================================

const registerArtist = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            whatsapp,
            instagram,
            location,
            bio
        } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required."
            });
        }

        // Check if email already exists
        const [existingArtist] = await db.query(
            "SELECT artist_id FROM artists WHERE email = ?",
            [email]
        );

        if (existingArtist.length > 0) {
            return res.status(409).json({
                success: false,
                message: "An artist with this email already exists."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert artist
        const [result] = await db.query(
            `INSERT INTO artists
            (name, email, password, phone, whatsapp, instagram, location, bio)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name,
                email,
                hashedPassword,
                phone || null,
                whatsapp || null,
                instagram || null,
                location || null,
                bio || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Artist registered successfully.",
            artistId: result.insertId
        });

    } catch (error) {
        console.error("Registration Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during registration."
        });
    }
};


// ============================================
// ARTIST LOGIN
// ============================================

const loginArtist = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        // Find artist
        const [artists] = await db.query(
            "SELECT * FROM artists WHERE email = ?",
            [email]
        );

        if (artists.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const artist = artists[0];

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            artist.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Create session
        req.session.artistId = artist.artist_id;
        req.session.artistName = artist.name;
        req.session.artistEmail = artist.email;

        res.json({
            success: true,
            message: "Login successful.",
            artist: {
                id: artist.artist_id,
                name: artist.name,
                email: artist.email,
                role: artist.role
            }
        });

    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during login."
        });
    }
};


// ============================================
// ARTIST LOGOUT
// ============================================

const logoutArtist = (req, res) => {

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




//artist portfolio API

// ============================================
// GET ARTIST PROFILE
// ============================================

const getArtistProfile = async (req, res) => {

    try {

        // Check login
        if (!req.session.artistId) {

            return res.status(401).json({
                success: false,
                message: "Please login first."
            });

        }


        const [artists] = await db.query(
            `SELECT
                artist_id,
                name,
                email,
                phone,
                whatsapp,
                instagram,
                location,
                bio,
                profile_image,
                created_at
             FROM artists
             WHERE artist_id = ?`,
            [req.session.artistId]
        );


        if (artists.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Artist not found."
            });

        }


        res.json({

            success: true,

            artist: artists[0]

        });


    } catch (error) {

        console.error(
            "Profile Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error while retrieving profile."

        });

    }

};

// ============================================
// UPDATE ARTIST PROFILE
// ============================================

const updateArtistProfile = async (req, res) => {

    try {

        // Check login
        if (!req.session.artistId) {

            return res.status(401).json({

                success: false,

                message:
                    "Please login as an artist first."

            });

        }


        const {

            name,
            phone,
            whatsapp,
            instagram,
            location,
            bio

        } = req.body;


        // --------------------------------------
        // VALIDATE
        // --------------------------------------

        if (!name) {

            return res.status(400).json({

                success: false,

                message:
                    "Artist name is required."

            });

        }


        // --------------------------------------
        // UPDATE PROFILE
        // --------------------------------------

        await db.query(

            `UPDATE artists

             SET
                name = ?,
                phone = ?,
                whatsapp = ?,
                instagram = ?,
                location = ?,
                bio = ?

             WHERE artist_id = ?`,

            [

                name,

                phone || null,

                whatsapp || null,

                instagram || null,

                location || null,

                bio || null,

                req.session.artistId

            ]

        );


        res.json({

            success: true,

            message:
                "Profile updated successfully."

        });


    } catch (error) {

        console.error(
            "Update Profile Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error while updating profile."

        });

    }

};

// Export functions
module.exports = {
    registerArtist,
    loginArtist,
    logoutArtist,
    getArtistProfile,
    updateArtistProfile
};