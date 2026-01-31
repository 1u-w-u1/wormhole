# Chrome Web Store Submission Details

## Single Purpose
Wormhole provides a real-time side-panel chat interface that automatically connects users visiting the same URL, enabling instant communication across any website.

## Permissions Justification

| Permission | Justification |
| :--- | :--- |
| **sidePanel** | Required to provide a persistent and non-intrusive chat interface that remains visible as users browse different websites. |
| **storage** | Necessary to securely save and persist user preferences, such as nicknames, optional email addresses, and language settings across browser sessions. |
| **offscreen** | Essential for hosting persistent WebRTC peer connections and Firebase signaling listeners, which require a continuous DOM environment not available in the ephemeral background service worker. |
| **tabs** | Required to monitor URL changes in real-time so the extension can automatically transition the user into the correct chat room for the page they are currently viewing. |
| **activeTab** | Used to obtain the specific URL of the current page to identify the appropriate chat room for the user upon starting the session. |

## Host Permissions Justification

| Host Pattern | Justification |
| :--- | :--- |
| `https://*.firebaseio.com/*` | Required for secure, real-time communication with the Firebase Realtime Database to facilitate WebRTC signaling and peer discovery. |
| `https://*.googleapis.com/*` | Necessary for internal communication with Google/Firebase infrastructure for authentication and signaling coordination. |
