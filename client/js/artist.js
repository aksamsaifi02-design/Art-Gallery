const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const artistData = {

                name:
                    document.getElementById("name").value,

                email:
                    document.getElementById("email").value,

                password:
                    document.getElementById("password").value,

                phone:
                    document.getElementById("phone").value,

                whatsapp:
                    document.getElementById("whatsapp").value,

                instagram:
                    document.getElementById("instagram").value,

                location:
                    document.getElementById("location").value,

                bio:
                    document.getElementById("bio").value
            };


            try {

                const response =
                    await fetch(
                        "/api/artists/register",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(artistData)
                        }
                    );


                const result =
                    await response.json();


                const message =
                    document.getElementById(
                        "message"
                    );


                if (result.success) {

                    message.innerHTML = `
                        <div class="alert alert-success">
                            ${result.message}
                        </div>
                    `;

                    registerForm.reset();

                } else {

                    message.innerHTML = `
                        <div class="alert alert-danger">
                            ${result.message}
                        </div>
                    `;
                }


            } catch (error) {

                console.error(error);

                document.getElementById(
                    "message"
                ).innerHTML = `
                    <div class="alert alert-danger">
                        Something went wrong.
                    </div>
                `;
            }

        }
    );

}


//login page
const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "loginEmail"
                ).value;

            const password =
                document.getElementById(
                    "loginPassword"
                ).value;


            try {

                const response =
                    await fetch(
                        "/api/artists/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email,
                                password
                            })
                        }
                    );


                const result =
                    await response.json();


                const message =
                    document.getElementById(
                        "loginMessage"
                    );


                if (result.success) {

                    message.innerHTML = `
                        <div class="alert alert-success">
                            ${result.message}
                        </div>
                    `;


                    // Go to dashboard
                    setTimeout(() => {

                        window.location.href =
                            "dashboard.html";

                    }, 1000);


                } else {

                    message.innerHTML = `
                        <div class="alert alert-danger">
                            ${result.message}
                        </div>
                    `;
                }


            } catch (error) {

                console.error(error);

                document.getElementById(
                    "loginMessage"
                ).innerHTML = `
                    <div class="alert alert-danger">
                        Something went wrong.
                    </div>
                `;
            }

        }
    );

}

//load artist information into dashboard

// ============================================
// LOAD ARTIST PROFILE
// ============================================

async function loadArtistProfile() {

    try {

        const response =
            await fetch("/api/artists/profile");


        const result =
            await response.json();


        if (!result.success) {

            window.location.href =
                "login.html";

            return;

        }


        const artist = result.artist;


        // Dashboard welcome

        const artistName =
            document.getElementById(
                "artistName"
            );

        if (artistName) {

            artistName.textContent =
                artist.name;

        }


        // Profile information

        const profileName =
            document.getElementById(
                "profileName"
            );

        if (profileName) {

            profileName.textContent =
                artist.name || "-";

        }


        const profileEmail =
            document.getElementById(
                "profileEmail"
            );

        if (profileEmail) {

            profileEmail.textContent =
                artist.email || "-";

        }


        const profilePhone =
            document.getElementById(
                "profilePhone"
            );

        if (profilePhone) {

            profilePhone.textContent =
                artist.phone || "-";

        }


        const profileLocation =
            document.getElementById(
                "profileLocation"
            );

        if (profileLocation) {

            profileLocation.textContent =
                artist.location || "-";

        }


        const profileInstagram =
            document.getElementById(
                "profileInstagram"
            );

        if (profileInstagram) {

            profileInstagram.textContent =
                artist.instagram || "-";

        }


        const profileWhatsapp =
            document.getElementById(
                "profileWhatsapp"
            );

        if (profileWhatsapp) {

            profileWhatsapp.textContent =
                artist.whatsapp || "-";

        }


    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

    }

}

// load profile automatically

// ============================================
// CHECK DASHBOARD
// ============================================

if (
    window.location.pathname.includes(
        "/artist/dashboard.html"
    )
) {

    loadArtistProfile();

}

//logout function
// ============================================
// LOGOUT
// ============================================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async function () {

            try {

                const response =
                    await fetch(
                        "/api/artists/logout",
                        {
                            method: "POST"
                        }
                    );


                const result =
                    await response.json();


                if (result.success) {

                    window.location.href =
                        "login.html";

                }

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }

        }
    );

}

