const db = require("../config/db");


// ============================================
// CREATE ENQUIRY
// ============================================

const createEnquiry = async (req, res) => {

    try {

        const {
            artwork_id,
            buyer_name,
            buyer_email,
            buyer_phone,
            message
        } = req.body;


        // --------------------------------------
        // VALIDATION
        // --------------------------------------

        if (
            !artwork_id ||
            !buyer_name ||
            !buyer_email
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Artwork, name and email are required."

            });

        }


        // --------------------------------------
        // FIND ARTWORK
        // --------------------------------------

        const [artworks] =
            await db.query(

                `SELECT
                    artwork_id,
                    artist_id,
                    title,
                    availability

                 FROM artworks

                 WHERE artwork_id = ?`,

                [artwork_id]

            );


        if (artworks.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Artwork not found."

            });

        }


        const artwork =
            artworks[0];


        // --------------------------------------
        // CHECK AVAILABILITY
        // --------------------------------------

        if (
            artwork.availability !==
            "Available"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "This artwork is no longer available."

            });

        }


        // --------------------------------------
        // CREATE ENQUIRY
        // --------------------------------------

        await db.query(

            `INSERT INTO enquiries

            (
                artwork_id,
                artist_id,
                buyer_name,
                buyer_email,
                buyer_phone,
                message
            )

            VALUES (?, ?, ?, ?, ?, ?)`,

            [

                artwork.artwork_id,

                artwork.artist_id,

                buyer_name,

                buyer_email,

                buyer_phone || null,

                message || null

            ]

        );


        // --------------------------------------
        // SUCCESS
        // --------------------------------------

        res.status(201).json({

            success: true,

            message:
                "Your enquiry has been submitted successfully."

        });


    } catch (error) {

        console.error(
            "Create Enquiry Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error while submitting enquiry."

        });

    }

};

// ============================================
// GET ARTIST ENQUIRIES
// ============================================

const getArtistEnquiries = async (req, res) => {

    try {

        // --------------------------------------
        // GET ARTIST ID
        // --------------------------------------

        const artistId =
            req.user.artist_id;


        if (!artistId) {

            return res.status(401).json({

                success: false,

                message:
                    "Artist authentication required."

            });

        }


        // --------------------------------------
        // GET ENQUIRIES
        // --------------------------------------

        const [enquiries] =
            await db.query(

                `SELECT

                    e.enquiry_id,
                    e.artwork_id,
                    e.artist_id,

                    e.buyer_name,
                    e.buyer_email,
                    e.buyer_phone,
                    e.message,

                    e.status,
                    e.created_at,

                    a.title AS artwork_title,
                    a.image AS artwork_image,
                    a.price AS artwork_price

                 FROM enquiries e

                 INNER JOIN artworks a
                    ON e.artwork_id =
                       a.artwork_id

                 WHERE e.artist_id = ?

                 ORDER BY e.created_at DESC`,

                [artistId]

            );


        // --------------------------------------
        // RESPONSE
        // --------------------------------------

        res.json({

            success: true,

            enquiries: enquiries

        });


    } catch (error) {

        console.error(
            "Get Artist Enquiries Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error while loading enquiries."

        });

    }

};

// ============================================
// UPDATE ENQUIRY STATUS
// ============================================

const updateEnquiryStatus = async (req, res) => {

    try {

        const artistId =
            req.user.artist_id;


        const enquiryId =
            req.params.id;


        const {
            status
        } = req.body;


        // --------------------------------------
        // VALIDATE STATUS
        // --------------------------------------

        const allowedStatuses = [

            "Pending",
            "Contacted",
            "Completed",
            "Cancelled"

        ];


        if (
            !allowedStatuses.includes(
                status
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid enquiry status."

            });

        }


        // --------------------------------------
        // UPDATE ONLY ARTIST'S OWN ENQUIRY
        // --------------------------------------

        const [result] =
            await db.query(

                `UPDATE enquiries

                 SET status = ?

                 WHERE enquiry_id = ?

                 AND artist_id = ?`,

                [

                    status,

                    enquiryId,

                    artistId

                ]

            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Enquiry not found."

            });

        }


        res.json({

            success: true,

            message:
                "Enquiry status updated successfully."

        });


    } catch (error) {

        console.error(
            "Update Enquiry Status Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error while updating enquiry."

        });

    }

};


// ============================================
// EXPORT
// ============================================

module.exports = {
    createEnquiry,
    getArtistEnquiries,
    updateEnquiryStatus
};