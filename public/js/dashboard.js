import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

let currentUid = null;
let tripsCache = [];

const tripSelect = document.getElementById("tripSelect");
const createTripBtn = document.getElementById("dashboardCreateTripBtn");

const destinationInput = document.getElementById("dashboardNewDestination");
const budgetInput = document.getElementById("dashboardNewBudget");
const startDateInput = document.getElementById("dashboardNewStartDate");
const endDateInput = document.getElementById("dashboardNewEndDate");

const weatherCards = document.getElementById("weatherCards");
const refreshWeatherBtn = document.getElementById("refreshWeatherBtn");

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "/login";
        return;
    }

    currentUid = user.uid;

    await loadTripsIntoSelect();
});

async function loadTripsIntoSelect() {
    if (!currentUid || !tripSelect) return;

    try {
        tripsCache = [];

        const tripsRef = collection(db, "users", currentUid, "trips");
        const snapshot = await getDocs(tripsRef);

        tripSelect.innerHTML = "";

        if (snapshot.empty) {
            tripSelect.innerHTML = `
                <option value="">No trips yet</option>
            `;

            renderEmptyWeather();
            return;
        }

        snapshot.forEach(docSnap => {
            const trip = docSnap.data();

            tripsCache.push({
                id: docSnap.id,
                ...trip
            });
        });

        tripsCache.sort((a, b) => {
            const aTime = a.createdAt?.toDate
                ? a.createdAt.toDate().getTime()
                : 0;

            const bTime = b.createdAt?.toDate
                ? b.createdAt.toDate().getTime()
                : 0;

            return bTime - aTime;
        });

        tripsCache.forEach(trip => {
            const option = document.createElement("option");

            option.value = trip.id;

            const dates =
                trip.startDate && trip.endDate
                    ? `${trip.startDate} → ${trip.endDate}`
                    : "No dates";

            option.textContent = `${trip.destination || "Unknown"} — ${dates}`;

            if (trip.active === true) {
                option.selected = true;
            }

            tripSelect.appendChild(option);
        });

        const activeTrip = tripsCache.find(trip => trip.active === true);

        if (activeTrip) {
            await loadWeatherCards(activeTrip);
        } else {
            renderEmptyWeather();
        }

    } catch (err) {
        console.error("Failed to load trips:", err);
        renderEmptyWeather();
    }
}

if (tripSelect) {
    tripSelect.addEventListener("change", async () => {
        const selectedTripId = tripSelect.value;

        if (!selectedTripId || !currentUid) return;

        await setActiveTrip(selectedTripId);

        window.location.reload();
    });
}

async function setActiveTrip(selectedTripId) {
    try {
        const tripsRef = collection(db, "users", currentUid, "trips");
        const snapshot = await getDocs(tripsRef);

        const updates = [];

        snapshot.forEach(docSnap => {
            const tripRef = doc(db, "users", currentUid, "trips", docSnap.id);

            updates.push(
                updateDoc(tripRef, {
                    active: docSnap.id === selectedTripId,
                    updatedAt: new Date()
                })
            );
        });

        await Promise.all(updates);

    } catch (err) {
        console.error("Failed to switch active trip:", err);
        alert("Could not switch trip. Please try again.");
    }
}

if (createTripBtn) {
    createTripBtn.addEventListener("click", async () => {
        await createTripFromDashboard();
    });
}

async function createTripFromDashboard() {
    const destination = destinationInput?.value.trim();
    const budget = budgetInput?.value.trim();
    const startDate = startDateInput?.value;
    const endDate = endDateInput?.value;

    if (!currentUid) {
        window.location.href = "/login";
        return;
    }

    if (!destination || !budget || !startDate || !endDate) {
        alert("Please fill in destination, dates, and budget.");
        return;
    }

    if (Number(budget) <= 0) {
        alert("Budget must be greater than 0.");
        return;
    }

    if (new Date(endDate) < new Date(startDate)) {
        alert("End date cannot be before start date.");
        return;
    }

    createTripBtn.disabled = true;
    createTripBtn.innerHTML = `
        Creating trip...
    `;

    try {
        const res = await fetch("http://localhost:3000/api/trips", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                uid: currentUid,
                destination,
                startDate,
                endDate,
                budget: Number(budget)
            })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Failed to create trip.");
        }

        if (data.tripId) {
            await setActiveTrip(data.tripId);
        }

        window.location.reload();

    } catch (err) {
        console.error("Create trip failed:", err);
        alert(err.message);

    } finally {
        createTripBtn.disabled = false;

        createTripBtn.innerHTML = `
            <i data-lucide="plus"></i>
            Create Trip
        `;

        if (window.lucide) {
            lucide.createIcons();
        }
    }
}

