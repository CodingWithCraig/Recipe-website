// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBPqkgBAQwhCMTUsrHcd5vct9FBNAxJQ50",
    authDomain: "finerecip-website.firebaseapp.com",
    projectId: "finerecip-website",
    storageBucket: "finerecip-website.firebasestorage.app",
    messagingSenderId: "1081847047055",
    appId: "1:1081847047055:web:8c60c5e2c0c6a6766aa1fa",
    measurementId: "G-RJ77SR3CMB"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  window.login = function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password).then(userCredential => {
        window.location.href = "mainPage.html";
    })
    .catch(error => {document.getElementById('message').textContent=error.message;});
  }



  //As for the signup page
    window.signup = function() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        createUserWithEmailAndPassword(auth, email, password).then(userCredential => {
            window.location.href = "mainPage.html";
        })
        .catch(error => {document.getElementById('message').textContent=error.message;});
        
    }

