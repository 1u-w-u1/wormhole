/**
 * Firebase Configuration Template
 * 
 * INSTRUCTIONS:
 * 1. Copy this file to `firebase-config.js`
 * 2. Fill in your Firebase config values
 * 3. The actual firebase-config.js is gitignored
 */

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Validate configuration
export function isFirebaseConfigured() {
    return firebaseConfig.apiKey !== "YOUR_API_KEY" &&
        firebaseConfig.projectId !== "YOUR_PROJECT_ID";
}

export { firebaseConfig };
