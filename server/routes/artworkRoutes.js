const express = require("express");

const {
    uploadArtwork,
    getMyArtworks,
    deleteArtwork,
    getArtworkById,
    updateArtwork,
    getPublicArtworks,
    getPublicArtworkDetails
} = require("../controllers/artworkController");

const upload =
    require("../middleware/uploadMiddleware");

const router = express.Router();


// ============================================
// UPLOAD
// ============================================

router.post(
    "/upload",
    upload.single("image"),
    uploadArtwork
);


// ============================================
// MY ARTWORKS
// ============================================

router.get(
    "/my-artworks",
    getMyArtworks
);

// ============================================
// PUBLIC ARTWORKS
// ============================================

router.get(
    "/public",
    getPublicArtworks
);

// ============================================
// PUBLIC ARTWORK DETAILS
// ============================================

router.get(
    "/public/:id",
    getPublicArtworkDetails
);

// ============================================
// GET SINGLE ARTWORK
// ============================================

router.get(
    "/:id",
    getArtworkById
);


// ============================================
// UPDATE
// ============================================

router.put(
    "/:id",
    updateArtwork
);


// ============================================
// DELETE
// ============================================

router.delete(
    "/:id",
    deleteArtwork
);




module.exports = router;