const express = require("express");
const router = express.Router();

const { admin, db } = require("../firebase/config");
const { FieldValue } = require("firebase-admin/firestore");


router.delete("/delete-user/:uid", async (req, res) => {
    const { uid } = req.params;

    try {
        const tripsRef = db.collection("users").doc(uid).collection("trips");
        const tripsSnap = await tripsRef.get();

        if (!tripsSnap.empty) {
            const batch = db.batch();
            tripsSnap.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
        }

        await db.collection("users").doc(uid).delete();

        try {
            await admin.auth().deleteUser(uid);
        } catch (e) {
            console.warn("Auth delete warning:", e.message);
        }

        res.json({
            success: true,
            message: "User fully deleted"
        });

    } catch (err) {
        console.error("DELETE USER ERROR:", err);

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

router.delete("/delete-trip/:uid/:tripId", async (req, res) => {
    const { uid, tripId } = req.params;

    try {

        const tripRef = db
            .collection("users")
            .doc(uid)
            .collection("trips")
            .doc(tripId);

        // ===============================
        // DELETE LOCATIONS
        // ===============================

        const locationsSnap = await tripRef
            .collection("locations")
            .get();

        if (!locationsSnap.empty) {

            const batch = db.batch();

            locationsSnap.forEach(doc => {
                batch.delete(doc.ref);
            });

            await batch.commit();
        }

        // ===============================
        // DELETE PLANS
        // ===============================

        const plansSnap = await tripRef
            .collection("plans")
            .get();

        if (!plansSnap.empty) {

            const batch = db.batch();

            plansSnap.forEach(doc => {
                batch.delete(doc.ref);
            });

            await batch.commit();
        }

        // ===============================
        // DELETE WEATHER
        // ===============================

        const weatherSnap = await tripRef
            .collection("weatherCache")
            .get();

        if (!weatherSnap.empty) {

            const batch = db.batch();

            weatherSnap.forEach(doc => {
                batch.delete(doc.ref);
            });

            await batch.commit();
        }

        // ===============================
        // DELETE TRIP DOCUMENT
        // ===============================

        await tripRef.delete();

        res.json({
            success: true,
            message: "Trip fully deleted"
        });

    } catch (err) {

        console.error("DELETE TRIP ERROR:", err);

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

router.post("/create-user", async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
            success: false,
            error: "Missing required fields"
        });
    }

    try {
        // 1. Create Auth user
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: `${firstName} ${lastName}`
        });

        const uid = userRecord.uid;

        // 2. Save Firestore user (SAME FORMAT AS SIGNUP)
        await db.collection("users").doc(uid).set({
            uid,
            firstName,
            lastName,
            email,
            role: role || "user",
            createdAt: FieldValue.serverTimestamp()
        });

        res.json({
            success: true,
            uid
        });

    } catch (err) {
        console.error("CREATE USER ERROR:", err);

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

module.exports = router;