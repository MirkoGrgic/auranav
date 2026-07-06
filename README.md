# ✈️ AuraNav

### AI-Powered Travel Planning Web Application

AuraNav is a full-stack web application that helps users plan personalized trips using Artificial Intelligence. Instead of spending hours researching destinations, weather, attractions, and itineraries, users can generate an entire travel plan in seconds.

The application combines AI-generated itineraries with real-time weather forecasts, interactive maps, nearby attractions, travel articles, and trip management features inside a modern dashboard.

Built using **HTML**, **CSS**, **Vanilla JavaScript**, **Node.js**, **Express.js**, **Firebase**, **OpenAI API**, **Leaflet**, and **OpenWeather API**, AuraNav demonstrates modern full-stack web development principles while integrating multiple third-party services into a single responsive application.

---

# 📱 Application Preview

| Landing Page   | Explore Articles | AI Trip Planner |
| -------------- | ---------------- | --------------- |
| *(Screenshot)* | *(Screenshot)*   | *(Screenshot)*  |

| Dashboard      | Interactive Map | Weather Forecast |
| -------------- | --------------- | ---------------- |
| *(Screenshot)* | *(Screenshot)*  | *(Screenshot)*   |

| User Profile   | Admin Dashboard | Pricing        |
| -------------- | --------------- | -------------- |
| *(Screenshot)* | *(Screenshot)*  | *(Screenshot)* |

---

# 📖 About the Project

Planning a trip usually requires visiting multiple websites to compare destinations, check weather forecasts, search for attractions, estimate travel costs, and organize everything into a single itinerary.

AuraNav solves this problem by bringing all essential travel planning tools into one application.

Users simply choose a destination, travel dates, and budget. The application automatically creates a personalized travel plan using OpenAI, retrieves weather forecasts, loads nearby attractions on an interactive map, and stores the entire trip inside the user's dashboard.

The application also includes a travel blog where visitors can browse destination guides, budgeting advice, road trip ideas, local secrets, adventure articles, and travel planning tips.

Registered users can manage multiple trips, while administrators have access to an internal dashboard for monitoring users, trips, and platform statistics.

AuraNav was built as a portfolio project to demonstrate practical knowledge of modern web development, REST APIs, cloud services, authentication, database design, asynchronous programming, and responsive UI development.

---

# ✨ Features

## 🌍 Guest Users

Visitors can explore the platform without creating an account.

Available features include:

* Browse travel articles
* Search destinations
* Read travel guides
* View pricing
* Learn about the platform
* Register or sign in

Guest users cannot generate AI trips or access the dashboard.

---

## 👤 Registered Users

After authentication, users unlock the complete travel planning experience.

Users can:

* Create personalized AI trips
* Manage multiple trips
* View real-time weather forecasts
* Explore nearby attractions
* Save generated itineraries
* Open interactive destination maps
* Read travel recommendations
* Manage profile information

---

## 🤖 AI Trip Planning

AuraNav integrates the OpenAI API to generate personalized travel itineraries.

Each itinerary is based on:

* destination
* travel dates
* available budget

The generated itinerary includes:

* recommended attractions
* daily activities
* travel suggestions
* practical planning advice

Unlike static travel guides, every itinerary is dynamically generated according to user preferences.

---

## 🌤 Weather Forecast

Each trip automatically includes a weather forecast.

The application retrieves weather information from OpenWeather API and stores forecast data for quick access inside the dashboard.

Displayed information includes:

* current temperature
* weather conditions
* humidity
* wind speed
* multi-day forecast

Weather data updates automatically whenever a new trip is created.

---

## 🗺 Interactive Map

Every generated trip contains an interactive map powered by Leaflet and OpenStreetMap.

Nearby attractions are automatically displayed as markers.

Each marker contains:

* attraction name
* category
* location
* description
* coordinates

The map automatically adjusts its viewport to include every attraction using dynamic bounds calculation.

---

## 📍 Saved Locations

Instead of requesting nearby attractions every time the dashboard opens, AuraNav caches retrieved locations inside Firebase.

Workflow:

Destination

↓

Nearby Places API

↓

Firestore

↓

Dashboard

If saved locations already exist, the application loads them directly from Firestore without making another external API request, improving both performance and API efficiency.

---

## 📚 Travel Articles

AuraNav includes a built-in travel blog containing dozens of articles organized into categories:

* Destinations
* Budget Tips
* Adventure
* Food & Culture
* Road Trips
* Local Secrets
* Planning

Each article has:

* SEO-friendly slug
* estimated budget
* reading time
* destination information
* responsive article layout

The article system demonstrates dynamic routing concepts using reusable templates and organized content structure.

---
## 📊 User Dashboard

After signing in, users gain access to a personalized dashboard where all travel information is organized in one place.

