const express = require("express");
const router = express.Router();

const { db } = require("../firebase/config");
const { fetchWeather } = require("../services/weatherService");

// POST /api/trips
router.post("/", async (req, res) => {
    try {
        const {
            uid,
            destination,
            startDate,
            endDate,
            budget
        } = req.body;

        if (!uid) {
            return res.status(400).json({ error: "Missing user uid." });
        }

        if (!destination || !startDate || !endDate || !budget) {
            return res.status(400).json({ error: "Missing required trip fields." });
        }

        const tripsRef = db
            .collection("users")
            .doc(uid)
            .collection("trips");

        const activeTripsSnapshot = await tripsRef
            .where("active", "==", true)
            .get();

        const batch = db.batch();

        activeTripsSnapshot.forEach((tripDoc) => {
            batch.update(tripDoc.ref, {
                active: false,
                updatedAt: new Date()
            });
        });

        const newTripRef = tripsRef.doc();

        const newTrip = {
            uid,
            destination,
            startDate,
            endDate,
            budget: Number(budget),
            active: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        batch.set(newTripRef, newTrip);

        await batch.commit();

        const tripId = newTripRef.id;

        await fetchWeather(destination, tripId, uid, startDate, endDate);

        res.json({
            message: "Trip created successfully.",
            tripId,
            trip: newTrip
        });

    } catch (error) {
        console.error("Trip creation error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});

// GET /api/trips/:id?uid=USER_UID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { uid } = req.query;

        if (!uid) {
            return res.status(400).json({ error: "Missing uid." });
        }

        const tripSnap = await db
            .collection("users")
            .doc(uid)
            .collection("trips")
            .doc(id)
            .get();

        if (!tripSnap.exists) {
            return res.status(404).json({ error: "Trip not found." });
        }

        res.json({
            id: tripSnap.id,
            ...tripSnap.data()
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;