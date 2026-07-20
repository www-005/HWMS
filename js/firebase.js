
import { initializeApp } 
from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";


import { 
getAuth 
} 
from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";


import { 
getDatabase 
} 
from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";





// FIREBASE CONFIG

const firebaseConfig = {


apiKey: "AIzaSyDzLA2BtSeRukeyHaE5Sb-VGK1aSywrBv4",


authDomain: "hwms-c37e9.firebaseapp.com",


projectId: "hwms-c37e9",


storageBucket: "hwms-c37e9.firebasestorage.app",


messagingSenderId: "723888101927",


appId: "1:723888101927:web:ab140d13119fde4f7acc02",


measurementId: "G-16ZKY1MHC3"

};





// INITIALIZE FIREBASE


const app = initializeApp(firebaseConfig);





// AUTH


export const auth = getAuth(app);





// DATABASE


export const db = getDatabase(
    
    app,

    "https://hwms-c37e9-default-rtdb.europe-west1.firebasedatabase.app"

);