The dashboard acts as the central hub of the application and allows users to manage every aspect of their trips.

Dashboard features include:

* Active trip overview
* AI-generated itinerary
* Interactive destination map
* Weather forecast
* Nearby attractions
* Trip statistics
* Quick navigation
* Trip management tools

Instead of navigating between multiple pages, users can access all travel information from a single interface.

---

## 🤖 AI Itinerary Generation

One of AuraNav's core features is dynamic itinerary generation using the OpenAI API.

When creating a trip, the user provides:

* Destination
* Start date
* End date
* Budget

The backend constructs a detailed prompt and sends it to OpenAI.

The AI then generates a personalized itinerary containing:

* daily schedule
* sightseeing recommendations
* transportation advice
* budgeting suggestions
* travel tips

Every itinerary is unique and generated in real time.

---

## 🌦 Weather Integration

Immediately after a trip is created, AuraNav retrieves weather data for the selected destination.

Weather information includes:

* current conditions
* daily forecasts
* temperature
* humidity
* wind speed
* weather descriptions

Instead of requesting weather every time the dashboard loads, forecast data is stored inside Firestore and reused until a new trip is generated.

This reduces unnecessary API calls while improving application performance.

---

## 📍 Nearby Attractions

AuraNav automatically loads nearby attractions for every destination.

Examples include:

* museums
* landmarks
* restaurants
* parks
* viewpoints
* historical sites
* entertainment venues

Locations are displayed both as:

* interactive map markers
* searchable location list

Every attraction contains coordinates, allowing the map to automatically zoom and center around all available places.

---

## 📰 Explore Page

The Explore section functions as a travel knowledge hub.

Visitors can browse articles covering different aspects of travelling.

Available categories include:

* Destinations
* Budget Tips
* Adventure
* Food & Culture
* Road Trips
* Local Secrets
* Planning

Each article includes:

* featured image
* reading time
* estimated travel cost
* destination
* responsive layout
* SEO-friendly URL slug

The article system was designed using reusable templates, making it easy to expand with additional content.

---

## 👤 User Profile

Authenticated users have access to a personal profile page.

The profile displays:

* username
* email
* account information
* active trip
* account statistics

Profile information is retrieved directly from Firebase Authentication and Firestore.

---

## 👨‍💼 Admin Dashboard

AuraNav includes an administrator panel used for monitoring application activity.

Administrator capabilities include:

* View registered users
* View created trips
* Platform statistics
* User management
* Dashboard analytics

The admin panel is protected using role-based authorization.

Only users with administrator privileges can access administrative routes.

---

# 🛠 Tech Stack

## Frontend

AuraNav frontend is built entirely using modern web technologies without relying on large frontend frameworks.

Technologies:

* HTML5
* CSS3
* Vanilla JavaScript (ES6 Modules)

The interface is fully responsive and optimized for desktop, tablet, and mobile devices.

---

## Backend

The server-side application is developed using Node.js and Express.js.

Responsibilities include:

* REST API
* authentication
* AI communication
* weather requests
* location requests
* Firestore operations
* validation
* route handling

The backend follows a modular architecture where each feature is separated into dedicated routes and services.

---

## Database

AuraNav uses Google Firebase Firestore as its primary cloud database.

Firestore stores:

* users
* trips
* weather forecasts
* saved locations
* generated itineraries
* administrator data

Using Firestore enables real-time synchronization while eliminating the need for managing a traditional SQL database.

---

## Authentication

User authentication is implemented using Firebase Authentication.

Supported features include:

* Email & Password Registration
* Email & Password Login
* Session Persistence
* Secure Authentication Tokens

User sessions remain active across browser refreshes until the user explicitly signs out.

---

## AI

AuraNav integrates the OpenAI API to generate travel itineraries.

Instead of predefined travel plans, the application dynamically creates unique itineraries based on user preferences.

Prompt generation is handled on the backend to protect the API key from public exposure.

---

## Weather API

Weather forecasts are retrieved using the OpenWeather API.

The backend handles all communication with the external service before storing relevant forecast information inside Firestore.

This architecture improves loading speed while reducing unnecessary API requests.

---

## Maps

Interactive maps are powered by:

* Leaflet.js
* OpenStreetMap

Leaflet provides lightweight interactive maps while OpenStreetMap supplies map tiles without requiring expensive commercial mapping services.

---

## Icons

User interface icons are implemented using:

* Lucide Icons

Lucide provides lightweight SVG icons that integrate seamlessly with modern web applications.

---

## Hosting

The application is designed to be deployed on modern cloud hosting platforms such as:

* Render
* Railway
* Vercel (Frontend)
* Firebase Hosting

Development is performed locally using Node.js while environment variables securely protect API credentials.

---
# 🏛 Application Architecture

