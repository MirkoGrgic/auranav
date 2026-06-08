import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const stats = document.querySelectorAll(".stat");

const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            obs.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.3
});

stats.forEach(stat => observer.observe(stat));

const aboutCtaButton = document.getElementById("aboutCtaButton");

onAuthStateChanged(auth, (user) => {
    if (!aboutCtaButton) return;

    if (user) {
        aboutCtaButton.href = "/dashboard";
    } else {
        aboutCtaButton.href = "/signup";
    }
});