import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// DOM Navigacija
const menuDashboard = document.getElementById("menuDashboard");
const menuTrips = document.getElementById("menuTrips");

// DOM Elementi
const adminName = document.getElementById("adminName");
const statTotalUsers = document.getElementById("statTotalUsers");
const statTotalTrips = document.getElementById("statTotalTrips");
const statTotalAdmins = document.getElementById("statTotalAdmins");
const viewTitle = document.getElementById("viewTitle");
const btnRefresh = document.getElementById("btnRefresh");
const btnAddUser = document.getElementById("btnAddUser");
const adminMessage = document.getElementById("adminMessage");
const adminGlobalSearch = document.getElementById("adminGlobalSearch");
const dynamicContentContainer = document.getElementById("dynamicContentContainer");

// Modal DOM elementi
const userModal = document.getElementById("userModal");
const btnCloseModal = document.getElementById("btnCloseModal");
const modalForm = document.getElementById("modalForm");
const modalTitle = document.getElementById("modalTitle");
const modalUserId = document.getElementById("modalUserId");
const modalFirstName = document.getElementById("modalFirstName");
const modalLastName = document.getElementById("modalLastName");
const modalEmail = document.getElementById("modalEmail");
const modalPassword = document.getElementById("modalPassword");
const modalRole = document.getElementById("modalRole");
const passwordGroup = document.getElementById("passwordGroup");

// Država i Cache
let currentView = "dashboard"; // dashboard ili trips
let usersCache = [];
let tripsCache = [];
let currentAdminUid = null;

// 1. 🔒 AUTORIZACIJA
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "/login";
        return;
    }

    try {
        const userDocSnap = await getDoc(doc(db, "users", user.uid));
        if (userDocSnap.exists() && userDocSnap.data().role === "admin") {
            currentAdminUid = user.uid;
            adminName.textContent = userDocSnap.data().firstName || "Admin";

            await syncFirebaseData();
            switchView("dashboard");
        } else {
            alert("You do not have administrator privileges.");
            window.location.href = "/";
        }
    } catch (err) {
        console.error(err);
        window.location.href = "/login";
    }
});

// 2. SINKRONIZACIJA PODATAKA
async function syncFirebaseData() {
    try {
        usersCache = [];
        tripsCache = [];
        let totalAdmins = 0;

        const usersSnapshot = await getDocs(collection(db, "users"));
        for (const userDoc of usersSnapshot.docs) {
            const userData = userDoc.data();
            userData.id = userDoc.id;
            if (userData.role === "admin") totalAdmins++;

            const tripsSnapshot = await getDocs(collection(db, "users", userDoc.id, "trips"));
            userData.tripsCount = tripsSnapshot.size;

            tripsSnapshot.forEach(tripDoc => {
                const tripData = tripDoc.data();
                tripData.id = tripDoc.id;
                tripData.userUid = userDoc.id;
                tripData.userFullName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim();
                tripData.userEmail = userData.email || "";
                tripsCache.push(tripData);
            });
            usersCache.push(userData);
        }

        statTotalUsers.textContent = usersCache.length;
        statTotalAdmins.textContent = totalAdmins;
        statTotalTrips.textContent = tripsCache.length;
    } catch (err) {
        console.error(err);
        showNotification("Error occurred while loading data.", true);
    }
}

// 3. SELEKCIJA STRANICE (TAB CONTROLLER)
function switchView(viewName) {
    currentView = viewName;
    menuDashboard.classList.remove("active");
    menuTrips.classList.remove("active");
    adminGlobalSearch.value = "";

    if (viewName === "dashboard") {
        menuDashboard.classList.add("active");
        viewTitle.innerHTML = `<i class="fa-solid fa-users-gear"></i> User Management`;
        adminGlobalSearch.placeholder = "Search users...";
        btnAddUser.classList.remove("hidden"); // Prikaži gumb za dodavanje
        renderUsersTable(usersCache);
    } else if (viewName === "trips") {
        menuTrips.classList.add("active");
        viewTitle.innerHTML = `<i class="fa-solid fa-route"></i> Trip Overview`;
        adminGlobalSearch.placeholder = "Search trips...";
        btnAddUser.classList.add("hidden"); // Hide add user button
        renderTripsTable(tripsCache);
    }
}

