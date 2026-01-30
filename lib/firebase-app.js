/**
 * Firebase App SDK wrapper
 * 
 * This file re-exports Firebase App functions from the CDN.
 * We use importmap to load Firebase from CDN in the offscreen document.
 */

// These will be available when loaded with the importmap in offscreen.html
export { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