// ============================================
// ARTWORK UPLOAD
// ============================================

const artworkForm =
    document.getElementById(
        "artworkForm"
    );


if (artworkForm) {

    artworkForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const formData =
                new FormData(
                    artworkForm
                );


            const message =
                document.getElementById(
                    "artworkMessage"
                );


            try {

                const response =
                    await fetch(
                        "/api/artworks/upload",
                        {
                            method: "POST",

                            body: formData
                        }
                    );


                const result =
                    await response.json();


                if (result.success) {

                    message.innerHTML = `
                        <div class="alert alert-success">
                            ${result.message}
                        </div>
                    `;


                    artworkForm.reset();


                } else {

                    message.innerHTML = `
                        <div class="alert alert-danger">
                            ${result.message}
                        </div>
                    `;

                }


            } catch (error) {

                console.error(
                    "Upload error:",
                    error
                );


                message.innerHTML = `
                    <div class="alert alert-danger">
                        Something went wrong while uploading.
                    </div>
                `;

            }

        }
    );

}


// ============================================
// LOAD MY ARTWORKS
// ============================================

async function loadMyArtworks() {

    try {

        const response =
            await fetch(
                "/api/artworks/my-artworks"
            );


        const result =
            await response.json();


        // --------------------------------------
        // CHECK LOGIN
        // --------------------------------------

        if (!result.success) {

            window.location.href =
                "login.html";

            return;

        }


        const container =
            document.getElementById(
                "artworksContainer"
            );


        if (!container) {
            return;
        }


        // --------------------------------------
        // NO ARTWORKS
        // --------------------------------------

        if (
            !result.artworks ||
            result.artworks.length === 0
        ) {

            container.innerHTML = `

                <div class="col-12">

                    <div class="alert alert-info">

                        You have not uploaded
                        any artwork yet.

                    </div>

                </div>

            `;

            return;

        }


        // --------------------------------------
        // DISPLAY ARTWORKS
        // --------------------------------------

        container.innerHTML =
            result.artworks.map(
                artwork => `

                <div class="col-md-4">

                    <div class="card h-100 shadow-sm">

                        <img
                            src="${artwork.image}"
                            class="card-img-top"
                            style="
                                height: 250px;
                                object-fit: cover;
                            "
                            alt="${artwork.title}"
                        >

                        <div class="card-body">

                            <h5 class="card-title">

                                ${artwork.title}

                            </h5>


                            <p class="mb-1">

                                <strong>
                                    Price:
                                </strong>

                                ₹${artwork.price}

                            </p>


                            <p class="mb-1">

                                <strong>
                                    Category:
                                </strong>

                                ${artwork.category_name || "N/A"}

                            </p>


                            <p class="mb-3">

                                <strong>
                                    Status:
                                </strong>

                                ${artwork.availability}

                            </p>


                            <div>

                                <button
                                    class="btn btn-warning btn-sm"
                                    onclick="
                                        editArtwork(
                                            ${artwork.artwork_id}
                                        )
                                    ">

                                    Edit

                                </button>


                                <button
                                    class="btn btn-danger btn-sm"
                                    onclick="
                                        deleteArtwork(
                                            ${artwork.artwork_id}
                                        )
                                    ">

                                    Delete

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            `
            ).join("");


    } catch (error) {

        console.error(
            "Load Artworks Error:",
            error
        );


        const message =
            document.getElementById(
                "artworksMessage"
            );


        if (message) {

            message.innerHTML = `

                <div class="alert alert-danger">

                    Unable to load artworks.

                </div>

            `;

        }

    }

}

// ============================================
// CHECK MY ARTWORKS PAGE
// ============================================

if (
    window.location.pathname.includes(
        "/artist/my-artworks.html"
    )
) {

    loadMyArtworks();

}

// ============================================
// DELETE ARTWORK
// ============================================

async function deleteArtwork(artworkId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this artwork?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/artworks/${artworkId}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (result.success) {

            alert(
                "Artwork deleted successfully."
            );


            loadMyArtworks();

        } else {

            alert(
                result.message
            );

        }


    } catch (error) {

        console.error(
            "Delete Error:",
            error
        );


        alert(
            "Unable to delete artwork."
        );

    }

}

