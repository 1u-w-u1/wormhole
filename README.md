# Wormhole 🌀

A Chrome extension that enables WebRTC-based text chat between users visiting the same webpage. Connect with others on any site through a sleek side panel interface.

## Features

- **Real-time Chat**: Text messaging via WebRTC DataChannels (peer-to-peer)
- **Room-based**: Users on the same URL path are automatically in the same room
- **Auto-reconnection**: Handles disconnections gracefully with exponential backoff
- **8 User Limit**: Mesh topology supports up to 8 concurrent users per room
- **Customizable Profile**: Set your nickname and email
- **Modern UI**: Dark theme with smooth animations

## Setup

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Realtime Database**:
   - Go to Build → Realtime Database
   - Click "Create Database"
   - Start in Test mode

4. Set Database Rules (Realtime Database → Rules):
   ```json
   {
     "rules": {
       "rooms": {
         "$roomId": {
           ".read": true,
           ".write": true
         }
       }
     }
   }
   ```

5. Get your Firebase config:
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps" → Click Web icon (`</>`)
   - Register app and copy the config

6. Update `firebase-config.js` with your credentials:
   ```javascript
   export const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT.firebaseapp.com",
     databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

### 2. Load the Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `wormhole` directory
5. The extension icon will appear in your toolbar

## Usage

1. **Open the Side Panel**: Click the Wormhole icon in the toolbar
2. **Join a Room**: The side panel automatically connects to a room based on your current URL
3. **Chat**: Type messages and press Enter or click Send
4. **Settings**: Click the gear icon to customize your nickname

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Chrome Extension                         │
├───────────────┬─────────────────┬─────────────────┬─────────┤
│ Content Script│  Service Worker │ Offscreen Doc   │Side Panel│
│ (URL detect)  │ (coordination)  │ (WebRTC+Firebase)│ (UI)    │
└───────┬───────┴────────┬────────┴────────┬────────┴────┬────┘
        │                │                 │             │
        └────────────────┼─────────────────┼─────────────┘
                         │                 │
                         ▼                 ▼
                   ┌─────────┐      ┌─────────────┐
                   │ Firebase│      │ WebRTC Peers│
                   │Realtime │      │ (P2P mesh)  │
                   │   DB    │      └─────────────┘
                   └─────────┘
```

## File Structure

```
wormhole/
├── manifest.json              # Extension configuration
├── firebase-config.js         # Firebase credentials
├── service-worker.js          # Background coordination
├── content-script.js          # URL change detection
├── offscreen/
│   ├── offscreen.html         # WebRTC host document
│   └── offscreen.js           # Firebase + WebRTC logic
├── sidepanel/
│   ├── sidepanel.html         # Chat UI
│   ├── sidepanel.js           # UI logic
│   └── sidepanel.css          # Styling
├── options/
│   ├── options.html           # Settings page
│   ├── options.js             # Settings logic
│   └── options.css            # Settings styling
├── lib/
│   ├── firebase-app.js        # Firebase App SDK
│   ├── firebase-database.js   # Firebase DB SDK
│   ├── room-manager.js        # Room operations
│   ├── webrtc-manager.js      # Peer connection management
│   └── utils.js               # Utilities
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Development

### Requirements
- Chrome 114+ (for Side Panel API)
- Firebase project with Realtime Database

### Debugging

1. **Service Worker**: Go to `chrome://extensions/`, find Wormhole, click "service worker"
2. **Side Panel**: Right-click in the side panel → Inspect
3. **Offscreen Document**: Check the DevTools console for logs prefixed with `[Offscreen]`

### Common Issues

- **"Firebase not configured"**: Update `firebase-config.js` with valid credentials
- **Not connecting**: Check Firebase Database rules allow read/write
- **Service worker inactive**: It wakes up on events; this is normal for Manifest V3

## Future Enhancements

- [ ] Voice/video chat
- [ ] Message history (stored in Firebase)
- [ ] Typing indicators
- [ ] User avatars
- [ ] Private messaging
- [ ] Room passwords

## License

MIT