AuraNav follows a modular full-stack architecture where the frontend communicates with a REST API built using Express.js.

The backend is responsible for authentication, AI integration, weather retrieval, location services, and communication with Firebase.

```
                    User
                      │
                      ▼
          HTML / CSS / JavaScript
                      │
               Fetch API Requests
                      │
                      ▼
              Express REST API
        ┌──────────┬──────────┬──────────┐
        ▼          ▼          ▼          ▼
    Firebase    OpenAI    OpenWeather   Places API
    Firestore      API         API
        │
        ▼
  Processed Response
        │
        ▼
      Frontend UI
```

The application separates responsibilities between the frontend, backend services, external APIs, and cloud database, making the codebase easier to maintain and extend.

---

# 📂 Project Structure

```text
Travel Planner
│
├── public
│   ├── assets
│   ├── css
│   ├── js
│   ├── pages
│   ├── 404.html
│   ├── about.html
│   ├── admin.html
│   ├── dashboard.html
│   ├── explore.html
│   ├── index.html
│   ├── login.html
│   ├── pricing.html
│   ├── profile.html
│   └── signup.html
│
├── server
│   ├── firebase
│   ├── routes
│   ├── services
│   └── server.js
│
├── package.json
├── README.md
└── .env
```

The project is organized into clear frontend and backend modules to improve scalability, maintainability, and easier future development.
---

# 🌐 REST API

AuraNav exposes multiple REST endpoints.

Examples include:

```
POST   /api/trips
```

Creates a new trip.

---

```
GET   /api/trips/:id
```

Loads a specific trip.

---

```
GET   /api/weather
```

Retrieves weather forecast data.

---

```
GET   /api/locations
```

Returns nearby attractions for a destination.

---

```
POST   /api/ai
```

Generates an AI-powered travel itinerary.

---

```
GET   /api/admin
```

Returns administrator statistics.

---

Each route is isolated inside its own Express Router, keeping the backend modular and easy to maintain.

---

# ☁ Firebase Integration

AuraNav uses Firebase as its cloud backend.

Services include:

* Firebase Authentication
* Cloud Firestore

Firestore stores persistent application data while Firebase Authentication manages secure user authentication.

---

# 📊 Firestore Database Structure

Collections:

```
users
```

Each user document contains:

```
uid
username
email
role
createdAt
```

---

Subcollection:

```
users
 └── trips
```

Each trip contains:

```
tripId
destination
startDate
endDate
budget
active
createdAt
updatedAt
```

---

Each trip contains additional subcollections.

```
trips
 ├── weather
 ├── locations
 └── itinerary
```

This hierarchical structure keeps all trip-related information grouped together.

---

# 🤖 OpenAI Workflow

The itinerary generation process follows this sequence:

```
User creates trip
        │
        ▼
Frontend sends POST request
        │
        ▼
Express Backend
        │
        ▼
Prompt Generation
        │
        ▼
OpenAI API
        │
        ▼
AI Response
        │
        ▼
Firestore
        │
        ▼
Dashboard
```

The OpenAI API key is stored securely using environment variables and never exposed to the frontend.

---

# 🌦 Weather Workflow

Weather information follows a similar flow.

```
Trip Created
      │
      ▼
Weather Service
      │
      ▼
OpenWeather API
      │
      ▼
Forecast Processing
      │
      ▼
Firestore
      │
      ▼
Dashboard Weather Card
```

Saving forecast data inside Firestore prevents unnecessary API requests whenever the dashboard reloads.

---

# 📍 Locations Workflow

Nearby attractions are generated only once.

```
Dashboard Opens
        │
        ▼
Check Firestore
        │
   ┌────┴─────┐
   │          │
Exists?      No
   │          │
   ▼          ▼
Load      Places API
   │          │
   │      Save to Firestore
   │          │
   └──────┬───┘
          ▼
Display Markers
```

This caching strategy significantly improves loading speed while reducing external API usage.

---

# 🗺 Interactive Maps

AuraNav uses:

* Leaflet.js
* OpenStreetMap

Instead of commercial mapping services, OpenStreetMap provides free map tiles while Leaflet handles rendering, markers, zooming, and viewport management.

Features include:

* dynamic markers
* automatic bounds calculation
* responsive map resizing
* popup information
* location list synchronization

---

# 🔄 Asynchronous Programming

AuraNav makes extensive use of asynchronous JavaScript.

Technologies include:

* async / await
* Fetch API
* Promises

Asynchronous operations are used for:

* authentication
* API requests
* Firestore queries
* AI generation
* weather retrieval
* nearby locations

This prevents blocking the user interface while network operations are being performed.

---

# 🔐 Security

Sensitive credentials are never stored inside the frontend.

Protected information includes:

* Firebase Service Account
* OpenAI API Key
* Weather API Key

