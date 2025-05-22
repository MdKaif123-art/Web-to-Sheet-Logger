# Web-to-Sheet Logger Chrome Extension

A Chrome extension that allows users to highlight text on any webpage and save it to a connected Google Sheet along with metadata.

## Day 1 Implementation

### Files Created
- `manifest.json`: Extension configuration using Manifest V3
- `popup.html`: Basic extension popup interface
- `popup.js`: Simple popup functionality
- `content.js`: Basic content script that logs to console
- `icons/web-to-sheet-logger-icon.png`: Extension icon

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
2. Open any webpage
3. Open the browser console (F12 or right-click -> Inspect -> Console)
4. You should see the message: "Web-to-Sheet Logger content script loaded"

### Current Features (Day 1)
- Basic extension structure
- Extension popup
- Content script loading confirmation
- Extension icon

---

## Day 2 Implementation

### Features Added
- Detects and captures **selected text only**
- Shows a floating **"Save to Sheet"** button near the selected text
- On click, logs selected text in the console
- No metadata or sheet connection yet

### Files Modified
- `content.js`: Now detects text selection and logs the selected content

### Testing Instructions

1. Open any webpage
2. Select some text
3. A “Save to Sheet” button appears
4. Click it and check the browser console for the selected text

---

### Next Steps
- Day 3: Metadata collection (page title, URL, timestamp)
- Day 4: Google Apps Script integration
- Day 5: Sheet connection
- Day 6: Polish and edge cases
- Day 7: Final demo and submission
