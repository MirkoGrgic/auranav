import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    const messageBox = document.getElementById("loginMessage");

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        messageBox.style.display = "block";
        messageBox.className = "login-message success";
        messageBox.innerText = "Login successful!";

        setTimeout(() => {
            window.location.href = "/";
        }, 1200);

    } catch (error) {

        console.error(error);

        messageBox.style.display = "block";
        messageBox.className = "login-message error";

        if (error.code === "auth/invalid-credential") {
            messageBox.innerText = "Invalid email or password.";
        }
        else {
            messageBox.innerText = "Login failed.";
        }
    }
});