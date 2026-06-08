const articles = [


    {
        id: 1,
        slug: "hidden-gems-croatia",
        title: "10 Hidden Gems in Croatia You Must Visit",
        excerpt: "Discover secret beaches, ancient towns, and stunning landscapes tourists often miss.",
        image: "assets/makarska.jpg",
        category: "Destinations",
        readTime: "8 min read",
        estimatedCost: "$1,200",
        destination: "Croatia"
    },

    {
        id: 2,
        slug: "canadian-rockies-guide",
        title: "Exploring the Canadian Rockies",
        excerpt: "Discover turquoise lakes, scenic mountain drives, and unforgettable hiking trails.",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200",
        category: "Destinations",
        readTime: "9 min read",
        estimatedCost: "$2,400",
        destination: "Canada"
    },

    {
        id: 3,
        slug: "weekend-in-prague",
        title: "A Weekend in Prague",
        excerpt: "Experience medieval streets, gothic castles, and charming cafés in the Czech capital.",
        image: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1200",
        category: "Destinations",
        readTime: "5 min read",
        estimatedCost: "$900",
        destination: "Prague"
    },

    {
        id: 4,
        slug: "beauty-of-switzerland",
        title: "The Beauty of Switzerland",
        excerpt: "Explore alpine villages, breathtaking train rides, and crystal-clear lakes.",
        image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200",
        category: "Destinations",
        readTime: "11 min read",
        estimatedCost: "$3,100",
        destination: "Switzerland"
    },

    {
        id: 5,
        slug: "dubai-luxury-travel-guide",
        title: "Dubai Luxury Travel Guide",
        excerpt: "Everything you need to know about luxury hotels, desert safaris, and skyline views.",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200",
        category: "Destinations",
        readTime: "7 min read",
        estimatedCost: "$2,900",
        destination: "Dubai"
    },

    {
        id: 6,
        slug: "discovering-cape-town",
        title: "Discovering Cape Town",
        excerpt: "From Table Mountain to penguin beaches, explore South Africa’s coastal gem.",
        image: "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?w=1200",
        category: "Destinations",
        readTime: "8 min read",
        estimatedCost: "$2,000",
        destination: "Cape Town"
    },


    {
        id: 7,
        slug: "budgeting-for-zagreb",
        title: "Budgeting for Zagreb: A Complete Guide",
        excerpt: "Everything you need to know about costs in Croatia's capital city.",
        image: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=1200",
        category: "Budget Tips",
        readTime: "6 min read",
        estimatedCost: "$800",
        destination: "Zagreb"
    },

    {
        id: 8,
        slug: "new-york-city-on-a-budget",
        title: "New York City on a Budget",
        excerpt: "See the Big Apple without overspending using these local tricks.",
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200",
        category: "Budget Tips",
        readTime: "7 min read",
        estimatedCost: "$1,400",
        destination: "New York"
    },

    {
        id: 9,
        slug: "cheap-eats-in-rome",
        title: "Cheap Eats in Rome",
        excerpt: "Enjoy authentic Italian cuisine without paying tourist prices.",
        image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200",
        category: "Budget Tips",
        readTime: "4 min read",
        estimatedCost: "$1,100",
        destination: "Rome"
    },

    {
        id: 10,
        slug: "travel-europe-by-train",
        title: "Travel Europe by Train for Less",
        excerpt: "Save hundreds with rail passes, overnight trains, and smart booking hacks.",
        image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1200",
        category: "Budget Tips",
        readTime: "9 min read",
        estimatedCost: "$1,700",
        destination: "Europe"
    },

    {
        id: 11,
        slug: "backpacking-australia-budget",
        title: "Backpacking Australia on $50 a Day",
        excerpt: "Hostels, cheap transport, and hidden budget-friendly destinations.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
        category: "Budget Tips",
        readTime: "10 min read",
        estimatedCost: "$2,300",
        destination: "Australia"
    },

    {
        id: 12,
        slug: "cheap-flights-2026",
        title: "How to Find Cheap Flights in 2026",
        excerpt: "Best tools and strategies to save money on international airfare.",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200",
        category: "Budget Tips",
        readTime: "5 min read",
        estimatedCost: "$500",
        destination: "Worldwide"
    },


    {
        id: 13,
        slug: "ultimate-tokyo-food-tour",
        title: "The Ultimate Tokyo Food Tour",
        excerpt: "From ramen shops to Michelin-starred sushi experiences.",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200",
        category: "Food & Culture",
        readTime: "10 min read",
        estimatedCost: "$2,200",
        destination: "Tokyo"
    },

    {
        id: 14,
        slug: "bangkok-street-food-adventure",
        title: "Street Food Adventures in Bangkok",
        excerpt: "Taste Thailand’s best night markets and hidden food alleys.",
        image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200",
        category: "Food & Culture",
        readTime: "8 min read",
        estimatedCost: "$1,300",
        destination: "Bangkok"
    },

    {
        id: 15,
        slug: "italian-cuisine-beyond-pizza",
        title: "Italian Cuisine Beyond Pizza",
        excerpt: "Discover authentic pasta dishes, local wines, and hidden trattorias.",
        image: "https://images.unsplash.com/photo-1498579809087-ef1e558fd1da?w=1200",
        category: "Food & Culture",
        readTime: "6 min read",
        estimatedCost: "$2,100",
        destination: "Italy"
    },

    {
        id: 16,
        slug: "markets-of-marrakech",
        title: "Traditional Markets of Marrakech",
        excerpt: "Navigate colorful souks full of spices, textiles, and local crafts.",
        image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200",
        category: "Food & Culture",
        readTime: "7 min read",
        estimatedCost: "$1,600",
        destination: "Morocco"
    },

    {
        id: 17,
        slug: "best-tacos-mexico-city",
        title: "Mexican Tacos You Need to Try",
        excerpt: "A culinary journey through Mexico City’s best taco spots.",
        image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=1200",
        category: "Food & Culture",
        readTime: "5 min read",
        estimatedCost: "$1,000",
        destination: "Mexico City"
    },

    {
        id: 18,
        slug: "seoul-cafe-culture",
        title: "Exploring Korean Café Culture",
        excerpt: "Inside Seoul’s most aesthetic and unique coffee shops.",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200",
        category: "Food & Culture",
        readTime: "6 min read",
        estimatedCost: "$1,700",
        destination: "Seoul"
    },


    {
        id: 19,
        slug: "backpacking-southeast-asia",
        title: "Backpacking Through Southeast Asia",
        excerpt: "Travel Thailand, Vietnam, and Cambodia on a budget.",
        image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200",
        category: "Adventure",
        readTime: "12 min read",
        estimatedCost: "$1,500",
        destination: "Asia"
    },

    {
        id: 20,
        slug: "inca-trail-machu-picchu",
        title: "Hiking the Inca Trail to Machu Picchu",
        excerpt: "Everything you need for this unforgettable trek.",
        image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200",
        category: "Adventure",
        readTime: "14 min read",
        estimatedCost: "$2,800",
        destination: "Peru"
    },

    {
        id: 21,
        slug: "kenya-safari-adventure",
        title: "Safari Adventure in Kenya",
        excerpt: "Witness lions, elephants, and breathtaking savannah sunsets.",
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200",
        category: "Adventure",
        readTime: "11 min read",
        estimatedCost: "$3,000",
        destination: "Kenya"
    },

    {
        id: 22,
        slug: "climbing-mount-kilimanjaro",
        title: "Climbing Mount Kilimanjaro",
        excerpt: "Training tips, routes, and what to pack for Africa’s highest peak.",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",
        category: "Adventure",
        readTime: "13 min read",
        estimatedCost: "$4,100",
        destination: "Tanzania"
    },

    {
        id: 23,
        slug: "great-barrier-reef-diving",
        title: "Diving the Great Barrier Reef",
        excerpt: "Explore colorful coral reefs and marine life in Australia.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
        category: "Adventure",
        readTime: "9 min read",
        estimatedCost: "$2,700",
        destination: "Australia"
    },

    {
        id: 24,
        slug: "patagonia-hiking-guide",
        title: "Patagonia Hiking Guide",
        excerpt: "Epic mountain landscapes and glacier adventures await.",
        image: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=1200",
        category: "Adventure",
        readTime: "15 min read",
        estimatedCost: "$3,400",
        destination: "Patagonia"
    },


    {
        id: 25,
        slug: "iceland-ring-road-winter",
        title: "Iceland's Ring Road: Winter Edition",
        excerpt: "Experience the Northern Lights and geothermal pools.",
        image: "https://images.unsplash.com/photo-1520769945061-0a448c463865?w=1200",
        category: "Road Trips",
        readTime: "15 min read",
        estimatedCost: "$3,500",
        destination: "Iceland"
    },

    {
        id: 26,
        slug: "pacific-coast-highway-guide",
        title: "California Pacific Coast Highway",
        excerpt: "Drive through Big Sur, Malibu, and San Francisco coastlines.",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200",
        category: "Road Trips",
        readTime: "9 min read",
        estimatedCost: "$2,600",
        destination: "California"
    },

    {
        id: 27,
        slug: "norway-road-trip-guide",
        title: "Road Tripping Through Norway",
        excerpt: "Discover fjords, waterfalls, and scenic mountain roads.",
        image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200",
        category: "Road Trips",
        readTime: "10 min read",
        estimatedCost: "$3,200",
        destination: "Norway"
    },

    {
        id: 28,
        slug: "scottish-highlands-adventure",
        title: "The Scottish Highlands Adventure",
        excerpt: "Castles, lochs, and unforgettable countryside drives.",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200",
        category: "Road Trips",
        readTime: "7 min read",
        estimatedCost: "$1,900",
        destination: "Scotland"
    },

    {
        id: 29,
        slug: "route-66-road-trip",
        title: "Exploring Route 66",
        excerpt: "The ultimate American road trip experience from Chicago to LA.",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200",
        category: "Road Trips",
        readTime: "12 min read",
        estimatedCost: "$2,800",
        destination: "USA"
    },

    {
        id: 30,
        slug: "new-zealand-campervan-journey",
        title: "New Zealand Campervan Journey",
        excerpt: "The best campervan routes across New Zealand’s islands.",
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200",
        category: "Road Trips",
        readTime: "8 min read",
        estimatedCost: "$3,000",
        destination: "New Zealand"
    },


    {
        id: 31,
        slug: "parisian-cafes-locals-love",
        title: "Parisian Cafés: Where Locals Actually Go",
        excerpt: "Skip the tourist traps and discover authentic cafés.",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200",
        category: "Local Secrets",
        readTime: "5 min read",
        estimatedCost: "$1,800",
        destination: "Paris"
    },

    {
        id: 32,
        slug: "hidden-beaches-portugal",
        title: "Hidden Beaches in Portugal",
        excerpt: "Secret coastal escapes locals don’t want tourists to know about.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
        category: "Local Secrets",
        readTime: "6 min read",
        estimatedCost: "$1,500",
        destination: "Portugal"
    },

    {
        id: 33,
        slug: "secret-rooftops-barcelona",
        title: "Secret Rooftops in Barcelona",
        excerpt: "The best hidden rooftop bars with incredible sunset views.",
        image: "https://images.unsplash.com/photo-1464790719320-516ecd75af6c?w=1200",
        category: "Local Secrets",
        readTime: "4 min read",
        estimatedCost: "$1,700",
        destination: "Barcelona"
    },

    {
        id: 34,
        slug: "underground-tokyo-nightlife",
        title: "Underground Tokyo Nightlife",
        excerpt: "Explore hidden izakayas and late-night gaming cafés.",
        image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1200",
        category: "Local Secrets",
        readTime: "8 min read",
        estimatedCost: "$2,200",
        destination: "Tokyo"
    },

    {
        id: 35,
        slug: "amsterdam-beyond-tourist-spots",
        title: "Amsterdam Beyond the Tourist Spots",
        excerpt: "Discover peaceful canals, local bakeries, and quiet neighborhoods.",
        image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200",
        category: "Local Secrets",
        readTime: "6 min read",
        estimatedCost: "$1,900",
        destination: "Amsterdam"
    },

    {
        id: 36,
        slug: "hidden-gardens-kyoto",
        title: "Hidden Gardens of Kyoto",
        excerpt: "Find peaceful temples and traditional gardens away from the crowds.",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200",
        category: "Local Secrets",
        readTime: "7 min read",
        estimatedCost: "$2,100",
        destination: "Kyoto"
    },


    {
        id: 37,
        slug: "best-time-to-visit-santorini",
        title: "The Best Time to Visit Santorini",
        excerpt: "Avoid crowds and enjoy Greece’s most beautiful island at the perfect time.",
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1400&auto=format&fit=crop",
        category: "Planning",
        readTime: "6 min read",
        estimatedCost: "$2,000",
        destination: "Santorini"
    },

    {
        id: 38,
        slug: "plan-two-week-europe-trip",
        title: "How to Plan a 2-Week Europe Trip",
        excerpt: "Build the perfect itinerary across multiple European countries.",
        image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200",
        category: "Planning",
        readTime: "9 min read",
        estimatedCost: "$2,900",
        destination: "Europe"
    },

    {
        id: 39,
        slug: "travel-insurance-explained",
        title: "Travel Insurance Explained",
        excerpt: "What coverage you actually need before your next trip.",
        image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200",
        category: "Planning",
        readTime: "5 min read",
        estimatedCost: "$300",
        destination: "Worldwide"
    },

    {
        id: 40,
        slug: "packing-like-a-pro",
        title: "Packing Like a Pro",
        excerpt: "Minimalist packing strategies for stress-free travel.",
        image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1200",
        category: "Planning",
        readTime: "4 min read",
        estimatedCost: "$700",
        destination: "Worldwide"
    },

    {
        id: 41,
        slug: "digital-nomad-lifestyle",
        title: "How to Plan a Digital Nomad Lifestyle",
        excerpt: "The best countries, visas, and budgeting tips for remote workers.",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200",
        category: "Planning",
        readTime: "11 min read",
        estimatedCost: "$2,500",
        destination: "Worldwide"
    },

    {
        id: 42,
        slug: "family-vacation-planning-guide",
        title: "Family Vacation Planning Guide",
        excerpt: "Tips for stress-free travel with kids and large families.",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200",
        category: "Planning",
        readTime: "8 min read",
        estimatedCost: "$2,300",
        destination: "Worldwide"
    },

    {
        id: 43,
        slug: "exploring-beauty-of-bali",
        title: "Exploring the Beauty of Bali",
        excerpt: "Rice terraces, waterfalls, beach clubs, and temples across Indonesia’s paradise island.",
        image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=1200",
        category: "Destinations",
        readTime: "8 min read",
        estimatedCost: "$1,900",
        destination: "Bali"
    },


    {
        id: 44,
        slug: "save-money-traveling-europe",
        title: "How to Save Money While Traveling Europe",
        excerpt: "Budget airlines, rail passes, and hidden savings tips every traveler should know.",
        image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200",
        category: "Budget Tips",
        readTime: "7 min read",
        estimatedCost: "$1,600",
        destination: "Europe"
    },


    {
        id: 45,
        slug: "flavors-of-istanbul",
        title: "The Flavors of Istanbul",
        excerpt: "Experience Turkish tea, kebabs, baklava, and vibrant spice markets.",
        image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200",
        category: "Food & Culture",
        readTime: "9 min read",
        estimatedCost: "$1,500",
        destination: "Istanbul"
    },


    {
        id: 46,
        slug: "amazon-rainforest-adventure",
        title: "Exploring the Amazon Rainforest",
        excerpt: "Jungle lodges, wildlife encounters, and unforgettable river expeditions.",
        image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200",
        category: "Adventure",
        readTime: "13 min read",
        estimatedCost: "$3,300",
        destination: "Amazon"
    },


    {
        id: 47,
        slug: "amalfi-coast-road-trip",
        title: "Driving Across the Amalfi Coast",
        excerpt: "One of Europe’s most scenic coastal drives through Italy’s colorful seaside towns.",
        image: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=1200",
        category: "Road Trips",
        readTime: "8 min read",
        estimatedCost: "$2,400",
        destination: "Italy"
    },


    {
        id: 48,
        slug: "hidden-spots-lisbon",
        title: "Hidden Spots Only Locals Know in Lisbon",
        excerpt: "Secret viewpoints, tiny cafés, and authentic neighborhoods in Portugal’s capital.",
        image: "https://images.unsplash.com/photo-1513735492246-483525079686?w=1200",
        category: "Local Secrets",
        readTime: "5 min read",
        estimatedCost: "$1,300",
        destination: "Lisbon"
    },


    {
        id: 49,
        slug: "planning-perfect-honeymoon",
        title: "Planning the Perfect Honeymoon",
        excerpt: "How to organize a romantic getaway without the stress.",
        image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200",
        category: "Planning",
        readTime: "6 min read",
        estimatedCost: "$4,200",
        destination: "Maldives"
    },

];


