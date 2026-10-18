const db = require("../config/db");


// ============================================
// UPLOAD ARTWORK
// ============================================

const uploadArtwork = async (req, res) => {

    try {

        // --------------------------------------
        // CHECK LOGIN
        // --------------------------------------

        if (!req.session.artistId) {

            return res.status(401).json({

                success: false,

                message:
                    "Please login as an artist first."

            });

        }


        // --------------------------------------
        // CHECK IMAGE
        // --------------------------------------

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message:
                    "Please select an artwork image."

            });

        }


        // --------------------------------------
        // GET FORM DATA
        // --------------------------------------

        const {

            title,
            price,
            category_id,
            medium,
            dimensions,
            description,
            location

        } = req.body;


        // --------------------------------------
        // VALIDATE REQUIRED DATA
        // --------------------------------------

        if (
            !title ||
            !price ||
            !category_id ||
            !description
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Title, price, category and description are required."

            });

        }


        // --------------------------------------
        // IMAGE PATH
        // --------------------------------------

        const imagePath =
            "/uploads/" +
            req.file.filename;


        // --------------------------------------
        // INSERT INTO DATABASE
        // --------------------------------------

        const [result] =
            await db.query(

                `INSERT INTO artworks
                (
                    artist_id,
                    category_id,
                    title,
                    image,
                    price,
                    medium,
                    dimensions,
                    description,
                    location
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                
                [

                    req.session.artistId,

                    category_id,

                    title,

                    imagePath,

                    price,

                    medium || null,

                    dimensions || null,

                    description,

                    location || null

                ]

            );


        // --------------------------------------
        // SUCCESS
        // --------------------------------------

        res.status(201).json({

            success: true,

            message:
                "Artwork uploaded successfully.",

            artworkId:
                result.insertId

        });


    } catch (error) {

        console.error(
            "Artwork Upload Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error while uploading artwork."

        });

    }

};

//edit artwork functionality or delete functionality
// ============================================
// GET MY ARTWORKS
// ============================================

const getMyArtworks = async (req, res) => {

    try {

        // Check login
        if (!req.session.artistId) {

            return res.status(401).json({

                success: false,

                message:
                    "Please login as an artist first."

            });

        }


        const [artworks] =
            await db.query(

                `SELECT
                    a.artwork_id,
                    a.title,
                    a.image,
                    a.price,
                    a.upload_date,
                    a.medium,
                    a.dimensions,
                    a.description,
                    a.location,
                    a.availability,
                    a.featured,

                    c.category_name

                 FROM artworks a

                 LEFT JOIN categories c
                    ON a.category_id = c.category_id

                 WHERE a.artist_id = ?

                 ORDER BY a.upload_date DESC`,

                [req.session.artistId]

            );


        res.json({

            success: true,

            artworks: artworks

        });


    } catch (error) {

        console.error(
            "Get Artworks Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error while retrieving artworks."

        });

    }

};


// ============================================
// DELETE ARTWORK
// ============================================

const deleteArtwork = async (req, res) => {

    try {

        // Check login
        if (!req.session.artistId) {

            return res.status(401).json({

                success: false,

                message:
                    "Please login as an artist first."

            });

        }


        const artworkId =
            req.params.id;


        // Make sure artwork belongs
        // to logged-in artist

        const [artworks] =
            await db.query(

                `SELECT artwork_id
                 FROM artworks
                 WHERE artwork_id = ?
                 AND artist_id = ?`,

                [
                    artworkId,
                    req.session.artistId
                ]

            );


        if (artworks.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Artwork not found."

            });

        }


        // Delete artwork

        await db.query(

            `DELETE FROM artworks
             WHERE artwork_id = ?
             AND artist_id = ?`,

            [
                artworkId,
                req.session.artistId
            ]

        );


        res.json({

            success: true,

            message:
                "Artwork deleted successfully."

        });


    } catch (error) {

        console.error(
            "Delete Artwork Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error while deleting artwork."

        });

    }

};

// ============================================
// GET SINGLE ARTWORK
// ============================================

const getArtworkById = async (req, res) => {

    try {

        // Check login
        if (!req.session.artistId) {

            return res.status(401).json({

                success: false,

                message:
                    "Please login as an artist first."

            });

        }


        const artworkId =
            req.params.id;


        const [artworks] =
            await db.query(

                `SELECT
                    a.artwork_id,
                    a.title,
                    a.image,
                    a.price,
                    a.medium,
                    a.dimensions,
                    a.description,
                    a.location,
                    a.availability,
                    a.category_id,
                    c.category_name

                 FROM artworks a

                 LEFT JOIN categories c
                    ON a.category_id = c.category_id

                 WHERE a.artwork_id = ?
                 AND a.artist_id = ?`,

                [
                    artworkId,
                    req.session.artistId
                ]

            );


        if (artworks.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Artwork not found."

            });

        }


        res.json({

            success: true,

            artwork: artworks[0]

        });


    } catch (error) {

        console.error(
            "Get Artwork Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error while retrieving artwork."

        });

    }

};

// ============================================
// UPDATE ARTWORK
// ============================================

const updateArtwork = async (req, res) => {

    try {

        // Check login
        if (!req.session.artistId) {

            return res.status(401).json({

                success: false,

                message:
                    "Please login as an artist first."

            });

        }


        const artworkId =
            req.params.id;


        const {

            title,
            price,
            category_id,
            medium,
            dimensions,
            description,
            location,
            availability

        } = req.body;


        // --------------------------------------
        // VALIDATE
        // --------------------------------------

        if (
            !title ||
            !price ||
            !category_id ||
            !description
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Title, price, category and description are required."

            });

        }


        // --------------------------------------
        // CHECK OWNERSHIP
        // --------------------------------------

        const [artworks] =
            await db.query(

                `SELECT artwork_id
                 FROM artworks
                 WHERE artwork_id = ?
                 AND artist_id = ?`,

                [
                    artworkId,
                    req.session.artistId
                ]

            );


        if (artworks.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Artwork not found."

            });

        }


        // --------------------------------------
        // UPDATE
        // --------------------------------------

        await db.query(

            `UPDATE artworks

             SET
                title = ?,
                price = ?,
                category_id = ?,
                medium = ?,
                dimensions = ?,
                description = ?,
                location = ?,
                availability = ?

             WHERE artwork_id = ?
             AND artist_id = ?`,

            [

                title,

                price,

                category_id,

                medium || null,

                dimensions || null,

                description,

                location || null,

                availability || "Available",

                artworkId,

                req.session.artistId

            ]

        );


        res.json({

            success: true,

            message:
                "Artwork updated successfully."

        });


    } catch (error) {

        console.error(
            "Update Artwork Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error while updating artwork."

        });

    }

};

// ============================================
// GET ALL PUBLIC ARTWORKS
// ============================================

const getPublicArtworks = async (req, res) => {

    try {

        const [artworks] =
            await db.query(

                `SELECT

                    a.artwork_id,
                    a.title,
                    a.image,
                    a.price,
                    a.medium,
                    a.dimensions,
                    a.description,
                    a.location,
                    a.availability,
                    a.featured,

                    c.category_name,

                    ar.artist_id,
                    ar.name AS artist_name

                 FROM artworks a

                 LEFT JOIN categories c
                    ON a.category_id =
                       c.category_id

                 INNER JOIN artists ar
                    ON a.artist_id =
                       ar.artist_id

                 WHERE a.availability = 'Available'

                 ORDER BY a.upload_date DESC`

            );


        res.json({

            success: true,

            artworks: artworks

        });


    } catch (error) {

        console.error(
            "Get Public Artworks Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error while loading artworks."

        });

    }

};

// ============================================
// GET PUBLIC ARTWORK DETAILS
// ============================================

const getPublicArtworkDetails = async (req, res) => {

    try {

        const artworkId =
            req.params.id;


        const [artworks] =
            await db.query(

                `SELECT

                    a.artwork_id,
                    a.title,
                    a.image,
                    a.price,
                    a.medium,
                    a.dimensions,
                    a.description,
                    a.location,
                    a.availability,

                    c.category_name,

                    ar.artist_id,
                    ar.name AS artist_name,
                    ar.email AS artist_email,
                    ar.phone AS artist_phone,
                    ar.whatsapp AS artist_whatsapp,
                    ar.instagram AS artist_instagram,
                    ar.location AS artist_location,
                    ar.bio AS artist_bio

                 FROM artworks a

                 LEFT JOIN categories c
                    ON a.category_id =
                       c.category_id

                 INNER JOIN artists ar
                    ON a.artist_id =
                       ar.artist_id

                 WHERE a.artwork_id = ?
                 AND a.availability = 'Available'`,

                [artworkId]

            );


        // --------------------------------------
        // CHECK ARTWORK
        // --------------------------------------

        if (artworks.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Artwork not found or no longer available."

            });

        }


        const artwork =
            artworks[0];


        res.json({

            success: true,

            artwork: artwork

        });


    } catch (error) {

        console.error(
            "Public Artwork Details Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error while loading artwork details."

        });

    }

};

module.exports = {
    uploadArtwork,
    getMyArtworks,
    deleteArtwork,
    getArtworkById,
    updateArtwork,
    getPublicArtworks,
    getPublicArtworkDetails
};