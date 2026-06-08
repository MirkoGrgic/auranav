import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyASmWkAxOUkfIQUIa_8yrSD_WHkTuknZDg",
    authDomain: "travel-planner-94ef9.firebaseapp.com",
    projectId: "travel-planner-94ef9",
    storageBucket: "travel-planner-94ef9.firebasestorage.app",
    messagingSenderId: "295744286235",
    appId: "1:295744286235:web:4084fa86374c0e653652be"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);