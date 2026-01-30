/**
 * Options Page JavaScript - User settings management
 */

import { generateUserId, generateNickname } from '../lib/utils.js';

// DOM Elements
const elements = {
    nickname: document.getElementById('nickname'),
    email: document.getElementById('email'),
    odId: document.getElementById('userId'),
    copyIdBtn: document.getElementById('copyIdBtn'),
    saveBtn: document.getElementById('saveBtn'),
    resetBtn: document.getElementById('resetBtn'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage')
};

// ============================================================================
// Initialization
// ============================================================================

async function init() {
    await loadSettings();
    setupEventListeners();
}

async function loadSettings() {
    const stored = await chrome.storage.sync.get(['odId', 'nickname', 'email']);

    if (!stored.odId) {
        // First time - generate new user
        const newUser = {
            odId: generateUserId(),
            nickname: generateNickname(),
            email: ''
        };
        await chrome.storage.sync.set(newUser);
        Object.assign(stored, newUser);
    }

    elements.odId.textContent = stored.odId || 'N/A';
    elements.nickname.value = stored.nickname || '';
    elements.email.value = stored.email || '';
}

// ============================================================================
// Event Listeners
// ============================================================================

function setupEventListeners() {
    // Save button
    elements.saveBtn.addEventListener('click', saveSettings);

    // Reset button (generate new ID)
    elements.resetBtn.addEventListener('click', async () => {
        if (confirm('This will generate a new user ID. Other users will see you as a new person. Continue?')) {
            const newUser = {
                odId: generateUserId(),
                nickname: elements.nickname.value || generateNickname(),
                email: elements.email.value
            };
            await chrome.storage.sync.set(newUser);
            elements.odId.textContent = newUser.odId;
            showToast('New ID generated!');
        }
    });

    // Copy ID button
    elements.copyIdBtn.addEventListener('click', async () => {
        const odId = elements.odId.textContent;
        await navigator.clipboard.writeText(odId);
        showToast('ID copied to clipboard!');
    });

    // Save on Enter in inputs
    elements.nickname.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveSettings();
    });

    elements.email.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveSettings();
    });
}

// ============================================================================
// Settings Management
// ============================================================================

async function saveSettings() {
    const nickname = elements.nickname.value.trim();
    const email = elements.email.value.trim();

    if (!nickname) {
        showToast('Please enter a nickname', true);
        elements.nickname.focus();
        return;
    }

    // Validate email if provided
    if (email && !isValidEmail(email)) {
        showToast('Please enter a valid email', true);
        elements.email.focus();
        return;
    }

    await chrome.storage.sync.set({ nickname, email });

    // Notify service worker of update
    chrome.runtime.sendMessage({
        type: 'UPDATE_USER',
        user: { nickname, email }
    });

    showToast('Settings saved!');
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================================================================
// UI Helpers
// ============================================================================

function showToast(message, isError = false) {
    elements.toastMessage.textContent = message;
    elements.toast.classList.remove('hidden');
    elements.toast.classList.toggle('error', isError);

    setTimeout(() => {
        elements.toast.classList.add('hidden');
    }, 3000);
}

// ============================================================================
// Start
// ============================================================================

init();
