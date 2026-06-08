const OpenAI = require("openai");
const xml2js = require("xml2js");
const { db } = require("../firebase/config");

const client = new OpenAI({
    baseURL: "http://localhost:11434/v1",
    apiKey: "ollama",
});

function getTripDates(startDate, endDate) {
    const dates = [];

    const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
    const [endYear, endMonth, endDay] = endDate.split("-").map(Number);

    const current = new Date(startYear, startMonth - 1, startDay);
    const end = new Date(endYear, endMonth - 1, endDay);

    while (current <= end) {
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, "0");
        const day = String(current.getDate()).padStart(2, "0");

        dates.push(`${year}-${month}-${day}`);

        current.setDate(current.getDate() + 1);
    }

    return dates;
}

async function generatePlan(tripId, uid) {
    try {
        if (!uid || !tripId) {
            throw new Error("Missing uid or tripId inside generatePlan service.");
        }

        const tripRef = db.collection("users").doc(uid).collection("trips").doc(tripId);
        const locationsRef = tripRef.collection("locations");
        const weatherRef = tripRef.collection("weatherCache");
        const plansRef = tripRef.collection("plans");

        const tripSnap = await tripRef.get();

        if (!tripSnap.exists) {
            throw new Error("Trip document was not found.");
        }

        const tripData = tripSnap.data();

        const tripDates = getTripDates(tripData.startDate, tripData.endDate);

        const locationsSnap = await locationsRef.get();
        const locations = locationsSnap.docs.map(doc => doc.data());

        if (locations.length === 0) {
            throw new Error("No saved locations found for this trip.");
        }

        const locationList = locations
            .map(loc => `- Name: ${loc.name}, Category: ${loc.category}`)
            .join("\n");

        const weatherSnap = await weatherRef.get();
        let weatherData = weatherSnap.docs.map(doc => doc.data());

        weatherData.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

        const relevantWeather = weatherData.slice(0, 16);

        const currentUtcTime = new Date().toISOString();

        const prompt = `
        You are a professional travel planner.

        Trip destination: ${tripData.destination}
        Trip start date: ${tripData.startDate}
        Trip end date: ${tripData.endDate}
        Total user budget: $${tripData.budget}

        Trip dates that MUST be included:
        ${tripDates.map((date, index) => `Day ${index + 1}: ${date}`).join("\n")}

        Current Reference Time UTC: ${currentUtcTime}

        Weather forecast data:
        ${JSON.stringify(relevantWeather)}

        Available locations:
        ${locationList}

        IMPORTANT RULES:
        1. Use ONLY the provided available locations for main activities.
        2. You may add general meal breaks such as lunch, coffee, snacks, or dinner.
        3. Do not invent attractions that are not in the available locations list.
        4. Do not suggest stores, supermarkets, drugstores, malls, or random shopping places.
        5. You MUST create exactly ${tripDates.length} <day> elements.
        6. Each <day> must match one date from the required trip dates list.
        7. Each <day><date> must exactly match one of the required trip dates above.
        8. Never create a date before the trip start date.
        9. Never create a date after the trip end date.
        10. Do not skip any day.
        11. Do not stop early.
        12. Each day should include 3 to 5 items.
        13. Each item must include:
        - time
        - activity
        - detailed description
        - estimated cost
        - reason
        14. Keep the plan realistic for the user's budget.
        15. If exact prices are unknown, estimate reasonable prices in USD.
        16. If the budget is low, prefer free attractions, parks, viewpoints, walking routes, and affordable meals.
        17. If the budget is high, include better restaurants or premium experiences when appropriate.
        18. Lunch must be between 12:00 and 14:00.
        19. Dinner must be after 18:30.
        20. Coffee or snacks should be around 10:00 or 16:00.
        21. Do not invent weather.
        22. Only use weather information if that date exists in the weather forecast data.
        23. If weather data is missing for a day, plan normally without mentioning specific weather.
        24. If weather is Rain, prefer indoor places.
        25. If weather is Clear or Clouds, outdoor places are allowed.
        26. Keep descriptions practical and useful for a traveler.
        27. If you want to explain your planning logic, put it inside <planning_notes>. Do not write anything outside XML.
        28. Day titles must be unique, descriptive, and theme-based.
        29. Never include day numbers inside <title>.
        30. Never use generic titles like "${tripData.destination} Day 4", "${tripData.destination} Day 5", or "Welcome Day".
        31. Good title examples: "Historic Downtown & Waterfront", "Museums and Local Food", "Parks, Views & Evening Dining", "Culture and Neighborhood Walks".
        32. Avoid repeating the same locations too many times unless there are not enough alternatives.

        RETURN ONLY VALID XML.
        Do not include markdown.
        Do not include text before or after XML.

        XML SCHEMA:
        <travel_plan>
            <analysis>Short summary of budget, route, available weather data, and travel strategy.</analysis>
            <planning_notes>Short explanation of how the itinerary was planned.</planning_notes>
            <days>
                <day>
                    <date>YYYY-MM-DD</date>
                    <title>Short unique theme title only. Do not include "Day", numbers, dates, or generic destination-based titles.</title>
                    <item>
                        <time>HH:MM</time>
                        <activity>Location or activity name</activity>
                        <description>Detailed description of what the traveler can do, see, or experience.</description>
                        <estimated_cost>$20</estimated_cost>
                        <reason>Why this activity fits the time, route, budget, or available weather data.</reason>
                    </item>
                </day>
            </days>
        </travel_plan>
        `;

        const completion = await client.chat.completions.create({
            model: "qwen2.5:7b",
            messages: [
                {
                    role: "system",
                    content: "You are a travel assistant that returns only valid XML using the requested schema."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.25,
            max_tokens: 6000
        });

        const rawContent = completion.choices[0].message.content;

        let cleanXml = "";
        const match = rawContent.match(/<travel_plan>[\s\S]*?<\/travel_plan>/);

        if (match) {
            cleanXml = match[0];
        } else {
            cleanXml = rawContent.replace(/```xml|```/g, "").trim();
        }

        cleanXml = cleanXml.replace(/&(?!(amp|lt|gt|quot|apos);)/g, "&amp;");

        let result;

        try {
            const parser = new xml2js.Parser({
                explicitArray: false,
                trim: true
            });

            result = await parser.parseStringPromise(cleanXml);
        } catch (err) {
            console.error("XML PARSE ERROR. Raw output:", rawContent);
            throw new Error("AI returned an invalid XML format. Please try again.");
        }

        const daysRaw = result?.travel_plan?.days?.day;

        if (!daysRaw) {
            throw new Error("Travel plan days were not found in the AI response.");
        }

        const days = Array.isArray(daysRaw) ? daysRaw : [daysRaw];

        const existingPlans = await plansRef.get();

        if (!existingPlans.empty) {
            const deleteBatch = db.batch();

            existingPlans.forEach(doc => {
                deleteBatch.delete(doc.ref);
            });

            await deleteBatch.commit();
        }

        const batch = db.batch();
        const finalPlan = [];

        days.forEach((day, dayIndex) => {
            const itemsRaw = day.item;
            const items = Array.isArray(itemsRaw) ? itemsRaw : [itemsRaw];

            const normalizedDay = {
                date: day.date,
                title: day.title,
                items: []
            };

            items.forEach(item => {
                const planItem = {
                    tripId,
                    uid,
                    dayIndex,
                    date: day.date,
                    dayTitle: day.title,
                    time: item.time,
                    activity: item.activity,
                    description: item.description,
                    estimatedCost: item.estimated_cost,
                    reason: item.reason,
                    createdAt: new Date()
                };

                normalizedDay.items.push(planItem);

                const ref = plansRef.doc();
                batch.set(ref, planItem);
            });

            finalPlan.push(normalizedDay);
        });

        await batch.commit();

        return {
            analysis: result.travel_plan.analysis || "",
            planningNotes: result.travel_plan.planning_notes || "",
            itinerary: finalPlan
        };

    } catch (error) {
        console.error("AI SERVICE ERROR:", error);
        throw error;
    }
}

module.exports = { generatePlan };