All secrets are stored using environment variables.

The frontend communicates only with the backend, preventing users from directly accessing third-party APIs.

---
# ⚙ Installation

## Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/AuraNav.git
```

Navigate to the project directory.

```bash
cd AuraNav
```

---

## Install Dependencies

Install all required backend packages.

```bash
npm install
```

Dependencies include:

* Express.js
* Firebase Admin SDK
* Firebase Client SDK
* OpenAI
* Axios
* CORS
* Dotenv

---

## Environment Variables

Create a `.env` file inside the project root.

Example:

```properties
OPENAI_API_KEY=your_openai_api_key

OPENWEATHER_API_KEY=your_openweather_api_key

FIREBASE_PROJECT_ID=your_project_id

FIREBASE_CLIENT_EMAIL=your_client_email

FIREBASE_PRIVATE_KEY=your_private_key

PORT=3000
```

The Firebase Service Account JSON file should **never** be committed to GitHub.

Instead, store it locally and exclude it using `.gitignore`.

---

## Firebase Configuration

Inside Firebase Console:

Enable:

* Authentication
* Cloud Firestore

Authentication Provider:

* Email & Password

Create the required Firestore collections before running the application.

---

## Run the Application

Start the backend server:

```bash
npm start
```

or

```bash
node server.js
```

Open your browser:

```text
http://localhost:3000
```

---

# 📂 Environment Variables

AuraNav uses environment variables to protect sensitive credentials.

Required variables include:

| Variable              | Description                    |
| --------------------- | ------------------------------ |
| OPENAI_API_KEY        | OpenAI API key                 |
| OPENWEATHER_API_KEY   | OpenWeather API key            |
| FIREBASE_PROJECT_ID   | Firebase Project ID            |
| FIREBASE_CLIENT_EMAIL | Firebase Service Account Email |
| FIREBASE_PRIVATE_KEY  | Firebase Private Key           |
| PORT                  | Local server port              |

No sensitive information is exposed to the frontend.

---

# 🚀 Future Improvements

Several features are planned for future versions of AuraNav.

Potential improvements include:

* Google OAuth Authentication
* Interactive route optimization
* Hotel recommendations
* Flight integration
* Currency converter
* Expense tracker
* Travel checklist
* Collaborative trip planning
* Favorite destinations
* Dark mode
* Multi-language support
* AI travel chatbot
* Push notifications
* Progressive Web App (PWA)
* Image galleries for destinations
* Travel history analytics
* Offline trip access
* Mobile application version

---

# 📚 Learning Outcomes

AuraNav demonstrates practical knowledge of modern full-stack web development.

Technologies and concepts applied throughout the project include:

* HTML5
* CSS3
* Responsive Web Design
* Vanilla JavaScript (ES6+)
* DOM Manipulation
* Fetch API
* Async / Await
* REST APIs
* Node.js
* Express.js
* Firebase Authentication
* Firebase Firestore
* Firebase Admin SDK
* OpenAI API Integration
* OpenWeather API
* Leaflet.js
* OpenStreetMap
* Environment Variables
* Authentication & Authorization
* Modular Project Architecture
* CRUD Operations
* Asynchronous Programming
* API Integration
* Cloud Database Design
* Route Handling
* Middleware
* Error Handling
* Dynamic Content Rendering
* Responsive UI Design
* Git & GitHub

---

# 💡 What This Project Demonstrates

AuraNav was built to demonstrate the ability to design and develop a complete full-stack web application from scratch.

The project showcases:

* Frontend development without relying on large frameworks
* Backend API development using Express.js
* Secure Firebase Authentication
* Cloud database integration with Firestore
* AI-powered content generation
* Third-party API integration
* Interactive mapping
* Responsive user interface
* Clean project organization
* Modular and scalable architecture
* Real-world application design

Rather than focusing on a single technology, AuraNav demonstrates how multiple services can be integrated into a cohesive web application that solves a real-world problem.

---

# 📈 Possible Scalability

AuraNav has been designed with scalability in mind.

Potential future architecture improvements include:

* Migration to TypeScript
* React or Next.js frontend
* Docker containerization
* CI/CD pipeline using GitHub Actions
* Redis caching
* PostgreSQL support
* Microservice architecture
* Automated testing
* Cloud deployment using AWS or Azure

The current architecture allows these enhancements without requiring a complete rewrite of the application.

---

# 👨‍💻 Author

**Mirko Grgić**

Computer Science Student

Faculty of Organization and Informatics

---

AuraNav was developed as a personal portfolio project to demonstrate modern web development practices, cloud integration, REST API design, AI integration, responsive frontend development, authentication, database management, and full-stack application architecture.

The project reflects practical experience in building scalable web applications using modern JavaScript technologies while following clean code principles and modular software design.
