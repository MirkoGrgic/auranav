import { auth, db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";


// MOBILE MENU
const btn = document.getElementById("menuBtn");
const menu = document.getElementById("mobileMenu");

if (btn && menu) {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();

        menu.classList.toggle("hidden");

        if (dropdown) dropdown.classList.add("hidden");

        const userDropdown = document.querySelector(".user-dropdown");
        if (userDropdown) userDropdown.classList.add("hidden");
    });
}

function handleResize() {
    if (menu && window.innerWidth > 768) {
        menu.classList.add("hidden");
    }
}

window.addEventListener("resize", handleResize);
window.addEventListener("load", handleResize);


// NOTIFICATIONS
const notifications = [
    {
        text: "Weather alert: Rain expected in Paris tomorrow",
        time: "5 min ago"
    },
    {
        text: "Flight price dropped $50 for your NYC trip",
        time: "2 hours ago"
    },
    {
        text: "Your Barcelona itinerary is ready to view",
        time: "1 day ago"
    }
];

const bell = document.querySelector(".notification");
const dropdown = document.querySelector(".notif-dropdown");
const list = document.querySelector(".notif-list");
const badge = document.querySelector(".badge-count");

function renderNotifications() {
    if (!list || !badge) return;

    list.innerHTML = "";

    notifications.forEach(n => {
        const item = document.createElement("div");
        item.classList.add("notif-item");

        item.innerHTML = `
            <p>${n.text}</p>
            <span>${n.time}</span>
        `;

        list.appendChild(item);
    });

    badge.textContent = notifications.length;
}

if (bell && dropdown) {
    bell.addEventListener("click", (e) => {
        e.stopPropagation();

        dropdown.classList.toggle("hidden");

        if (menu) menu.classList.add("hidden");

        const userDropdown = document.querySelector(".user-dropdown");
        if (userDropdown) userDropdown.classList.add("hidden");
    });
}

renderNotifications();


// CLOSE DROPDOWNS ON OUTSIDE CLICK
document.addEventListener("click", () => {
    if (dropdown) dropdown.classList.add("hidden");

    const userDropdown = document.querySelector(".user-dropdown");
    if (userDropdown) userDropdown.classList.add("hidden");

    if (menu) menu.classList.add("hidden");
});

if (menu) {
    menu.addEventListener("click", (e) => {
        e.stopPropagation();
    });
}


// USER NAVBAR
const userArea = document.getElementById("userArea");
const dashboardLink = document.getElementById("dashboardLink");
const mobileDashboardLink = document.getElementById("mobileDashboardLink");

onAuthStateChanged(auth, async (user) => {

    // USER LOGGED IN
    if (user) {
        if (dashboardLink) dashboardLink.classList.remove("hidden");
        if (mobileDashboardLink) mobileDashboardLink.classList.remove("hidden");

        const fullName = user.displayName || "User";
        const firstName = fullName.split(" ")[0];

        if (userArea) {
            userArea.innerHTML = `
                <div class="user-profile">
                    <div class="user-info">
                        <div class="user-avatar">
                            <i data-lucide="circle-user-round"></i>
                        </div>
                        <span>${firstName}</span>
                    </div>

                    <div class="user-dropdown hidden">
                        <a href="/profile" class="user-dropdown-item">My Profile</a>
                        <a href="/admin" id="adminPanelLink" class="user-dropdown-item admin-link hidden">Admin Panel</a>
                        <div class="user-dropdown-divider"></div>
                        <button id="logoutBtn" class="user-dropdown-logout">
                            Logout
                        </button>
                    </div>
                </div>
            `;
        }

        if (window.lucide) {
            lucide.createIcons();
        }

        const userInfo = document.querySelector(".user-info");
        const userDropdown = document.querySelector(".user-dropdown");
        const logoutBtn = document.getElementById("logoutBtn");

        if (userInfo && userDropdown) {
            userInfo.addEventListener("click", (e) => {
                e.stopPropagation();

                userDropdown.classList.toggle("hidden");

                if (dropdown) dropdown.classList.add("hidden");
                if (menu) menu.classList.add("hidden");
            });
        }

        if (userDropdown) {
            userDropdown.addEventListener("click", (e) => {
                e.stopPropagation();
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener("click", async (e) => {
                e.stopPropagation();

                await signOut(auth);

                window.location.href = "/";
            });
        }

        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (
                userDocSnap.exists() &&
                userDocSnap.data().role === "admin"
            ) {
                const adminLink = document.getElementById("adminPanelLink");
                if (adminLink) adminLink.classList.remove("hidden");
            }

        } catch (err) {
            console.warn(
                "Admin status check failed:",
                err.message
            );
        }
    }

    // USER NOT LOGGED IN
    else {
        if (dashboardLink) dashboardLink.classList.add("hidden");
        if (mobileDashboardLink) mobileDashboardLink.classList.add("hidden");

        if (userArea) {
            userArea.innerHTML = `
                <a href="/login" class="login-link">
                    Log In
                </a>

                <a href="/signup">
                    <button class="btn-primary">
                        Sign Up
                    </button>
                </a>
            `;
        }
    }
});