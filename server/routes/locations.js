const express = require("express");
const router = express.Router();
const axios = require("axios");
const { db } = require("../firebase/config");
const { fetchWeather } = require("../services/weatherService");

const SERVICE_KEY = process.env.FOURSQUARE_API_KEY;

// MIX KATEGORIJA ZA RAZNOLIKOST
const CATEGORIES = [
    "16000", // landmarks
    "10027", // museums
    "16032", // parks
    "10000", // entertainment
    "13065", // restaurants 
    "13000"  // food & drink general 
];

router.get("/", async (req, res) => {
    const city = req.query.city || "Zagreb";
    const tripId = req.query.tripId || "manual-search";
    const uid = req.query.uid;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    if (!uid || !tripId) {
        return res.status(400).json({ error: "Nedostaju obavezni parametri: uid i tripId." });
    }

    const locationsRef = db.collection("users").doc(uid).collection("trips").doc(tripId).collection("locations");
    const weatherRef = db.collection("users").doc(uid).collection("trips").doc(tripId).collection("weatherCache");

    try {
        const existingDocs = await locationsRef.limit(1).get();

        if (!existingDocs.empty) {
            console.log(`Lokacije za tripId: ${tripId} već postoje u bazi kod korisnika ${uid}. Preskačem API poziv.`);
            // 1. Obriši stare prognoze za taj tripId da ne puniš bazu smećem
            const oldWeather = await weatherRef.get();
            const batch = db.batch();
            oldWeather.forEach(doc => batch.delete(doc.ref));
            await batch.commit();

            await fetchWeather(city, tripId, uid, startDate, endDate);

            // Dohvaćamo postojeće lokacije da ih vratimo frontendu radi mape
            const snapshot = await locationsRef.get();
            const existingPlaces = snapshot.docs.map(doc => doc.data());
            return res.json(existingPlaces);
        }
        console.log(`Prvo dohvaćanje lokacija za: ${city} (User: ${uid}, Trip: ${tripId})`);

        try {
            await fetchWeather(city, tripId, uid, startDate, endDate);
            console.log("✅ Vrijeme uspješno dohvaćeno i spremljeno u Firebase.");
        } catch (weatherErr) {
            console.error("⚠️ Problem s vremenom, nastavljam samo s lokacijama:", weatherErr.message);
        }

        const requests = CATEGORIES.map(cat =>
            axios.get("https://places-api.foursquare.com/places/search", {
                headers: {
                    Authorization: `Bearer ${SERVICE_KEY}`,
                    Accept: "application/json",
                    "X-Places-Api-Version": "2025-06-17"
                },
                params: {
                    near: city,
                    categories: cat,
                    limit: 15
                }
            })
        );

        const responses = await Promise.all(requests);
        const seen = new Set();
        const batch = db.batch();

        const places = responses.flatMap(r =>
            r.data.results
                .filter(p => {
                    if (seen.has(p.fsq_place_id)) return false;
                    seen.add(p.fsq_place_id);
                    return true;
                })
                .map(place => {
                    let catName = place.categories?.[0]?.name || "Tourist Attraction";

                    const placeData = {
                        tripId: tripId,
                        uid: uid,
                        name: place.name,
                        lat: place.latitude,
                        lng: place.longitude,
                        category: catName,
                        createdAt: new Date()
                    };
                    const customId = `${tripId}_${place.name.replace(/\s+/g, '_')}`;
                    const docRef = locationsRef.doc(customId);
                    batch.set(docRef, placeData);

                    return placeData;
                })
        );
        if (places.length > 0) {
            await batch.commit();
            console.log(` Spremljeno ${places.length} lokacija u Firebase pod ID: ${tripId}`);
        }

        res.json(places);

    } catch (error) {
        console.error("GREŠKA:", error.response?.data || error.message);

        res.status(500).json({
            error: "Foursquare API error",
            message: error.response?.data?.message || error.message
        });
    }
});

module.exports = router;