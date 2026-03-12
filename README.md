# AutoTrader Time Tracker Extension

A browser extension that automatically tracks how much time you spend on AutoTrader.com.

## Features

- **Automatic Detection**: Tracks time whenever you visit autotrader.com
- **Real-time Display**: View total time spent and today's usage in the popup
- **Session History**: See a record of all your browsing sessions
- **Local Storage**: Data saved locally in your browser (no cloud upload by default)
- **Azure Integration Ready**: Structure supports adding Azure backend for data sync

## Installation

1. Clone or download this repository
2. Open Chrome/Edge and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the `autotrader-tracker` folder
5. The extension will appear in your toolbar

## How It Works

- **Background Service Worker**: Monitors all active tabs and detects when you're on autotrader.com
- **Popup Dashboard**: Shows total time, today's total, and recent sessions
- **Local Storage**: Uses Chrome's `chrome.storage.local` API for data persistence

## File Structure

```
autotrader-tracker/
├── manifest.json      # Extension configuration (MV3)
├── background.js      # Tab monitoring and time tracking
├── popup.html         # Popup UI
├── popup.js           # Popup logic
├── popup.css          # Popup styles
└── README.md         # This file
```

## Data Storage

Currently uses Chrome's local storage. To add Azure backend:
1. Create Azure Function for storing sessions
2. Modify `background.js` to POST data to Azure endpoint
3. Add authentication headers in requests

## Reset Data

Click the "Reset Data" button in the popup to clear all tracking history.
