console.log("JavaScript loaded.");

// ---------- Firebase Imports ----------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } 
    from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } 
    from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


// ---------- Firebase Config ----------
import {firebaseConfig} from './firebaseConfig.js';

// ---------- Initialize Firebase ----------
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// ---------- LOGIN ----------
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "mainPage.html";
    } catch (error) {
        document.getElementById("message").textContent = error.message;
    }
}

// ---------- SIGN-UP ----------
async function signup() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        window.location.href = "mainPage.html";
    } catch (error) {
        document.getElementById("message").textContent = error.message;
    }
}

// ---------- LOGOUT ----------
function logout() {
    signOut(auth)
        .then(() => {
            console.log("User signed out.");
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Sign-out error:", error);
            alert("Failed to sign out. Please try again.");
        });
}

// ---------- ADD RECIPE ----------


async function addRecip() {
    try {
        window.location.href = "recipes.html";
    } catch (error) {
        document.getElementById("message").textContent = error.message;
    }
}

// viewing recip
async function viewRecip() {
    try {
        window.location.href = "viewRecipes.html";
    } catch (error) {
        document.getElementById("message").textContent = error.message;
    }
}


async function addRecipe() {
    const title = document.getElementById("title")?.value.trim();
    const ingredients = document.getElementById("ingredients")?.value.trim();
    const steps = document.getElementById("steps")?.value.trim();

    if (!title || !ingredients || !steps) {
        alert("Please fill in all fields before submitting.");
        return;
    }

    try {
        await addDoc(collection(db, "recipes"), {
            title,
            ingredients,
            steps,
            createdAt: new Date()
        });

        console.log("Recipe added!");
        loadRecipes();

        // Clear input fields
        document.getElementById("title").value = "";
        document.getElementById("ingredients").value = "";
        document.getElementById("steps").value = "";

    } catch (error) {
        console.error("Error adding recipe:", error);
        alert("Failed to add recipe: " + error.message);
    }
}

// ---------- LOAD RECIPES ----------
async function loadRecipes() {
    try {
        const querySnapshot = await getDocs(collection(db, "recipes"));
        const list = document.getElementById("recipesList");
        if (!list) return;

        list.innerHTML = "";
        querySnapshot.forEach(doc => {
            const data = doc.data();
            list.innerHTML += `
                <div class="recipe-card">
                    <h3>${data.title}</h3>
                    <p><strong>Ingredients:</strong> ${data.ingredients}</p>
                    <p><strong>Steps:</strong> ${data.steps}</p>
                    <hr>
                </div>`;
        });
    } catch (error) {
        console.error("Error loading recipes:", error);
    }
}

// ---------- AUTH PROTECTION ----------
onAuthStateChanged(auth, user => {
    if (window.location.pathname.includes("recipes.html") && !user) {
        window.location.href = "index.html";
    }
});

// ---------- AUTO LOAD RECIPES IF ON RECIPES PAGE ----------
if (window.location.pathname.includes("viewRecipes.html")) {
    loadRecipes(); // this will fetch and display all recipes including ingredients
}


// ---------- Make functions available globally ----------
window.login = login;
window.signup = signup;
window.logout = logout;
window.addRecipe = addRecipe;
window.loadRecipes = loadRecipes;
window.addRecip = addRecip;
window.viewRecip = viewRecip;


