/**
 * Firebase Realtime Database SDK wrapper
 * 
 * This file re-exports Firebase Database functions from the CDN.
 */

export {
    getDatabase,
    ref,
    set,
    push,
    onValue,
    onChildAdded,
    onChildRemoved,
    off,
    remove,
    get,
    onDisconnect,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
