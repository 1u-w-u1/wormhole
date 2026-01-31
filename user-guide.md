# Wormhole User Guide

Welcome to **Wormhole**! This extension turns every webpage into a private chat room where you can connect with other people visiting the same site.

## What is Wormhole?

Wormhole is a "spatial" chat extension. Unlike traditional chat apps where you join groups or servers, Wormhole automatically connects you to a chat room based on the website you are currently viewing. If you're on `example.com/blog/cool-post`, you'll be in a room with everyone else who is also reading that exact page.

## Key Features

-   **Automatic Room Switching:** As you browse the web, Wormhole automatically moves you between rooms. No manual joining required.
-   **Peer-to-Peer Privacy:** Your messages are sent directly from your browser to other users using WebRTC technology. 
-   **Side Panel Interface:** Chat comfortably in a slide-out panel that doesn't block the main website content.
-   **Custom Profiles:** Set your own nickname and optional email in the settings to let others know who you are.
-   **Online Status:** See who else is currently on the page with a real-time user list.

## How to Use

1.  **Open the Chat:** Click the Wormhole icon in your browser's extension bar (or use the Side Panel shortcut).
2.  **Start Chatting:** Type your message in the text box at the bottom and press Enter.
3.  **Check the Room:** The header shows the current website "room" you are in.
4.  **Change Settings:** Click the gear icon (⚙️) to open the Options page where you can change your nickname.

## Frequently Asked Questions

### Is it private?
Yes. Wormhole uses a signaling server (Firebase) only to help users find each other. Once connected, your actual chat messages are sent peer-to-peer, meaning they move directly between browsers and are not stored on any central server.

### Why is there a limit of 8 users?
To ensure high performance and low battery usage, each room is currently capped at 8 concurrent users. This allows for a fast, stable connection for everyone in the room.

### Does it work on all sites?
It works on almost any public website. Some "internal" browser pages (like your settings or the Chrome Web Store) are restricted by Google for security reasons.
