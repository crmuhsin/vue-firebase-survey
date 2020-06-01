import * as firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCmpyAod7h471_8ZMrI3QV6QQX-DCYyXpg",
    projectId: "survey-vue"
};

// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);

export const db = fire.firestore();
export const auth = fire.auth();
export const service = {};
