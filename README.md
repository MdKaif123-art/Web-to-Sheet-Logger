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
3. A "Save to Sheet" button appears
4. Click it and check the browser console for the selected text

---

## Day 3 Implementation

### Features Added
- **Metadata Collection:** Captures selected text, page title, page URL, and timestamp when saving.
- **Preview Popup:** When you click "Save to Sheet," a confirmation popup appears showing all captured data for review before saving.
- **Highlight Removal:** The text highlight is removed as soon as the preview popup appears, ensuring a clean user experience.
- **Improved UX:** The floating button and popup are styled for clarity and usability. The button and popup disappear after saving or cancelling, and do not reappear unless new text is selected.

### Files Modified
- `content.js`: Now collects metadata, shows a preview popup, and removes highlight after selection.
- `popup.html`: Improved instructions and status display.
- `popup.js`: Handles status updates and connection checks.

### Testing Instructions

1. Open any webpage
2. Select some text
3. The "Save to Sheet" button appears near your selection
4. Click the button to see a preview popup with all metadata
5. Confirm or cancel; the popup and button will disappear, and the highlight will be removed

---

## Day 4 Implementation

### Features Added
- **Google Apps Script Integration:** Created a backend service to handle data storage
- **Data Storage:** Implemented Google Sheets integration for saving highlights
- **Error Handling:** Added proper error handling and user feedback
- **CORS Configuration:** Set up proper cross-origin resource sharing

### Files Modified
- `content.js`: Added fetch request to Google Apps Script
- `manifest.json`: Added host permissions for Google Apps Script

### Google Apps Script Setup
1. Created a Google Sheet with columns:
   - Text
   - URL
   - Title
   - Timestamp
2. Implemented Apps Script with:
   - POST endpoint for receiving data
   - Data validation
   - Error handling
   - Success/error responses

### Testing Instructions
1. Open any webpage
2. Select some text
3. Click "Save to Sheet"
4. Confirm in the preview popup
5. Check your Google Sheet - a new row should be added with your data
6. Verify success/error messages appear appropriately

---

### Next Steps
- Day 5: Sheet connection
- Day 6: Polish and edge cases
- Day 7: Final demo and submission
