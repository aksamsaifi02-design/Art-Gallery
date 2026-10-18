// ============================================
// ADMIN.JS
// Art Gallery — Admin Login + Dashboard
// ============================================

function showLoginMessage(message, type = "danger") {
    const container = document.getElementById("loginMessage");
    if (!container) return;
    container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
}

// ============================================
// ADMIN LOGIN (login.html)
// ============================================

function initAdminLoginForm() {
    const form = document.getElementById("adminLoginForm");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("adminEmail").value.trim();
        const password = document.getElementById("adminPassword").value.trim();

        if (!email || !password) {
            showLoginMessage("Please enter both email and password.");
            return;
        }

        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (result.success) {
                window.location.href = "dashboard.html";
            } else {
                showLoginMessage(result.message || "Invalid email or password.");
            }

        } catch (error) {
            console.error("Admin login error:", error);
            showLoginMessage("Unable to log in right now. Please try again.");
        }
    });
}

// ============================================
// SESSION CHECK (dashboard.html)
// ============================================

async function checkAdminAccess() {
    try {
        const response = await fetch("/api/admin/session", {
            credentials: "include"
        });

        if (!response.ok) {
            window.location.href = "login.html";
            return false;
        }

        const result = await response.json();

        const adminNameEl = document.getElementById("adminName");
        if (adminNameEl && result.admin) {
            adminNameEl.textContent = result.admin.name;
        }

        return true;

    } catch (error) {
        console.error("Admin session check failed:", error);
        window.location.href = "login.html";
        return false;
    }
}

// ============================================
// LOAD ADMIN DASHBOARD STATISTICS
// ============================================

async function loadAdminStats() {
    try {
        const response = await fetch("/api/admin/stats", {
            method: "GET",
            credentials: "include"
        });

        if (response.status === 401) {
            window.location.href = "login.html";
            return;
        }

        const result = await response.json();

        if (!result.success) {
            console.error("Admin statistics error:", result.message);
            return;
        }

        const artistCount = document.getElementById("artistCount");
        if (artistCount) artistCount.textContent = result.stats.artists;

        const artworkCount = document.getElementById("artworkCount");
        if (artworkCount) artworkCount.textContent = result.stats.artworks;

        const enquiryCount = document.getElementById("enquiryCount");
        if (enquiryCount) enquiryCount.textContent = result.stats.enquiries;

    } catch (error) {
        console.error("Failed to load admin statistics:", error);
    }
}

// ============================================
// ADMIN LOGOUT
// ============================================

function initLogoutButton() {
    const logoutButton = document.getElementById("logoutButton");
    if (!logoutButton) return;

    logoutButton.addEventListener("click", async function () {
        try {
            await fetch("/api/admin/logout", {
                method: "POST",
                credentials: "include"
            });
        } catch (error) {
            console.error("Logout error:", error);
        }

        window.location.href = "login.html";
    });
}

// ============================================
// START
// ============================================

document.addEventListener("DOMContentLoaded", async function () {
    initAdminLoginForm();
    initLogoutButton();

    // Only the dashboard page has this container
    if (document.getElementById("artistCount")) {
        const allowed = await checkAdminAccess();
        if (allowed) {
            loadAdminStats();
        }
    }
});