// ===============================
// WEATHER CARDS
// ===============================

async function loadWeatherCards(trip) {
    if (!trip || !currentUid || !weatherCards) return;

    try {
        weatherCards.innerHTML = `
            <div class="empty-state">
                Loading weather...
            </div>
        `;

        const res = await fetch(
            `http://localhost:3000/api/weather/${trip.id}?uid=${currentUid}`
        );

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Failed to load weather.");
        }

        renderWeatherCards(data);

    } catch (err) {
        console.error("Weather load failed:", err);

        weatherCards.innerHTML = `
            <div class="empty-state">
                Weather could not be loaded.
            </div>
        `;
    }
}

function renderWeatherCards(weatherData) {
    if (!weatherCards) return;

    if (!weatherData || weatherData.length === 0) {
        renderEmptyWeather("No weather data available.");
        return;
    }

    const grouped = groupWeatherByDate(weatherData);

    weatherCards.innerHTML = "";

    grouped.slice(0, 5).forEach(day => {
        const card = document.createElement("div");

        card.className = "weather-card";

        card.innerHTML = `
            <div>
                <strong>${formatWeatherDate(day.date)}</strong>
                <span>${day.weather}</span>
            </div>

            <div class="weather-icon">
                ${getWeatherIcon(day.weather)}
            </div>

            <div>
                <strong>${Math.round(day.avgTemp)}°C</strong>
            </div>
        `;

        weatherCards.appendChild(card);
    });
}

function renderEmptyWeather(message = "Weather will appear here.") {
    if (!weatherCards) return;

    weatherCards.innerHTML = `
        <div class="empty-state">
            ${message}
        </div>
    `;
}

function groupWeatherByDate(weatherData) {
    const groups = {};

    weatherData.forEach(item => {
        if (!item.datetime) return;

        const date = item.datetime.split(" ")[0];

        if (!groups[date]) {
            groups[date] = [];
        }

        groups[date].push(item);
    });

    return Object.keys(groups).map(date => {
        const items = groups[date];

        const avgTemp =
            items.reduce((sum, item) => {
                return sum + Number(item.temperature || 0);
            }, 0) / items.length;

        const weather = getMostCommonWeather(items);

        return {
            date,
            avgTemp,
            weather
        };
    });
}

function getMostCommonWeather(items) {
    const counts = {};

    items.forEach(item => {
        const key = item.weather || "Unknown";

        counts[key] = (counts[key] || 0) + 1;
    });

    return Object.keys(counts).sort((a, b) => {
        return counts[b] - counts[a];
    })[0] || "Unknown";
}

function getWeatherIcon(weather) {
    const value = String(weather).toLowerCase();

    if (value.includes("rain")) return "🌧️";
    if (value.includes("cloud")) return "☁️";
    if (value.includes("clear")) return "☀️";
    if (value.includes("snow")) return "❄️";
    if (value.includes("storm") || value.includes("thunder")) return "⛈️";
    if (value.includes("mist") || value.includes("fog")) return "🌫️";

    return "🌤️";
}

function formatWeatherDate(dateString) {
    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });
}

// ===============================
// REFRESH WEATHER
// ===============================

if (refreshWeatherBtn) {
    refreshWeatherBtn.addEventListener("click", async () => {
        const activeTrip = tripsCache.find(trip => trip.active === true);

        if (!activeTrip) {
            alert("No active trip selected.");
            return;
        }

        await refreshWeather(activeTrip);
    });
}

async function refreshWeather(trip) {
    if (!trip || !currentUid || !refreshWeatherBtn) return;

    try {
        refreshWeatherBtn.disabled = true;

        refreshWeatherBtn.innerHTML = `
            Refreshing weather...
        `;

        const res = await fetch("http://localhost:3000/api/weather/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                uid: currentUid,
                tripId: trip.id,
                destination: trip.destination,
                startDate: trip.startDate,
                endDate: trip.endDate
            })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Failed to refresh weather.");
        }

        await loadWeatherCards(trip);

    } catch (err) {
        console.error("Refresh weather failed:", err);
        alert(err.message);

    } finally {
        refreshWeatherBtn.disabled = false;

        refreshWeatherBtn.innerHTML = `
            <i data-lucide="refresh-cw"></i>
            Refresh Weather
        `;

        if (window.lucide) {
            lucide.createIcons();
        }
    }
}