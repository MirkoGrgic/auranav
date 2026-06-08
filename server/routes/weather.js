const express = require("express");
const router = express.Router();
const { db } = require("../firebase/config");
const { fetchWeather } = require("../services/weatherService");

// GET /api/weather/:tripId?uid=...
router.get("/:tripId", async (req, res) => {
    try {
        const { tripId } = req.params;
        const uid = req.query.uid;

        if (!uid || !tripId) {
            return res.status(400).json({
                error: "Missing uid or tripId."
            });
        }

        const snapshot = await db
            .collection("users")
            .doc(uid)
            .collection("trips")
            .doc(tripId)
            .collection("weatherCache")
            .get();

        const data = snapshot.docs.map((doc) => doc.data());

        data.sort((a, b) => {
            return new Date(a.datetime) - new Date(b.datetime);
        });

        res.json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/weather/refresh
router.post("/refresh", async (req, res) => {
    try {
        const {
            uid,
            tripId,
            destination,
            startDate,
            endDate
        } = req.body;

        if (!uid || !tripId || !destination) {
            return res.status(400).json({
                error: "Missing uid, tripId, or destination."
            });
        }

        const weather = await fetchWeather(
            destination,
            tripId,
            uid,
            startDate,
            endDate
        );

        res.json({
            message: "Weather refreshed successfully.",
            weather
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;