// 4. RENDERING: TABLICA KORISNIKA (DASHBOARD)
function renderUsersTable(dataList) {
    dynamicContentContainer.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Registered</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="tableBody"></tbody>
        </table>`;

    const tbody = document.getElementById("tableBody");
    if (dataList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px;">No users found.</td></tr>`;
        return;
    }

    dataList.forEach(user => {
        const tr = document.createElement("tr");
        let regDate = user.createdAt ? (user.createdAt.toDate ? user.createdAt.toDate().toLocaleDateString("hr-HR") : new Date(user.createdAt).toLocaleDateString("hr-HR")) : "—";

        const adminActionBtn = user.role === "admin"
            ? `<button class="btn-action btn-make-admin" data-id="${user.id}" data-action="demote"><i class="fa-solid fa-user-minus"></i> Demote</button>`
            : `<button class="btn-action btn-make-admin" data-id="${user.id}" data-action="promote"><i class="fa-solid fa-user-shield"></i> Promote</button>`;

        tr.innerHTML = `
            <td><strong>${user.firstName || ""} ${user.lastName || ""}</strong><br><small style="color:#64748b;">Trips: ${user.tripsCount}</small></td>
            <td>${user.email || "—"}</td>
            <td><span class="badge ${user.role === 'admin' ? 'admin' : 'user'}">${user.role === 'admin' ? 'Admin' : 'User'}</span></td>
            <td>${regDate}</td>
            <td class="actions-cell">
                ${adminActionBtn}
                <button class="btn-action btn-edit" data-id="${user.id}"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                <button class="btn-action btn-delete" data-type="user" data-id="${user.id}"><i class="fa-solid fa-trash"></i> Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    attachTableListeners();
}

// 5. RENDERING: TABLICA PUTOVANJA
function renderTripsTable(dataList) {
    dynamicContentContainer.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Destination</th>
                    <th>User</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="tableBody"></tbody>
        </table>`;

    const tbody = document.getElementById("tableBody");
    if (dataList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px;">No trips found.</td></tr>`;
        return;
    }

    dataList.forEach(trip => {
        const tr = document.createElement("tr");
        let createdDate = trip.createdAt ? (trip.createdAt.toDate ? trip.createdAt.toDate().toLocaleDateString("hr-HR") : new Date(trip.createdAt).toLocaleDateString("hr-HR")) : "—";

        tr.innerHTML = `
            <td><i class="fa-solid fa-location-dot" style="color:#3b82f6;"></i> <strong>${trip.destination || "Zagreb"}</strong></td>
            <td><strong>${trip.userFullName}</strong><br><small>${trip.userEmail}</small></td>
            <td><span class="badge ${trip.active ? 'active-trip' : 'inactive-trip'}">${trip.active ? 'Active' : 'Completed'}</span></td>
            <td>${createdDate}</td>
            <td class="actions-cell">
                <button class="btn-action btn-delete" data-type="trip" data-userid="${trip.userUid}" data-id="${trip.id}"><i class="fa-solid fa-box-archive"></i> Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    attachTableListeners();
}

// 6. EVENT LISTENERI UNUTAR TABLICA
function attachTableListeners() {
    // Brza promjena uloge (Promote/Demote)
    document.querySelectorAll(".btn-make-admin").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.getAttribute("data-id");
            if (id === currentAdminUid) return alert("You cannot change your own role.");
            const targetUser = usersCache.find(u => u.id === id);
            const newRole = targetUser.role === "admin" ? "user" : "admin";

            await updateDoc(doc(db, "users", id), { role: newRole });
            showNotification("Role updated.");
            await refreshData();
        });
    });

    // Otvaranje modala za UREĐIVANJE
    document.querySelectorAll(".btn-edit").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            const user = usersCache.find(u => u.id === id);

            modalTitle.textContent = "Edit User";
            modalUserId.value = user.id;
            modalFirstName.value = user.firstName || "";
            modalLastName.value = user.lastName || "";
            modalEmail.value = user.email || "";
            modalRole.value = user.role || "user";

            passwordGroup.classList.add("hidden"); // Sakrij lozinku prilikom uređivanja (sigurnost)
            modalEmail.disabled = true; // Email je ključan račun, ne mijenja se olako

            userModal.classList.remove("hidden");
        });
    });

    // Brisanje stavki
    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", async () => {
            const type = btn.getAttribute("data-type");
            const id = btn.getAttribute("data-id");

            if (type === "user") {
                if (id === currentAdminUid) {
                    return alert("You cannot delete yourself.");
                }

                if (confirm("Are you sure you want to permanently delete this user?")) {
                    try {
                        const res = await fetch(`${window.location.origin}/api/admin/delete-user/${id}`, {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        });

                        const data = await res.json();

                        if (!res.ok || !data.success) {
                            throw new Error(data.error || "Delete failed");
                        }

                        showNotification("User successfully deleted.");
                        await refreshData();

                    } catch (err) {
                        console.error("Delete user error:", err);
                        showNotification("Failed to delete user.", true);
                    }
                }
            }

            else if (type === "trip") {

                const uid = btn.getAttribute("data-userid");

                if (confirm("Delete this trip?")) {

                    try {

                        const res = await fetch(
                            `${window.location.origin}/api/admin/delete-trip/${uid}/${id}`,
                            {
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }
                        );

                        const data = await res.json();

                        if (!res.ok || !data.success) {
                            throw new Error(data.error || "Trip delete failed");
                        }

                        showNotification("Trip deleted.");
                        await refreshData();

                    } catch (err) {

                        console.error(err);
                        showNotification("Failed to delete trip.", true);
                    }
                }
            }
        });
    });
}

// 7. POP-UP MODAL LOGIKA (DODAVANJE I SPREMANJE)
btnAddUser.addEventListener("click", () => {
    modalTitle.textContent = "Add New User";
    modalForm.reset();
    modalUserId.value = "";
    passwordGroup.classList.remove("hidden");
    modalEmail.disabled = false;
    userModal.classList.remove("hidden");
});

btnCloseModal.addEventListener("click", () => userModal.classList.add("hidden"));

modalForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = modalUserId.value;
    const fName = modalFirstName.value;
    const lName = modalLastName.value;
    const email = modalEmail.value;
    const role = modalRole.value;

    try {
        if (id) {
            // UREĐIVANJE POSTOJEĆEG
            await updateDoc(doc(db, "users", id), {
                firstName: fName,
                lastName: lName,
                role: role
            });
            showNotification("User updated successfully!");
        } else {
            // STVARANJE NOVOG (Zapis u Firestore s nasumičnim ID-jem)
            // Napomena: Za punu Auth integraciju korisnik se registrira kroz formu aplikacije, 
            // ali admin ga ovdje unosi direktno u bazu s predefiniranim parametrima.
            const res = await fetch(`${window.location.origin}/api/admin/create-user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstName: fName,
                    lastName: lName,
                    email: email,
                    password: modalPassword.value,
                    role: role
                })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || "User creation failed");
            }
            showNotification("New user profile saved in the database!");
        }
        userModal.classList.add("hidden");
        await refreshData();
    } catch (err) {
        console.error(err);
        showNotification("Error occurred while saving.", true);
    }
});

// 8. TRAŽILICA I OSVJEŽAVANJE
adminGlobalSearch.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();
    if (currentView === "dashboard") {
        const filtered = usersCache.filter(u => `${u.firstName} ${u.lastName}`.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
        renderUsersTable(filtered);
    } else {
        const filtered = tripsCache.filter(t => t.destination.toLowerCase().includes(term) || t.userFullName.toLowerCase().includes(term));
        renderTripsTable(filtered);
    }
});

async function refreshData() {
    await syncFirebaseData();
    switchView(currentView);
}

btnRefresh.addEventListener("click", refreshData);
menuDashboard.addEventListener("click", (e) => { e.preventDefault(); switchView("dashboard"); });
menuTrips.addEventListener("click", (e) => { e.preventDefault(); switchView("trips"); });

function showNotification(text, isError = false) {
    adminMessage.textContent = text;
    adminMessage.className = `admin-message ${isError ? 'error' : 'success'}`;
    adminMessage.classList.remove("hidden");
    setTimeout(() => adminMessage.classList.add("hidden"), 3000);
}