const categories = [
    "All",
    "Destinations",
    "Budget Tips",
    "Adventure",
    "Food & Culture",
    "Road Trips",
    "Local Secrets",
    "Planning"
];
const filters = document.getElementById("filters");
const grid = document.getElementById("blogGrid");
const featured = document.getElementById("featured");
const loadMoreBtn = document.querySelector(".load-more");

let currentCategory = "All";
let visibleCount = 6;

const ARTICLES_PER_LOAD = 6;

/* MIX ARTICLES SO CATEGORIES AREN'T REPEATED */
function mixArticles(data) {

    const grouped = {};

    data.forEach(article => {

        if (!grouped[article.category]) {
            grouped[article.category] = [];
        }

        grouped[article.category].push(article);

    });

    const categories = Object.keys(grouped);

    const mixed = [];

    let added = true;

    while (added) {

        added = false;

        categories.forEach(category => {

            if (grouped[category].length > 0) {

                mixed.push(grouped[category].shift());

                added = true;

            }

        });

    }

    return mixed;

}

/* FILTER BUTTONS */
function renderFilters() {

    categories.forEach(category => {

        const btn = document.createElement("button");

        btn.className = "filter-btn";

        if (category === "All") {
            btn.classList.add("active");
        }

        btn.innerText = category;

        btn.onclick = () => {

            document.querySelectorAll(".filter-btn").forEach(b => {
                b.classList.remove("active");
            });

            btn.classList.add("active");

            currentCategory = category;

            visibleCount = 6;

            filterArticles(category);

        };

        filters.appendChild(btn);

    });

}

