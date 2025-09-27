console.log("JavaScript loaded.");

// ---------- Firebase Imports ----------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } 
    from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } 
    from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } 
    from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

// ---------- Firebase Config ----------
const firebaseConfig = {
    apiKey: "AIzaSyBPqkgBAQwhCMTUsrHcd5vct9FBNAxJQ50",
    authDomain: "finerecip-website.firebaseapp.com",
    projectId: "finerecip-website",
    storageBucket: "finerecip-website.appspot.com",
    messagingSenderId: "1081847047055",
    appId: "1:1081847047055:web:8c60c5e2c0c6a6766aa1fa",
    measurementId: "G-RJ77SR3CMB"
};

// ---------- Initialize Firebase ----------
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ---------- STATE ----------
let recipesLoaded = false;

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

// ---------- NAVIGATION ----------
async function addRecip() {
    window.location.href = "recipes.html";
}
async function viewRecip() {
    window.location.href = "viewRecipes.html";
}
async function back() {
    window.location.href = "mainPage.html";
}

// ---------- ADD RECIPE ----------
async function addRecipe() {
    const title = document.getElementById("title")?.value.trim();
    const ingredients = document.getElementById("ingredients")?.value.trim();
    const steps = document.getElementById("steps")?.value.trim();
    const imageFile = document.getElementById("recipeImage")?.files[0]; // NEW

    if (!title || !ingredients || !steps) {
        alert("Please fill in all fields before submitting.");
        return;
    }

    try {
        let imageUrl = "";

        // ---------- Upload Image if Provided ----------
        if (imageFile) {
            const storageRef = ref(storage, `recipes/${Date.now()}-${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(storageRef);
        }

        // ---------- Save Recipe with Image ----------
        await addDoc(collection(db, "recipes"), {
            title,
            ingredients,
            steps,
            imageUrl,
            createdAt: new Date()
        });

        console.log("Recipe added!");
        recipesLoaded = false;
        loadRecipes();

        // Clear input fields
        document.getElementById("title").value = "";
        document.getElementById("ingredients").value = "";
        document.getElementById("steps").value = "";
        if (document.getElementById("recipeImage")) {
            document.getElementById("recipeImage").value = "";
        }

    } catch (error) {
        console.error("Error adding recipe:", error);
        alert("Failed to add recipe: " + error.message);
    }
}

// ---------- LOAD RECIPES ----------
async function loadRecipes() {
    if (recipesLoaded) return;
    recipesLoaded = true;

    try {
        const querySnapshot = await getDocs(collection(db, "recipes"));
        const list = document.getElementById("recipesList");
        if (!list) return;

        list.innerHTML = "";
        let html = "";
        querySnapshot.forEach(doc => {
            const data = doc.data();

            const ingredientsArray = data.ingredients.split(/[,|\n]/).map(item => item.trim()).filter(item => item);
            const stepsArray = data.steps.split(/\n/).map(item => item.trim()).filter(item => item);

            const ingredientsHTML = ingredientsArray.map(ingredient => `<li>${ingredient}</li>`).join("");
            const stepsHTML = stepsArray.map((step, i) => `<li><strong>Step ${i+1}:</strong> ${step}</li>`).join("");

            html += `
                <div class="recipe-card">
                    <h3>${data.title}</h3>
                    ${data.imageUrl ? `<img src="${data.imageUrl}" alt="${data.title}" class="recipe-img">` : ""}
                    <p><strong>Ingredients:</strong></p>
                    <ul>${ingredientsHTML}</ul>
                    <p><strong>Steps:</strong></p>
                    <ol>${stepsHTML}</ol>
                    <hr>
                </div>`;
        });

        list.innerHTML = html;
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

// ---------- AUTO LOAD RECIPES ----------
if (window.location.pathname.includes("viewRecipes.html")) {
    loadRecipes();
}

// ---------- Make functions available globally ----------
window.login = login;
window.signup = signup;
window.logout = logout;
window.addRecipe = addRecipe;
window.loadRecipes = loadRecipes;
window.addRecip = addRecip;
window.viewRecip = viewRecip;
window.back = back;
