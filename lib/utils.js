/**
 * Shared utility functions for Wormhole extension
 */

/**
 * Convert a URL to a room ID
 * Uses origin + pathname, ignoring query params and hash
 * @param {string} url - Full URL string
 * @returns {string} Firebase-safe room ID
 */
export function urlToRoomId(url) {
    try {
        const urlObj = new URL(url);
        // Normalize: origin + pathname, remove trailing slash
        const normalized = `${urlObj.origin}${urlObj.pathname}`.replace(/\/$/, '');
        // Create a Firebase-safe key using base64
        return btoa(normalized)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    } catch (e) {
        console.error('Invalid URL:', url);
        return null;
    }
}

/**
 * Decode a room ID back to URL (for display)
 * @param {string} roomId - Base64 encoded room ID
 * @returns {string} Original URL
 */
export function roomIdToUrl(roomId) {
    try {
        const base64 = roomId
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        return atob(base64);
    } catch (e) {
        return roomId;
    }
}

/**
 * Generate a random user ID
 * @returns {string} Random ID (8 characters)
 */
export function generateUserId() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Generate a random anonymous nickname
 * @returns {string} Random nickname like "Anonymous Fox"
 */
export function generateNickname() {
    const adjectives = [
        'Happy', 'Clever', 'Swift', 'Bright', 'Calm',
        'Bold', 'Gentle', 'Wise', 'Kind', 'Brave'
    ];
    const animals = [
        'Fox', 'Owl', 'Bear', 'Wolf', 'Eagle',
        'Hawk', 'Deer', 'Rabbit', 'Otter', 'Panda'
    ];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    return `${adj} ${animal}`;
}

/**
 * Format a timestamp for display
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted time string (HH:MM)
 */
export function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Format a timestamp for display with date if not today
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted time/date string
 */
export function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
        return formatTime(timestamp);
    }

    return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Truncate a string to a maximum length
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string with ellipsis if needed
 */
export function truncate(str, maxLength) {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - 3) + '...';
}

/**
 * Get a display-friendly version of a URL
 * @param {string} url - Full URL
 * @returns {string} Shortened display URL
 */
export function getDisplayUrl(url) {
    try {
        const urlObj = new URL(url);
        const path = urlObj.pathname === '/' ? '' : urlObj.pathname;
        return `${urlObj.hostname}${path}`;
    } catch (e) {
        return url;
    }
}

/**
 * Create a unique message ID
 * @returns {string} Unique message ID
 */
export function createMessageId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sleep for a specified duration
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