/* FILTER ARTICLES */
function filterArticles(category) {

    let filtered = category === "All"
        ? mixArticles([...articles])
        : articles.filter(a => a.category === category);

    renderFeatured(filtered[0]);

    renderGrid(filtered.slice(1));

}

/* FEATURED ARTICLE */
function renderFeatured(article) {

    featured.innerHTML = `
<div class="featured-card">

<div class="featured-image">
<img src="${article.image}">
</div>

<div class="featured-content">

<div class="category-badge">
${article.category}
</div>

<h2>${article.title}</h2>

<p>${article.excerpt}</p>

<div class="article-meta">

<span>
<i data-lucide="clock"></i>
${article.readTime}
</span>

<span>
<i data-lucide="map-pin"></i>
${article.destination}
</span>

<span class="price">
<i data-lucide="dollar-sign"></i>
Estimated Cost: ${article.estimatedCost}
</span>

</div>

<div class="read-link" onclick="window.location.href='/blog/${article.slug}'">
Read Article
<i data-lucide="arrow-right"></i>
</div>

</div>

</div>
`;

    lucide.createIcons();

}

/* GRID */
function renderGrid(data) {

    grid.innerHTML = "";

    const visibleArticles = data.slice(0, visibleCount);

    visibleArticles.forEach(article => {

        grid.innerHTML += `

<div class="blog-card">

<div class="blog-card-image">

<img src="${article.image}">

<div class="card-category">
${article.category}
</div>

</div>

<div class="blog-card-content">

<h3>${article.title}</h3>

<p>${article.excerpt}</p>

<div class="article-meta">

<span>
<i data-lucide="clock"></i>
${article.readTime}
</span>

<span>
<i data-lucide="map-pin"></i>
${article.destination}
</span>

</div>

<div class="card-footer">

<span class="price">
${article.estimatedCost}
</span>

<div class="read-more" onclick="window.location.href='/blog/${article.slug}'">
Read More
<i data-lucide="arrow-right"></i>
</div>

</div>

</div>

</div>

`;

    });

    /* LOAD MORE / HIDE BUTTON LOGIC */

    if (visibleCount >= data.length) {

        if (data.length > ARTICLES_PER_LOAD) {

            loadMoreBtn.innerText = "Hide Articles";
            loadMoreBtn.style.display = "inline-block";

        } else {

            loadMoreBtn.style.display = "none";

        }

    } else {

        loadMoreBtn.innerText = "Load More Articles";
        loadMoreBtn.style.display = "inline-block";

    }

    /* BUTTON CLICK */

    loadMoreBtn.onclick = () => {

        if (visibleCount >= data.length) {

            visibleCount = ARTICLES_PER_LOAD;

            window.scrollTo({
                top: featured.offsetTop - 100,
                behavior: "smooth"
            });

        } else {

            visibleCount += ARTICLES_PER_LOAD;

        }

        renderGrid(data);

    };

    lucide.createIcons();

}

/* INIT */
renderFilters();
filterArticles("All");