// ============================================
// EDIT ARTWORK
// ============================================

function editArtwork(artworkId) {

    window.location.href =
        `edit-artwork.html?id=${artworkId}`;

}

// ============================================
// LOAD ARTWORK FOR EDITING
// ============================================

async function loadArtworkForEdit() {

    const form =
        document.getElementById(
            "editArtworkForm"
        );


    if (!form) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const artworkId =
        params.get("id");


    if (!artworkId) {

        window.location.href =
            "my-artworks.html";

        return;

    }


    try {

        const response =
            await fetch(
                `/api/artworks/${artworkId}`
            );


        const result =
            await response.json();


        if (!result.success) {

            alert(
                result.message
            );

            window.location.href =
                "my-artworks.html";

            return;

        }


        const artwork =
            result.artwork;


        // --------------------------------------
        // FILL FORM
        // --------------------------------------

        document.getElementById(
            "editTitle"
        ).value =
            artwork.title || "";


        document.getElementById(
            "editPrice"
        ).value =
            artwork.price || "";


        document.getElementById(
            "editCategory"
        ).value =
            artwork.category_id || "";


        document.getElementById(
            "editMedium"
        ).value =
            artwork.medium || "";


        document.getElementById(
            "editDimensions"
        ).value =
            artwork.dimensions || "";


        document.getElementById(
            "editLocation"
        ).value =
            artwork.location || "";


        document.getElementById(
            "editAvailability"
        ).value =
            artwork.availability || "Available";


        document.getElementById(
            "editDescription"
        ).value =
            artwork.description || "";


        // Save ID for submit

        form.dataset.artworkId =
            artworkId;


    } catch (error) {

        console.error(
            "Load Edit Artwork Error:",
            error
        );

    }

}

// ============================================
// UPDATE ARTWORK FORM
// ============================================

const editArtworkForm =
    document.getElementById(
        "editArtworkForm"
    );


if (editArtworkForm) {

    editArtworkForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const artworkId =
                editArtworkForm.dataset.artworkId;


            const formData =
                new FormData(
                    editArtworkForm
                );


            const data = {

                title:
                    formData.get("title"),

                price:
                    formData.get("price"),

                category_id:
                    formData.get("category_id"),

                medium:
                    formData.get("medium"),

                dimensions:
                    formData.get("dimensions"),

                location:
                    formData.get("location"),

                availability:
                    formData.get("availability"),

                description:
                    formData.get("description")

            };


            const message =
                document.getElementById(
                    "editMessage"
                );


            try {

                const response =
                    await fetch(
                        `/api/artworks/${artworkId}`,
                        {

                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(data)

                        }
                    );


                const result =
                    await response.json();


                if (result.success) {

                    message.innerHTML = `

                        <div class="alert alert-success">

                            ${result.message}

                        </div>

                    `;


                    setTimeout(
                        function () {

                            window.location.href =
                                "my-artworks.html";

                        },
                        1000
                    );


                } else {

                    message.innerHTML = `

                        <div class="alert alert-danger">

                            ${result.message}

                        </div>

                    `;

                }


            } catch (error) {

                console.error(
                    "Update Artwork Error:",
                    error
                );


                message.innerHTML = `

                    <div class="alert alert-danger">

                        Unable to update artwork.

                    </div>

                `;

            }

        }
    );

}

// ============================================
// CHECK EDIT PAGE
// ============================================

if (
    window.location.pathname.includes(
        "/artist/edit-artwork.html"
    )
) {

    loadArtworkForEdit();

}

// ============================================
// LOAD PROFILE PAGE
// ============================================

async function loadProfilePage() {

    try {

        const response =
            await fetch(
                "/api/artists/profile"
            );


        const result =
            await response.json();


        if (!result.success) {

            window.location.href =
                "login.html";

            return;

        }


        const artist =
            result.artist;


        document.getElementById(
            "profileNameInput"
        ).value =
            artist.name || "";


        document.getElementById(
            "profileEmailInput"
        ).value =
            artist.email || "";


        document.getElementById(
            "profilePhoneInput"
        ).value =
            artist.phone || "";


        document.getElementById(
            "profileWhatsappInput"
        ).value =
            artist.whatsapp || "";


        document.getElementById(
            "profileInstagramInput"
        ).value =
            artist.instagram || "";


        document.getElementById(
            "profileLocationInput"
        ).value =
            artist.location || "";


        document.getElementById(
            "profileBioInput"
        ).value =
            artist.bio || "";


    } catch (error) {

        console.error(
            "Load Profile Error:",
            error
        );

    }

}

