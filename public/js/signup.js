import { auth, db } from "./firebase.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const form = document.getElementById("signupForm");
const messageBox = document.getElementById("signupMessage");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        await updateProfile(userCredential.user, {
            displayName: `${firstName} ${lastName}`
        });

        await setDoc(doc(db, "users", userCredential.user.uid), {
            uid: userCredential.user.uid,
            firstName,
            lastName,
            email,
            role: "user",
            createdAt: serverTimestamp()
        });

        messageBox.style.display = "block";
        messageBox.className = "signup-message success";
        messageBox.innerText = "Account created successfully!";

        setTimeout(() => {
            window.location.href = "/";
        }, 1500);

    } catch (error) {

        messageBox.style.display = "block";
        messageBox.className = "signup-message error";

        if (error.code === "auth/email-already-in-use") {
            messageBox.innerText = "Email already exists.";
        }
        else if (error.code === "auth/weak-password") {
            messageBox.innerText = "Password must be at least 6 characters.";
        }
        else {
            messageBox.innerText = "Something went wrong.";
        }

        console.error(error);
    }
});