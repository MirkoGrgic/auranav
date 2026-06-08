import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    collection,
    getDocs,
    query,
    where,
    limit,
    addDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";



// ===============================
// LEAFLET MAP
// ===============================

const map = L.map('map').setView([45.8150, 15.9819], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const markersLayer = L.layerGroup().addTo(map);



// ===============================
// GLOBAL STATE
// ===============================

let currentUid = null;
let currentTripId = null;
let currentCity = null;
let currentTripBudget = 0;



// ===============================
// AUTH
// ===============================

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "/login";
        return;
    }

    currentUid = user.uid;

    console.log("✅ User logged in:", currentUid);

    // pronađi ili kreiraj trip
    await loadOrCreateTrip();

    // učitaj lokacije
    if (currentTripId) {
        await loadLocations();
        await loadSavedPlan();
    }
});



// ===============================
// LOAD OR CREATE TRIP
// ===============================

async function loadOrCreateTrip() {
    try {
        const tripsRef = collection(
            db,
            "users",
            currentUid,
            "trips"
        );

        const q = query(
            tripsRef,
            where("active", "==", true),
            limit(1)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const tripDoc = snapshot.docs[0];
            const tripData = tripDoc.data();

            currentTripId = tripDoc.id;
            currentCity = tripData.destination;

            renderTripHeader(tripData);

            console.log("Active trip found:", currentCity);

            return;
        }

        currentTripId = null;
        currentCity = null;

        renderNoTripState();

        console.log(" No active trip. Waiting for user to create one.");

    } catch (err) {
        console.error(" loadOrCreateTrip error:", err);
    }
}

function renderTripHeader(tripData) {
    const destinationEl = document.getElementById("dashboardDestination");
    const datesEl = document.getElementById("dashboardDates");
    const budgetEl = document.getElementById("dashboardBudget");

    const destinationSmall = document.getElementById("dashboardDestinationSmall");
    const datesSmall = document.getElementById("dashboardDatesSmall");
    const budgetSmall = document.getElementById("dashboardBudgetSmall");

    const budgetCircleValue = document.getElementById("budgetCircleValue");
    const budgetTotalText = document.getElementById("budgetTotalText");

    const destination = tripData.destination || "Unknown";

    const dates =
        tripData.startDate && tripData.endDate
            ? `${tripData.startDate} → ${tripData.endDate}`
            : "Not selected";

    const budget =
        tripData.budget !== undefined && tripData.budget !== null
            ? `$${tripData.budget}`
            : "Not selected";

    currentTripBudget = Number(tripData.budget || 0);

    if (destinationEl) destinationEl.textContent = destination;
    if (datesEl) datesEl.textContent = dates;
    if (budgetEl) budgetEl.textContent = budget;

    if (destinationSmall) destinationSmall.textContent = destination;
    if (datesSmall) datesSmall.textContent = dates;
    if (budgetSmall) budgetSmall.textContent = budget;

    if (budgetCircleValue) budgetCircleValue.textContent = budget === "Not selected" ? "$0" : budget;
    if (budgetTotalText) budgetTotalText.textContent = budget;
}

function renderNoTripState() {
    const destinationEl = document.getElementById("dashboardDestination");
    const datesEl = document.getElementById("dashboardDates");
    const budgetEl = document.getElementById("dashboardBudget");

    const destinationSmall = document.getElementById("dashboardDestinationSmall");
    const datesSmall = document.getElementById("dashboardDatesSmall");
    const budgetSmall = document.getElementById("dashboardBudgetSmall");

    const budgetCircleValue = document.getElementById("budgetCircleValue");
    const budgetTotalText = document.getElementById("budgetTotalText");

    const status = document.getElementById("aiStatus");
    const aiButton = document.getElementById("aiBtn");
    const locationsList = document.getElementById("locationsList");

    if (destinationEl) destinationEl.textContent = "No trip selected";
    if (datesEl) datesEl.textContent = "—";
    if (budgetEl) budgetEl.textContent = "—";

    if (destinationSmall) destinationSmall.textContent = "No active trip";
    if (datesSmall) datesSmall.textContent = "—";
    if (budgetSmall) budgetSmall.textContent = "—";

    if (budgetCircleValue) budgetCircleValue.textContent = "$0";
    if (budgetTotalText) budgetTotalText.textContent = "Not selected";

    if (locationsList) {
        locationsList.innerHTML = `
            <div class="empty-state">
                Create or select a trip to load locations.
            </div>
        `;
    }

    if (status) {
        status.innerText = "Create a new trip to start planning.";
    }

    if (aiButton) {
        aiButton.disabled = true;
    }

    if (markersLayer) {
        markersLayer.clearLayers();
    }
    updateBudgetSnapshotFromItinerary([]);
}



