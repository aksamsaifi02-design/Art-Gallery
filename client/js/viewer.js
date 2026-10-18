let allArtworks = [];

// ============================================
// ESCAPE HTML
// ============================================

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ============================================
// MESSAGE HELPERS
// ============================================

function showGalleryMessage(message, type = "info") {
    const container = document.getElementById("galleryMessage");
    if (!container) return;
    container.innerHTML = `<div class="alert alert-${type}">${escapeHtml(message)}</div>`;
}

function showDetailsMessage(message, type = "info") {
    const container = document.getElementById("detailsMessage");
    if (!container) return;
    container.innerHTML = `<div class="alert alert-${type}">${escapeHtml(message)}</div>`;
}

function showEnquiryMessage(message, type = "info") {
    const container = document.getElementById("enquiryMessage");
    if (!container) return;
    container.innerHTML = `<div class="alert alert-${type}">${escapeHtml(message)}</div>`;
}

// ============================================
// PARSE PRICE (handles "620", 620, "₹620.00" etc.)
// ============================================

function parsePrice(value) {
    const cleaned = String(value ?? "0").replace(/[^0-9.-]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
}

// ============================================
// LOAD PUBLIC ARTWORKS
// ============================================

async function loadPublicArtworks() {
    try {
        const response = await fetch("/api/artworks/public");
        const result = await response.json();

        if (!result.success) {
            showGalleryMessage(result.message, "danger");
            return;
        }

        allArtworks = result.artworks || [];
        displayArtworks(allArtworks);

    } catch (error) {
        console.error("Load Public Artworks Error:", error);
        showGalleryMessage("Unable to load artworks.", "danger");
    }
}

// ============================================
// DISPLAY ARTWORKS (grid of cards)
// ============================================

function displayArtworks(artworks) {
    const container = document.getElementById("galleryContainer");
    if (!container) return;

    if (!artworks || artworks.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info text-center">
                No artworks found. Try adjusting your filters.
            </div>
        `;
        return;
    }

    container.innerHTML = artworks.map(artwork => `
        <div class="gallery-card">
            <div class="artwork-image-wrap">
                <span class="category-badge">${escapeHtml(artwork.category_name || "Artwork")}</span>
                <img
                    src="${escapeHtml(artwork.image)}"
                    class="artwork-image"
                    alt="${escapeHtml(artwork.title)}">
            </div>
            <div class="card-body">
                <h5 class="card-title">${escapeHtml(artwork.title)}</h5>
                <p class="artist-name">by ${escapeHtml(artwork.artist_name || "Unknown Artist")}</p>
                <p class="price">₹${parsePrice(artwork.price).toLocaleString("en-IN")}</p>
                <a href="artwork-details.html?id=${encodeURIComponent(artwork.artwork_id)}" class="btn btn-view w-100">
                    View Details
                </a>
            </div>
        </div>
    `).join("");
}

// ============================================
// APPLY ALL FILTERS (search + category + price + sort)
// This is the single source of truth for gallery filtering.
// ============================================

function applyFilters() {
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const minPriceInput = document.getElementById("minPrice");
    const maxPriceInput = document.getElementById("maxPrice");
    const sortFilter = document.getElementById("sortFilter");

    const searchText = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const selectedCategory = categoryFilter ? categoryFilter.value.trim().toLowerCase() : "";

    const minPrice = minPriceInput && minPriceInput.value.trim() !== ""
        ? parseFloat(minPriceInput.value)
        : null;

    const maxPrice = maxPriceInput && maxPriceInput.value.trim() !== ""
        ? parseFloat(maxPriceInput.value)
        : null;

    const selectedSort = sortFilter ? sortFilter.value : "";

    let filtered = allArtworks.filter(artwork => {
        const title = String(artwork.title || "").toLowerCase();
        const artist = String(artwork.artist_name || "").toLowerCase();
        const category = String(artwork.category_name || "").trim().toLowerCase();
        const price = parsePrice(artwork.price);

        const matchesSearch =
            searchText === "" ||
            title.includes(searchText) ||
            artist.includes(searchText) ||
            category.includes(searchText);

        const matchesCategory =
            selectedCategory === "" || category === selectedCategory;

        const matchesMinPrice = minPrice === null || price >= minPrice;
        const matchesMaxPrice = maxPrice === null || price <= maxPrice;

        return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });

    if (selectedSort === "price-low") {
        filtered.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (selectedSort === "price-high") {
        filtered.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    } else if (selectedSort === "name-az") {
        filtered.sort((a, b) => String(a.title || "").localeCompare(String(b.title || "")));
    } else if (selectedSort === "name-za") {
        filtered.sort((a, b) => String(b.title || "").localeCompare(String(a.title || "")));
    }

    displayArtworks(filtered);
}

// ============================================
// WIRE UP FILTER CONTROLS
// Every control triggers the same applyFilters(),
// so search + category + price + sort always work together.
// ============================================

function initFilters() {
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortFilter = document.getElementById("sortFilter");
    const applyPriceFilter = document.getElementById("applyPriceFilter");
    const resetFilter = document.getElementById("resetFilter");
    const clearFiltersButton = document.getElementById("clearFiltersButton");

    if (searchInput) searchInput.addEventListener("input", applyFilters);
    if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);
    if (sortFilter) sortFilter.addEventListener("change", applyFilters);
    if (applyPriceFilter) applyPriceFilter.addEventListener("click", applyFilters);

    function resetAll() {
        if (searchInput) searchInput.value = "";
        if (categoryFilter) categoryFilter.value = "";
        const minPriceInput = document.getElementById("minPrice");
        const maxPriceInput = document.getElementById("maxPrice");
        if (minPriceInput) minPriceInput.value = "";
        if (maxPriceInput) maxPriceInput.value = "";
        if (sortFilter) sortFilter.value = "";
        displayArtworks(allArtworks);
    }

    if (resetFilter) resetFilter.addEventListener("click", resetAll);
    if (clearFiltersButton) clearFiltersButton.addEventListener("click", resetAll);
}

// ============================================
// ARTWORK DETAILS PAGE
// ============================================

async function loadArtworkDetails() {
    try {
        const params = new URLSearchParams(window.location.search);
        const artworkId = params.get("id");

        if (!artworkId) {
            showDetailsMessage("Artwork ID is missing.", "danger");
            return;
        }

        const response = await fetch(`/api/artworks/public/${encodeURIComponent(artworkId)}`);
        const result = await response.json();

        if (!result.success) {
            showDetailsMessage(result.message, "danger");
            return;
        }

        const artwork = result.artwork;

        document.getElementById("artworkImage").src = artwork.image;
        document.getElementById("artworkImage").alt = artwork.title;
        document.getElementById("artworkTitle").textContent = artwork.title || "";
        document.getElementById("artworkPrice").textContent = `₹${parsePrice(artwork.price).toLocaleString("en-IN")}`;
        document.getElementById("artworkArtist").textContent = artwork.artist_name || "Unknown";
        document.getElementById("artworkCategory").textContent = artwork.category_name || "Not specified";
        document.getElementById("artworkMedium").textContent = artwork.medium || "Not specified";
        document.getElementById("artworkDimensions").textContent = artwork.dimensions || "Not specified";
        document.getElementById("artworkLocation").textContent = artwork.location || "Not specified";
        document.getElementById("artworkAvailability").textContent = artwork.availability || "Available";
        document.getElementById("artworkDescription").textContent = artwork.description || "No description available.";

        document.getElementById("artistName").textContent = artwork.artist_name || "Unknown";
        document.getElementById("artistBio").textContent = artwork.artist_bio || "The artist has not added a biography yet.";
        document.getElementById("artistEmail").textContent = artwork.artist_email || "Not provided";
        document.getElementById("artistPhone").textContent = artwork.artist_phone || "Not provided";
        document.getElementById("artistWhatsapp").textContent = artwork.artist_whatsapp || "Not provided";
        document.getElementById("artistInstagram").textContent = artwork.artist_instagram || "Not provided";

        document.getElementById("artworkDetails").style.display = "flex";
        document.getElementById("artistDetails").style.display = "block";

        // Build a click-to-chat WhatsApp link from the artist's WhatsApp
        // number (falls back to phone number if WhatsApp isn't set).
        const whatsappRaw = artwork.artist_whatsapp || artwork.artist_phone || "";
        const whatsappDigits = whatsappRaw.replace(/[^0-9]/g, "");

        const whatsappWrap = document.getElementById("whatsappLinkWrap");
        const whatsappLink = document.getElementById("whatsappLink");

        if (whatsappWrap && whatsappLink) {
            if (whatsappDigits.length >= 8) {
                const message = encodeURIComponent(
                    `Hi ${artwork.artist_name || ""}, I'm interested in your artwork "${artwork.title || ""}" listed on Art Gallery.`
                );
                whatsappLink.href = `https://wa.me/${whatsappDigits}?text=${message}`;
                whatsappWrap.style.display = "block";
            } else {
                whatsappWrap.style.display = "none";
            }
        }

        const contactButton = document.getElementById("contactArtistButton");
        if (contactButton) {
            contactButton.onclick = function () {
                window.location.href = `enquiry.html?id=${encodeURIComponent(artwork.artwork_id)}`;
            };
        }

    } catch (error) {
        console.error("Artwork Details Error:", error);
        showDetailsMessage("Unable to load artwork details.", "danger");
    }
}

