// server/server.js

require('dotenv').config({ path: __dirname + '/.env' });

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ======================
// MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());

// --- OVDJE STAVI OVO ---
// Ako ti je mapa 'public' izvan mape 'server', koristimo ovo:
app.use(express.static(path.join(__dirname, '../public')));
// -----------------------

// ======================
// TEST ROUTE
// ======================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/signup.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/login.html"));
});

app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/dashboard.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/about.html"));
});

app.get("/explore", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/explore.html"));
});

app.get("/pricing", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/pricing.html"));
});
app.get("/profile", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/profile.html"));
});
app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin.html"));
});

app.get("/blog/:slug", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "../public/pages",
            `${req.params.slug}.html`
        )
    );
});

// ======================
// ROUTES (IMPORT)
// ======================
const tripsRoutes = require("./routes/trips");
const weatherRoutes = require("./routes/weather");
const aiRoutes = require("./routes/ai");
const locationsRoutes = require("./routes/locations");
const adminRoutes = require("./routes/admin");

// ======================
// ROUTES (USE)
// ======================
app.use("/api/trips", tripsRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/locations", locationsRoutes);
app.use("/api/admin", adminRoutes);

// ======================
// ERROR HANDLER
// ======================
app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(500).json({
        error: "Something went wrong",
    });
});

app.use((req, res) => {
    res.status(404).sendFile(
        path.join(__dirname, "../public/404.html")
    );
});

// ======================
// START SERVER
// ======================
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});