/**
 * Content Script - Detects URL changes for SPA navigation
 * 
 * This script runs on all pages and:
 * 1. Reports the initial URL
 * 2. Monitors for URL changes (SPA navigation)
 * 3. Notifies the service worker of changes
 */

(function () {
    let lastUrl = location.href;
    let isInvalidated = false;
    let urlCheckInterval = null;

    /**
     * Check if extension context is still valid
     */
    function isContextValid() {
        if (isInvalidated) return false;
        if (!chrome.runtime?.id) {
            if (!isInvalidated) {
                console.log('[Wormhole] Extension context invalidated, stopping script.');
                isInvalidated = true;
                if (urlCheckInterval) clearInterval(urlCheckInterval);
            }
            return false;
        }
        return true;
    }

    /**
     * Normalize URL by removing query params and hash
     */
    function normalizeUrl(url) {
        try {
            const urlObj = new URL(url);
            return `${urlObj.origin}${urlObj.pathname}`.replace(/\/$/, '');
        } catch (e) {
            return url;
        }
    }

    /**
     * Report URL change to service worker
     */
    function reportUrlChange(url) {
        if (!isContextValid()) return;

        try {
            chrome.runtime.sendMessage({
                type: 'URL_CHANGED',
                url: url,
                normalizedUrl: normalizeUrl(url)
            }).catch((err) => {
                if (err.message.includes('context invalidated')) {
                    isContextValid(); // Trigger invalidation logic
                }
            });
        } catch (e) {
            if (e.message.includes('context invalidated')) {
                isContextValid();
            }
        }
    }

    /**
     * Check if URL changed (considering only path, not query/hash)
     */
    function checkUrlChange() {
        if (!isContextValid()) return;

        const currentUrl = location.href;
        const normalizedCurrent = normalizeUrl(currentUrl);
        const normalizedLast = normalizeUrl(lastUrl);

        if (normalizedCurrent !== normalizedLast) {
            console.log('[Wormhole] URL changed:', normalizedCurrent);
            lastUrl = currentUrl;
            reportUrlChange(currentUrl);
        }
    }

    // Report initial URL
    reportUrlChange(location.href);

    // Monitor for URL changes

    // 1. Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', () => {
        setTimeout(checkUrlChange, 0);
    });

    // 2. Override pushState and replaceState for SPA navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        setTimeout(checkUrlChange, 0);
    };

    history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        setTimeout(checkUrlChange, 0);
    };

    // 3. Fallback: periodic check for edge cases
    urlCheckInterval = setInterval(checkUrlChange, 1000);

    console.log('[Wormhole] Content script loaded');
})();
