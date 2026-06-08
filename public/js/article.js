import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const articlePlanBtn = document.getElementById("articlePlanBtn");

onAuthStateChanged(auth, (user) => {
    if (!articlePlanBtn) return;

    articlePlanBtn.href = user ? "/dashboard" : "/signup";
});