// ===============================
// LOAD LOCATIONS
// ===============================

async function loadLocations() {
    try {
        if (!currentUid || !currentTripId) {
            return;
        }

        console.log("📍 Loading locations...");

        markersLayer.clearLayers();

        const locationsRef = collection(
            db,
            "users",
            currentUid,
            "trips",
            currentTripId,
            "locations"
        );

        const existingLocations = await getDocs(locationsRef);

        if (!existingLocations.empty) {
            console.log("✅ Existing locations found. No API call.");

            const savedLocations = [];

            existingLocations.forEach(docSnap => {
                const loc = docSnap.data();

                savedLocations.push(loc);
                renderMarker(loc);
            });

            renderLocationsList(savedLocations);
            fitMapToLocations(savedLocations);

            return;
        }

        console.log("🚀 No locations found. Fetching from backend...");

        const res = await fetch(
            `http://localhost:3000/api/locations?city=${currentCity}&tripId=${currentTripId}&uid=${currentUid}`
        );

        if (!res.ok) {
            throw new Error("API fetch failed.");
        }

        const locations = await res.json();

        locations.forEach(loc => {
            renderMarker(loc);
        });

        renderLocationsList(locations);
        fitMapToLocations(locations);

    } catch (err) {
        console.error("❌ loadLocations error:", err);
    }
}

// ===============================
// LOAD SAVED PLANS
// ===============================
async function loadSavedPlan() {
    try {
        if (!currentUid || !currentTripId) return;

        const resultDiv = document.getElementById("aiPlanResult");
        if (!resultDiv) return;

        const plansRef = collection(
            db,
            "users",
            currentUid,
            "trips",
            currentTripId,
            "plans"
        );

        const snapshot = await getDocs(plansRef);

        if (snapshot.empty) return;

        const planItems = [];

        snapshot.forEach(docSnap => {
            planItems.push(docSnap.data());
        });

        planItems.sort((a, b) => {
            if (Number(a.dayIndex) !== Number(b.dayIndex)) {
                return Number(a.dayIndex || 0) - Number(b.dayIndex || 0);
            }

            return String(a.time || "").localeCompare(String(b.time || ""));
        });

        const groupedDays = {};

        planItems.forEach(item => {
            const key = item.dayIndex ?? item.date ?? "0";

            if (!groupedDays[key]) {
                groupedDays[key] = {
                    date: item.date,
                    title: item.dayTitle,
                    items: []
                };
            }

            groupedDays[key].items.push(item);
        });

        const itinerary = Object.values(groupedDays);

        renderSavedItinerary(itinerary);
        updateBudgetSnapshotFromItinerary(itinerary);

    } catch (err) {
        console.error("Failed to load saved AI plan:", err);
    }
}



// ===============================
// RENDER MARKER
// ===============================

function renderMarker(loc) {
    if (!loc.lat || !loc.lng) return;

    const marker = L.marker([loc.lat, loc.lng]).addTo(markersLayer);

    marker.bindPopup(`
        <b>${loc.name}</b><br>
        ${loc.category || "Tourist Attraction"}
    `);
}


