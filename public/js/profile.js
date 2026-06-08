import { auth, db } from "./firebase.js";
import { doc, getDoc, updateDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { onAuthStateChanged, updateProfile, updatePassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Selekcija elemenata s profila
const metaFullName = document.getElementById("metaFullName");
const metaEmail = document.getElementById("metaEmail");
const metaRole = document.getElementById("metaRole");
const statTrips = document.getElementById("statTrips");

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("profileEmail");
const travelStyleInput = document.getElementById("travelStyle");
const budgetTierInput = document.getElementById("budgetTier");

const personalInfoForm = document.getElementById("personalInfoForm");
const preferencesForm = document.getElementById("preferencesForm");
const securityForm = document.getElementById("securityForm");
const messageBox = document.getElementById("profileMessage");

// Pomoćna funkcija za prikaz obavijesti na vrhu kartice
function showMessage(text, isError = false) {
    messageBox.textContent = text;
    messageBox.className = `profile-message ${isError ? 'error' : 'success'}`;
    messageBox.classList.remove("hidden");

    setTimeout(() => {
        messageBox.classList.add("hidden");
    }, 4000);
}

// Prati status prijave korisnika
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        // Ako nitko nije ulogiran, prebaci ga na login
        window.location.href = "/login";
        return;
    }

    // Učitaj osnovno iz Authentication profila
    emailInput.value = user.email;
    metaEmail.textContent = user.email;

    if (user.displayName) {
        const names = user.displayName.split(" ");
        firstNameInput.value = names[0] || "";
        lastNameInput.value = names.slice(1).join(" ") || "";
        metaFullName.textContent = user.displayName;
    }

    // 1. Povuci ulogu i dodatne preferencije iz Firestore baze (Glavni dokument korisnika)
    try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const data = userDocSnap.data();

            // Ako polja postoje u bazi, popuni formu
            if (data.firstName) firstNameInput.value = data.firstName;
            if (data.lastName) lastNameInput.value = data.lastName;
            if (data.role) {
                metaRole.textContent = data.role;
                if (data.role === "admin") {
                    metaRole.style.background = "#fef2f2";
                    metaRole.style.color = "#ef4444";
                }
            }

            // Preferencije za AI planer
            if (data.travelStyle) travelStyleInput.value = data.travelStyle;
            if (data.budgetTier) budgetTierInput.value = data.budgetTier;
        }
    } catch (err) {
        console.error("Error fetching user document:", err);
    }

    // 2. 📊 TOČAN POPRAVAK: Brojanje dokumenata unutar subkolekcije "users/UID/trips"
    try {
        // 🔍 LOG ZA PROVJERU UID-ja:
        console.log("Trenutno ulogirani korisnik na stranici ima UID:", user.uid);
        console.log("Putanja koju JS traži u bazi: users/" + user.uid + "/trips");

        const subCollectionRef = collection(db, "users", user.uid, "trips");
        const querySnapshot = await getDocs(subCollectionRef);

        console.log("Broj pronađenih dokumenata na toj putanji:", querySnapshot.size);

        statTrips.textContent = querySnapshot.size;
    } catch (tripsErr) {
        console.error("Error counting trips from subcollection:", tripsErr.message);
        statTrips.textContent = "0";
    }
});

// FORM 1: Spremanje osobnih podataka
personalInfoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const fName = firstNameInput.value.trim();
    const lName = lastNameInput.value.trim();
    const newDisplayName = `${fName} ${lName}`;

    try {
        // 1. Ažuriraj u Firebase Auth profilu
        await updateProfile(user, { displayName: newDisplayName });

        // 2. Ažuriraj u Firestore dokumentu
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
            firstName: fName,
            lastName: lName
        });

        metaFullName.textContent = newDisplayName;
        showMessage("Personal information updated successfully!");
    } catch (err) {
        showMessage("Failed to update personal info: " + err.message, true);
    }
});

// FORM 2: Spremanje AI preferencija za putovanja
preferencesForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
            travelStyle: travelStyleInput.value,
            budgetTier: budgetTierInput.value
        });

        showMessage("AI travel preferences saved!");
    } catch (err) {
        showMessage("Failed to save preferences: " + err.message, true);
    }
});

// FORM 3: Sigurnost i promjena lozinke
securityForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const newPassword = document.getElementById("newPassword").value;

    if (newPassword.length < 6) {
        showMessage("Password must be at least 6 characters long.", true);
        return;
    }

    try {
        await updatePassword(user, newPassword);
        document.getElementById("newPassword").value = ""; // isprazni input
        showMessage("Password updated successfully!");
    } catch (err) {
        // Firebase često traži ponovnu prijavu ako je lozinka osjetljiva operacija
        if (err.code === "auth/requires-recent-login") {
            showMessage("Please log out and log back in to perform this action.", true);
        } else {
            showMessage("Failed to update password: " + err.message, true);
        }
    }
});