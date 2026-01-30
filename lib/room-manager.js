/**
 * Room Manager - Handles Firebase room presence and signaling
 */

import { initializeApp } from './firebase-app.js';
import {
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
} from './firebase-database.js';
import { firebaseConfig, isFirebaseConfigured } from '../firebase-config.js';

const MAX_USERS_PER_ROOM = 8;

let app = null;
let db = null;
let currentRoom = null;
let currentUserId = null;
let userRef = null;
let listeners = [];

/**
 * Initialize Firebase
 */
export function initFirebase() {
    if (!isFirebaseConfigured()) {
        throw new Error('Firebase not configured. Please update firebase-config.js');
    }

    if (!app) {
        app = initializeApp(firebaseConfig);
        db = getDatabase(app);
    }

    return db;
}

/**
 * Check if a room has space for new users
 * @param {string} roomId - Room ID to check
 * @returns {Promise<{canJoin: boolean, userCount: number}>}
 */
export async function checkRoomCapacity(roomId) {
    const db = initFirebase();
    const usersRef = ref(db, `rooms/${roomId}/users`);
    const snapshot = await get(usersRef);

    const userCount = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
    return {
        canJoin: userCount < MAX_USERS_PER_ROOM,
        userCount
    };
}

/**
 * Join a room
 * @param {string} roomId - Room ID to join
 * @param {object} userInfo - User information {userId, nickname, email}
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function joinRoom(roomId, userInfo) {
    try {
        const db = initFirebase();

        // Check capacity first
        const { canJoin, userCount } = await checkRoomCapacity(roomId);
        if (!canJoin) {
            return {
                success: false,
                error: `Room is full (${MAX_USERS_PER_ROOM} users max)`
            };
        }

        // Leave current room if any
        if (currentRoom) {
            await leaveRoom();
        }

        currentRoom = roomId;
        currentUserId = userInfo.userId;

        // Add user to room
        userRef = ref(db, `rooms/${roomId}/users/${userInfo.userId}`);
        await set(userRef, {
            odId: userInfo.odId,
            odId: userInfo.userId,
            nickname: userInfo.nickname || 'Anonymous',
            email: userInfo.email || '',
            timestamp: serverTimestamp()
        });

        // Set up disconnect cleanup
        onDisconnect(userRef).remove();

        console.log(`Joined room ${roomId} as ${userInfo.nickname}`);
        return { success: true };

    } catch (error) {
        console.error('Error joining room:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Leave the current room
 */
export async function leaveRoom() {
    if (!currentRoom || !userRef) return;

    try {
        // Remove user from room
        await remove(userRef);

        // Clean up listeners
        listeners.forEach(({ ref: listenerRef, callback, eventType }) => {
            off(listenerRef, eventType, callback);
        });
        listeners = [];

        console.log(`Left room ${currentRoom}`);
        currentRoom = null;
        currentUserId = null;
        userRef = null;

    } catch (error) {
        console.error('Error leaving room:', error);
    }
}

/**
 * Listen for users joining/leaving the room
 * @param {string} roomId - Room ID
 * @param {function} onUserJoin - Callback when user joins
 * @param {function} onUserLeave - Callback when user leaves
 */
export function listenForUsers(roomId, onUserJoin, onUserLeave) {
    const db = initFirebase();
    const usersRef = ref(db, `rooms/${roomId}/users`);

    const joinCallback = (snapshot) => {
        if (snapshot.key !== currentUserId) {
            onUserJoin({
                odId: snapshot.key,
                odId: snapshot.key,
                ...snapshot.val()
            });
        }
    };

    const leaveCallback = (snapshot) => {
        if (snapshot.key !== currentUserId) {
            onUserLeave({
                odId: snapshot.key,
                odId: snapshot.key,
                ...snapshot.val()
            });
        }
    };

    onChildAdded(usersRef, joinCallback);
    onChildRemoved(usersRef, leaveCallback);

    listeners.push({ ref: usersRef, callback: joinCallback, eventType: 'child_added' });
    listeners.push({ ref: usersRef, callback: leaveCallback, eventType: 'child_removed' });
}

/**
 * Get all current users in a room
 * @param {string} roomId - Room ID
 * @returns {Promise<object[]>} Array of user objects
 */
export async function getRoomUsers(roomId) {
    const db = initFirebase();
    const usersRef = ref(db, `rooms/${roomId}/users`);
    const snapshot = await get(usersRef);

    if (!snapshot.exists()) return [];

    const users = [];
    snapshot.forEach((child) => {
        users.push({
            odId: child.key,
            odId: child.key,
            ...child.val()
        });
    });

    return users;
}

/**
 * Send a signaling message to a specific peer
 * @param {string} roomId - Room ID
 * @param {string} toUserId - Target user ID
 * @param {string} type - Signal type (offer, answer, ice-candidate)
 * @param {object} data - Signal data
 */
export async function sendSignal(roomId, toUserId, type, data) {
    const db = initFirebase();
    const signalsRef = ref(db, `rooms/${roomId}/signals`);

    await push(signalsRef, {
        from: currentUserId,
        to: toUserId,
        type,
        data,
        timestamp: serverTimestamp()
    });
}

/**
 * Listen for signaling messages addressed to this user
 * @param {string} roomId - Room ID
 * @param {function} onSignal - Callback for incoming signals
 */
export function listenForSignals(roomId, onSignal) {
    const db = initFirebase();
    const signalsRef = ref(db, `rooms/${roomId}/signals`);

    const callback = (snapshot) => {
        const signal = snapshot.val();

        // Only process signals addressed to us
        if (signal.to === currentUserId) {
            onSignal({
                id: snapshot.key,
                ...signal
            });

            // Clean up processed signal
            remove(ref(db, `rooms/${roomId}/signals/${snapshot.key}`));
        }
    };

    onChildAdded(signalsRef, callback);
    listeners.push({ ref: signalsRef, callback, eventType: 'child_added' });
}

/**
 * Get current room ID
 * @returns {string|null}
 */
export function getCurrentRoom() {
    return currentRoom;
}

/**
 * Get current user ID
 * @returns {string|null}
 */
export function getCurrentUserId() {
    return currentUserId;
}
