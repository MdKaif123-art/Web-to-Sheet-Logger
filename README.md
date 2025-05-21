# Web-to-Sheet Logger Chrome Extension

A Chrome extension that allows users to highlight text on any webpage and save it to a connected Google Sheet along with metadata.

## Day 1 Setup

### Files Created
- `manifest.json`: Extension configuration using Manifest V3
- `popup.html`: Extension popup interface
- `popup.js`: Popup functionality
- `content.js`: Content script for text selection and floating button
- `styles.css`: Styling for the extension

### Permissions Used
- `activeTab`: To access the current tab's content
- `contextMenus`: For right-click context menu integration
- `storage`: To store user preferences and connection status

### How to Load the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select the extension directory
4. The extension should now be loaded and visible in your Chrome toolbar

### Testing the Extension

1. Click the extension icon to see the popup
2. Navigate to any webpage
3. Select some text to see the floating "Save to Sheet" button
4. Check the browser console to see the logged data (text, URL, title, timestamp)

### Known Limitations (Day 1)
- Google Sheet connection not yet implemented
- No error handling for failed saves
- Basic UI without customization options 