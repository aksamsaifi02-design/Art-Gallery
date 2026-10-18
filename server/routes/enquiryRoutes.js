const express = require("express");

const router =
    express.Router();


const {
    createEnquiry,
    getArtistEnquiries,
    updateEnquiryStatus
} = require(
    "../controllers/enquiryController"
);


// ============================================
// CREATE ENQUIRY
// ============================================

router.post(
    "/",
    createEnquiry
);

// ============================================
// GET ARTIST ENQUIRIES
// ============================================

router.get(
    "/artist",
    getArtistEnquiries
);


// ============================================
// UPDATE ENQUIRY STATUS
// ============================================

router.put(
    "/artist/:id",
    updateEnquiryStatus
);


module.exports = router;