// ============================================
// UPDATE PROFILE FORM
// ============================================

const profileForm =
    document.getElementById(
        "profileForm"
    );


if (profileForm) {

    profileForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const formData =
                new FormData(
                    profileForm
                );


            const data = {

                name:
                    formData.get("name"),

                phone:
                    formData.get("phone"),

                whatsapp:
                    formData.get("whatsapp"),

                instagram:
                    formData.get("instagram"),

                location:
                    formData.get("location"),

                bio:
                    formData.get("bio")

            };


            const message =
                document.getElementById(
                    "profileMessage"
                );


            try {

                const response =
                    await fetch(
                        "/api/artists/profile",
                        {

                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(data)

                        }
                    );


                const result =
                    await response.json();


                if (result.success) {

                    message.innerHTML = `

                        <div class="alert alert-success">

                            ${result.message}

                        </div>

                    `;


                    // Refresh dashboard information
                    setTimeout(
                        function () {

                            window.location.href =
                                "dashboard.html";

                        },
                        1000
                    );


                } else {

                    message.innerHTML = `

                        <div class="alert alert-danger">

                            ${result.message}

                        </div>

                    `;

                }


            } catch (error) {

                console.error(
                    "Update Profile Error:",
                    error
                );


                message.innerHTML = `

                    <div class="alert alert-danger">

                        Unable to update profile.

                    </div>

                `;

            }

        }
    );

}


// ============================================
// CHECK PROFILE PAGE
// ============================================

if (
    window.location.pathname.includes(
        "/artist/profile.html"
    )
) {

    loadProfilePage();

}

// ============================================
// LOAD ARTIST ENQUIRIES
// ============================================

