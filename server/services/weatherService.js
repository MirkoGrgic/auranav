const axios = require("axios");
const { db } = require("../firebase/config");

const API_KEY = process.env.WEATHER_API_KEY;

// Get coordinates from city name
async function getCoordinates(city) {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;

    const res = await axios.get(url);

    if (!res.data.length) {
        throw new Error("City not found");
    }

    return {
        lat: res.data[0].lat,
        lon: res.data[0].lon,
    };
}

// Check if forecast datetime is inside selected trip range
function isForecastInsideTripRange(datetime, startDate, endDate) {
    if (!startDate || !endDate) return true;

    const forecastDate = new Date(datetime);
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59`);

    return forecastDate >= start && forecastDate <= end;
}

// Fetch weather forecast and save it under the user's trip
async function fetchWeather(city, tripId, uid, startDate = null, endDate = null) {
    try {
        if (!uid) throw new Error("Missing uid for fetchWeather");

        const { lat, lon } = await getCoordinates(city);

        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

        const res = await axios.get(url);

        const weatherList = res.data.list || [];

        const filteredWeather = weatherList.filter(item =>
            isForecastInsideTripRange(item.dt_txt, startDate, endDate)
        );

        const weatherToSave =
            filteredWeather.length > 0
                ? filteredWeather
                : weatherList.slice(0, 40);

        const weatherRef = db
            .collection("users")
            .doc(uid)
            .collection("trips")
            .doc(tripId)
            .collection("weatherCache");

        const oldWeather = await weatherRef.get();

        const batch = db.batch();

        oldWeather.forEach(doc => {
            batch.delete(doc.ref);
        });

        weatherToSave.forEach((item) => {
            const ref = weatherRef.doc();

            batch.set(ref, {
                tripId,
                uid,
                datetime: item.dt_txt,
                temperature: item.main.temp,
                weather: item.weather?.[0]?.main || "Unknown",
                description: item.weather?.[0]?.description || "",
                createdAt: new Date()
            });
        });

        await batch.commit();

        return weatherToSave;

    } catch (error) {
        console.error("Weather error:", error.message);
        throw error;
    }
}

module.exports = {
    fetchWeather,
};