// ============================================
// ENQUIRY PAGE
// ============================================

async function loadEnquiryPage() {
    try {
        const params = new URLSearchParams(window.location.search);
        const artworkId = params.get("id") || params.get("artwork_id");

        if (!artworkId) {
            showEnquiryMessage("Artwork ID is missing.", "danger");
            return;
        }

        const response = await fetch(`/api/artworks/public/${encodeURIComponent(artworkId)}`);
        const result = await response.json();

        if (!result.success) {
            showEnquiryMessage(result.message, "danger");
            return;
        }

        const artwork = result.artwork;

        const form = document.getElementById("enquiryForm");
        if (form) form.dataset.artworkId = artwork.artwork_id;

        const titleField = document.getElementById("enquiryArtworkTitle");
        if (titleField) titleField.value = artwork.title;

    } catch (error) {
        console.error("Load Enquiry Error:", error);
        showEnquiryMessage("Unable to load artwork.", "danger");
    }
}

function initEnquiryForm() {
    const enquiryForm = document.getElementById("enquiryForm");
    if (!enquiryForm) return;

    enquiryForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const artworkId = enquiryForm.dataset.artworkId;
        const buyerName = document.getElementById("buyerName").value.trim();
        const buyerEmail = document.getElementById("buyerEmail").value.trim();
        const buyerPhone = document.getElementById("buyerPhone").value.trim();
        const message = document.getElementById("buyerMessage").value.trim();

        if (!artworkId || !buyerName || !buyerEmail) {
            showEnquiryMessage("Please fill all required fields.", "danger");
            return;
        }

        try {
            const response = await fetch("/api/enquiries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    artwork_id: artworkId,
                    buyer_name: buyerName,
                    buyer_email: buyerEmail,
                    buyer_phone: buyerPhone,
                    message: message
                })
            });

            const result = await response.json();

            if (result.success) {
                showEnquiryMessage(result.message, "success");
                enquiryForm.reset();
                setTimeout(() => { window.location.href = "gallery.html"; }, 2000);
            } else {
                showEnquiryMessage(result.message, "danger");
            }

        } catch (error) {
            console.error("Submit Enquiry Error:", error);
            showEnquiryMessage("Unable to submit enquiry.", "danger");
        }
    });
}

// ============================================
// PAGE ROUTER — runs the right init for the current page
// ============================================

document.addEventListener("DOMContentLoaded", function () {
    const path = window.location.pathname;

    if (path.includes("/viewer/gallery.html")) {
        initFilters();
        loadPublicArtworks();
    }

    if (path.includes("/viewer/artwork-details.html")) {
        loadArtworkDetails();
    }

    if (path.includes("/viewer/enquiry.html")) {
        loadEnquiryPage();
        initEnquiryForm();
    }
});