async function loadArtistEnquiries() {

    try {

        const token =
            localStorage.getItem(
                "artistToken"
            );
            localStorage.setItem(
            "artistRole",
            result.artist.role
);


        if (!token) {

            window.location.href =
                "login.html";

            return;

        }


        const response =
            await fetch(
                "/api/enquiries/artist",
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const result =
            await response.json();


        if (!result.success) {

            showArtistEnquiryMessage(
                result.message,
                "danger"
            );

            return;

        }


        displayArtistEnquiries(
            result.enquiries
        );


    } catch (error) {

        console.error(
            "Load Artist Enquiries Error:",
            error
        );


        showArtistEnquiryMessage(
            "Unable to load enquiries.",
            "danger"
        );

    }

}

// ============================================
// DISPLAY ARTIST ENQUIRIES
// ============================================

function displayArtistEnquiries(
    enquiries
) {

    const container =
        document.getElementById(
            "enquiriesContainer"
        );


    if (!container) {
        return;
    }


    // ------------------------------------------
    // NO ENQUIRIES
    // ------------------------------------------

    if (
        !enquiries ||
        enquiries.length === 0
    ) {

        container.innerHTML = `

            <div class="col-12">

                <div class="alert alert-info text-center">

                    You don't have any enquiries yet.

                </div>

            </div>

        `;

        return;

    }


    // ------------------------------------------
    // DISPLAY ENQUIRIES
    // ------------------------------------------

    container.innerHTML =
        enquiries.map(
            enquiry => `

            <div class="col-lg-6">

                <div class="card
                            enquiry-card
                            shadow-sm
                            h-100">


                    <div class="card-body">


                        <!-- ARTWORK -->

                        <h5>

                            ${escapeArtistHtml(
                                enquiry.artwork_title
                            )}

                        </h5>


                        <p class="text-muted">

                            Price:
                            ₹${enquiry.artwork_price}

                        </p>


                        <hr>


                        <!-- BUYER -->

                        <h6>
                            Buyer Information
                        </h6>


                        <p class="mb-1">

                            <strong>
                                Name:
                            </strong>

                            ${escapeArtistHtml(
                                enquiry.buyer_name
                            )}

                        </p>


                        <p class="mb-1">

                            <strong>
                                Email:
                            </strong>

                            ${escapeArtistHtml(
                                enquiry.buyer_email
                            )}

                        </p>


                        <p class="mb-1">

                            <strong>
                                Phone:
                            </strong>

                            ${escapeArtistHtml(
                                enquiry.buyer_phone ||
                                "Not provided"
                            )}

                        </p>


                        <hr>


                        <!-- MESSAGE -->

                        <h6>
                            Message
                        </h6>


                        <p class="text-muted">

                            ${escapeArtistHtml(
                                enquiry.message ||
                                "No message provided."
                            )}

                        </p>


                        <hr>


                        <!-- DATE -->

                        <p>

                            <strong>
                                Received:
                            </strong>

                            ${formatEnquiryDate(
                                enquiry.created_at
                            )}

                        </p>


                        <!-- STATUS -->

                        <div class="mb-3">

                            <label
                                class="form-label">

                                Status

                            </label>


                            <select
                                class="form-select enquiry-status"
                                data-id="${enquiry.enquiry_id}">

                                <option
                                    value="Pending"
                                    ${
                                        enquiry.status ===
                                        "Pending"
                                        ? "selected"
                                        : ""
                                    }>

                                    Pending

                                </option>


                                <option
                                    value="Contacted"
                                    ${
                                        enquiry.status ===
                                        "Contacted"
                                        ? "selected"
                                        : ""
                                    }>

                                    Contacted

                                </option>


                                <option
                                    value="Completed"
                                    ${
                                        enquiry.status ===
                                        "Completed"
                                        ? "selected"
                                        : ""
                                    }>

                                    Completed

                                </option>


                                <option
                                    value="Cancelled"
                                    ${
                                        enquiry.status ===
                                        "Cancelled"
                                        ? "selected"
                                        : ""
                                    }>

                                    Cancelled

                                </option>

                            </select>

                        </div>


                        <button
                            class="btn btn-primary update-enquiry-btn"
                            data-id="${enquiry.enquiry_id}">

                            Update Status

                        </button>


                    </div>

                </div>

            </div>

        `
        ).join("");


    attachEnquiryEvents();

}

// ============================================
// ATTACH ENQUIRY EVENTS
// ============================================

function attachEnquiryEvents() {

    const buttons =
        document.querySelectorAll(
            ".update-enquiry-btn"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    const enquiryId =
                        this.dataset.id;


                    updateEnquiryStatus(
                        enquiryId
                    );

                }
            );

        }
    );

}

// ============================================
// UPDATE ENQUIRY STATUS
// ============================================

async function updateEnquiryStatus(
    enquiryId
) {

    try {

        const select =
            document.querySelector(
                `.enquiry-status[data-id="${enquiryId}"]`
            );


        const status =
            select.value;


        const token =
            localStorage.getItem(
                "artistToken"
            );


        const response =
            await fetch(
                `/api/enquiries/artist/${enquiryId}`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify({

                            status:
                                status

                        })

                }
            );


        const result =
            await response.json();


        if (result.success) {

            showArtistEnquiryMessage(
                result.message,
                "success"
            );


            loadArtistEnquiries();

        } else {

            showArtistEnquiryMessage(
                result.message,
                "danger"
            );

        }


    } catch (error) {

        console.error(
            "Update Enquiry Error:",
            error
        );


        showArtistEnquiryMessage(
            "Unable to update enquiry.",
            "danger"
        );

    }

}

// ============================================
// ENQUIRY MESSAGE
// ============================================

function showArtistEnquiryMessage(
    message,
    type = "info"
) {

    const container =
        document.getElementById(
            "enquiryMessage"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="alert alert-${type}">

            ${escapeArtistHtml(message)}

        </div>

    `;

}

// ============================================
// ESCAPE HTML
// ============================================

function escapeArtistHtml(value) {

    return String(value || "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}

// ============================================
// FORMAT DATE
// ============================================

function formatEnquiryDate(
    date
) {

    if (!date) {
        return "Unknown";
    }


    return new Date(
        date
    ).toLocaleString();

}

// ============================================
// ENQUIRY PAGE
// ============================================

if (
    window.location.pathname.includes(
        "/artist/enquiries.html"
    )
) {

    loadArtistEnquiries();

}