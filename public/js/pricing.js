import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const freePlanBtn = document.getElementById("freePlanBtn");
const proTrialBtn = document.getElementById("proTrialBtn");
const bottomTrialBtn = document.getElementById("bottomTrialBtn");

onAuthStateChanged(auth, (user) => {
    if (user) {
        if (freePlanBtn) {
            freePlanBtn.href = "/dashboard";
        }

        if (proTrialBtn) {
            proTrialBtn.href = "#";
            proTrialBtn.addEventListener("click", (e) => {
                e.preventDefault();
            });
        }

        if (bottomTrialBtn) {
            bottomTrialBtn.href = "#";
            bottomTrialBtn.addEventListener("click", (e) => {
                e.preventDefault();
            });
        }
    } else {
        if (freePlanBtn) {
            freePlanBtn.href = "/signup";
        }

        if (proTrialBtn) {
            proTrialBtn.href = "/signup";
        }

        if (bottomTrialBtn) {
            bottomTrialBtn.href = "/signup";
        }
    }
});