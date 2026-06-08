import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const ctaButton = document.getElementById("ctaButton");

const destinationInput = document.getElementById("destinationInput");
const dateRangeInput = document.getElementById("dateRangeInput");
const budgetInput = document.getElementById("budgetInput");
const generateTripBtn = document.getElementById("generateTripBtn");

let currentUser = null;
let selectedStartDate = null;
let selectedEndDate = null;

onAuthStateChanged(auth, (user) => {
    currentUser = user;

    if (ctaButton) {
        if (user) {
            ctaButton.href = "/dashboard";
            ctaButton.innerText = "Go To Dashboard";
        } else {
            ctaButton.href = "/signup";
            ctaButton.innerText = "Get Started Free";
        }
    }
});

if (dateRangeInput && window.flatpickr) {
    flatpickr(dateRangeInput, {
        mode: "range",
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: (selectedDates) => {
            if (selectedDates.length === 2) {
                selectedStartDate = formatDate(selectedDates[0]);
                selectedEndDate = formatDate(selectedDates[1]);
            }
        }
    });
}

function formatDate(date) {
    return date.toISOString().split("T")[0];
}

if (generateTripBtn) {
    generateTripBtn.addEventListener("click", createTripFromSearch);
}

async function createTripFromSearch() {
    const destination = destinationInput.value.trim();
    const budget = Number(budgetInput.value);

    if (!currentUser) {
        window.location.href = "/signup";
        return;
    }

    if (!destination) {
        alert("Please enter a city.");
        destinationInput.focus();
        return;
    }

    if (!selectedStartDate || !selectedEndDate) {
        alert("Please select your trip dates.");
        dateRangeInput.focus();
        return;
    }

    if (!budget || budget <= 0) {
        alert("Please enter a valid budget.");
        budgetInput.focus();
        return;
    }

    try {
        generateTripBtn.disabled = true;
        generateTripBtn.innerHTML = `<i data-lucide="loader-circle"></i> Creating Trip...`;

        if (window.lucide) lucide.createIcons();

        const response = await fetch("http://localhost:3000/api/trips", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                uid: currentUser.uid,
                destination,
                startDate: selectedStartDate,
                endDate: selectedEndDate,
                budget
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Trip creation failed.");
        }

        sessionStorage.setItem("activeTripId", data.tripId);

        window.location.href = "/dashboard";

    } catch (error) {
        console.error(error);
        alert(error.message);
    } finally {
        generateTripBtn.disabled = false;
        generateTripBtn.innerHTML = `<i data-lucide="search"></i> Generate My Trip`;

        if (window.lucide) lucide.createIcons();
    }
}