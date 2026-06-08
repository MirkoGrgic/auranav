const express = require("express");
const router = express.Router();
const { generatePlan } = require("../services/aiService");

// POST /api/ai/generate
router.post("/generate", async (req, res) => {
    try {
        const { tripId, uid } = req.body;
        if (!tripId) return res.status(400).json({ error: "Nedostaje tripId" });
        if (!uid) return res.status(400).json({ error: "Nedostaje uid" });

        const plan = await generatePlan(tripId, uid);
        res.json(plan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;