function renderLocationsList(locations) {
    const list = document.getElementById("locationsList");

    if (!list) return;

    list.innerHTML = "";

    if (!locations || locations.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                No locations found for this trip.
            </div>
        `;
        return;
    }

    locations.forEach(loc => {
        const item = document.createElement("div");
        item.className = "location-item";

        item.innerHTML = `
            <h4>${loc.name}</h4>
            <span>${loc.category || "Tourist Attraction"}</span>
        `;

        item.addEventListener("click", () => {
            if (!loc.lat || !loc.lng) return;

            map.setView([loc.lat, loc.lng], 16);

            L.popup()
                .setLatLng([loc.lat, loc.lng])
                .setContent(`
                    <b>${loc.name}</b><br>
                    ${loc.category || "Tourist Attraction"}
                `)
                .openOn(map);
        });

        list.appendChild(item);
    });
}

function fitMapToLocations(locations) {
    const validLocations = locations.filter(loc => loc.lat && loc.lng);

    if (validLocations.length === 0) return;

    const bounds = L.latLngBounds(
        validLocations.map(loc => [loc.lat, loc.lng])
    );

    map.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 14
    });
}
// ===============================
// BUDGET
// ===============================
function extractCost(value) {
    if (!value) return 0;

    const match = String(value).match(/[\d.]+/);

    return match ? Number(match[0]) : 0;
}

function updateBudgetSnapshotFromItinerary(itinerary) {
    const budgetCircleValue = document.getElementById("budgetCircleValue");
    const budgetTotalText = document.getElementById("budgetTotalText");
    const budgetSpentText = document.getElementById("budgetSpentText");
    const budgetRemainingText = document.getElementById("budgetRemainingText");
    const budgetStatusText = document.getElementById("budgetStatusText");
    const budgetCircle = document.querySelector(".budget-circle");

    const totalBudget = Number(currentTripBudget || 0);

    let estimatedSpent = 0;

    if (itinerary && itinerary.length > 0) {
        itinerary.forEach(day => {
            if (!day.items) return;

            day.items.forEach(item => {
                estimatedSpent += extractCost(item.estimatedCost);
            });
        });
    }

    const remaining = totalBudget - estimatedSpent;
    const usedPercent = totalBudget > 0
        ? Math.min((estimatedSpent / totalBudget) * 100, 100)
        : 0;

    if (budgetCircleValue) {
        budgetCircleValue.textContent = `$${Math.round(estimatedSpent)}`;
    }

    if (budgetTotalText) {
        budgetTotalText.textContent = totalBudget > 0
            ? `$${totalBudget}`
            : "Not selected";
    }

    if (budgetSpentText) {
        budgetSpentText.textContent = `$${Math.round(estimatedSpent)}`;
    }

    if (budgetRemainingText) {
        budgetRemainingText.textContent =
            remaining >= 0
                ? `$${Math.round(remaining)}`
                : `-$${Math.abs(Math.round(remaining))}`;
    }

    if (budgetStatusText) {
        if (totalBudget <= 0) {
            budgetStatusText.textContent = "No budget selected.";
        } else if (remaining >= 0) {
            budgetStatusText.textContent = "Your plan is within budget.";
        } else {
            budgetStatusText.textContent = `Over budget by $${Math.abs(Math.round(remaining))}.`;
        }
    }

    if (budgetCircle) {
        budgetCircle.style.background = `conic-gradient(#2563eb ${usedPercent}%, #e5e7eb 0)`;
    }
}



// ===============================
// AI BUTTON
// ===============================

const aiButton = document.getElementById("aiBtn");

if (aiButton) {

    aiButton.addEventListener("click", generateAiPlan);
}

// ===============================
// SPINNER
// ===============================
function showAiLoading() {
    const resultDiv = document.getElementById("aiPlanResult");

    if (!resultDiv) return;

    resultDiv.innerHTML = `
        <div class="ai-loading">
            <div class="ai-spinner"></div>

            <p class="ai-loading-text">
                AI is planning your adventure...
            </p>
        </div>
    `;
}
// ===============================
// RENDER SAVED ITINERARY
// ===============================
function renderSavedItinerary(itinerary) {
    const resultDiv = document.getElementById("aiPlanResult");

    if (!resultDiv) return;

    resultDiv.innerHTML = "";

    if (!itinerary || itinerary.length === 0) {
        resultDiv.innerHTML = `
            <div class="ai-empty-plan">
                <div class="ai-empty-icon">
                    <i data-lucide="route"></i>
                </div>

                <h3>No itinerary generated yet</h3>

                <p>
                    Generate a daily plan to see your personalized schedule,
                    activities, estimated costs, and travel tips here.
                </p>
            </div>
        `;

        if (window.lucide) {
            lucide.createIcons();
        }

        return;
    }

    itinerary.forEach((day, index) => {
        const dayBlock = document.createElement("div");

        dayBlock.style.cssText = `
            background:#f8fafc;
            padding:18px;
            border-radius:10px;
            border:1px solid #e5e7eb;
            margin-bottom:18px;
        `;

        dayBlock.innerHTML = `
            <h3 style="margin-bottom:6px;color:#111827;">
                Day ${index + 1}: ${day.title || "Trip Day"}
            </h3>

            <div style="font-size:14px;color:#64748b;margin-bottom:14px;">
                ${day.date || ""}
            </div>
        `;

        if (day.items && day.items.length > 0) {
            day.items.forEach(item => {
                const card = document.createElement("div");

                card.style.cssText = `
                    background:white;
                    padding:15px;
                    border-left:5px solid #2563eb;
                    border-radius:6px;
                    margin-bottom:10px;
                    box-shadow:0 2px 4px rgba(0,0,0,0.08);
                `;

                card.innerHTML = `
                    <div style="font-weight:bold;color:#2563eb;">
                        ${item.time || ""}
                    </div>

                    <div style="font-size:18px;margin:5px 0;font-weight:600;">
                        ${item.activity || ""}
                    </div>

                    <div style="font-size:14px;color:#374151;line-height:1.5;margin-bottom:8px;">
                        ${item.description || ""}
                    </div>

                    <div style="font-size:14px;color:#0f766e;font-weight:600;margin-bottom:6px;">
                        Estimated cost: ${item.estimatedCost || "Not specified"}
                    </div>

                    <div style="font-size:14px;color:#666;">
                        💡 ${item.reason || ""}
                    </div>
                `;

                dayBlock.appendChild(card);
            });
        }

        resultDiv.appendChild(dayBlock);
    });
}


// ===============================
// GENERATE AI PLAN
// ===============================

async function generateAiPlan() {

    const status = document.getElementById("aiStatus");
    const resultDiv = document.getElementById("aiPlanResult");
    const btn = document.getElementById("aiBtn");

    if (!currentUid || !currentTripId) {
        status.innerText = "❌ Missing trip or user.";
        return;
    }

    if (status) {
        status.innerText = "";
    }

    showAiLoading();

    btn.disabled = true;
    try {

        const res = await fetch(
            "http://localhost:3000/api/ai/generate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    tripId: currentTripId,
                    uid: currentUid
                })
            }
        );

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "AI service failed.");
        }

        status.innerText = "";

        // ===============================
        // ANALYSIS
        // ===============================

        const analysisDiv = document.getElementById("aiAnalysis");
        const analysisText = document.getElementById("analysisText");

        if (data.analysis) {
            analysisDiv.style.display = "block";
            analysisText.innerText = data.analysis;
        }

        // ===============================
        // ITINERARY
        // ===============================

        resultDiv.innerHTML = "";

        if (data.planningNotes) {
            const notes = document.createElement("div");

            notes.style.cssText = `
                background:#f8fafc;
                border-left:5px solid #2563eb;
                padding:12px;
                border-radius:6px;
                margin-bottom:15px;
                color:#334155;
                font-size:14px;
            `;

            notes.innerHTML = `
                <strong>Planning notes:</strong><br>
                ${data.planningNotes}
            `;

            resultDiv.appendChild(notes);
        }

        if (!data.itinerary || data.itinerary.length === 0) {
            resultDiv.innerHTML = `
                <div style="background:white;padding:15px;border-radius:6px;">
                    No itinerary items were generated.
                </div>
            `;
            return;
        }

        data.itinerary.forEach((day, index) => {

            const dayBlock = document.createElement("div");

            dayBlock.style.cssText = `
                background:#f8fafc;
                padding:18px;
                border-radius:10px;
                border:1px solid #e5e7eb;
                margin-bottom:18px;
            `;

            dayBlock.innerHTML = `
                <h3 style="margin-bottom:6px;color:#111827;">
                    Day ${index + 1}: ${day.title || "Trip Day"}
                </h3>

                <div style="font-size:14px;color:#64748b;margin-bottom:14px;">
                    ${day.date || ""}
                </div>
            `;

            if (day.items && day.items.length > 0) {

                day.items.forEach(item => {

                    const card = document.createElement("div");

                    card.style.cssText = `
                        background:white;
                        padding:15px;
                        border-left:5px solid #2563eb;
                        border-radius:6px;
                        margin-bottom:10px;
                        box-shadow:0 2px 4px rgba(0,0,0,0.08);
                    `;

                    card.innerHTML = `
                        <div style="font-weight:bold;color:#2563eb;">
                            ${item.time || ""}
                        </div>

                        <div style="font-size:18px;margin:5px 0;font-weight:600;">
                            ${item.activity || ""}
                        </div>

                        <div style="font-size:14px;color:#374151;line-height:1.5;margin-bottom:8px;">
                            ${item.description || ""}
                        </div>

                        <div style="font-size:14px;color:#0f766e;font-weight:600;margin-bottom:6px;">
                            Estimated cost: ${item.estimatedCost || "Not specified"}
                        </div>

                        <div style="font-size:14px;color:#666;">
                            💡 ${item.reason || ""}
                        </div>
                    `;

                    dayBlock.appendChild(card);

                });

            } else {

                const emptyDay = document.createElement("div");

                emptyDay.style.cssText = `
                    background:white;
                    padding:15px;
                    border-radius:6px;
                    color:#64748b;
                `;

                emptyDay.innerText = "No activities for this day.";

                dayBlock.appendChild(emptyDay);
            }

            resultDiv.appendChild(dayBlock);
        });
        updateBudgetSnapshotFromItinerary(data.itinerary);

    } catch (err) {

        console.error(err);

        status.innerText = "❌ " + err.message;

    } finally {

        btn.disabled = false;
    }
}