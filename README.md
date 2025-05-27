# Web-to-Sheet Logger Chrome Extension

A Chrome extension that allows users to highlight text on any webpage and save it to a connected Google Sheet along with metadata.

---

## Features (Up to Day 6)
- Highlight text on any webpage and save it to Google Sheets
- Floating "Save to Sheet" button appears near selected text
- **Context menu**: Right-click selected text and choose "Save selection to Sheet"
- Collects metadata: selected text, page title, page URL, and timestamp
- Confirmation popup previews all data before saving
- Sends data to Google Apps Script Web App (Google Sheet backend)
- Success and error messages always visible (even with sticky navbars)
- Handles edge cases and cleans up UI after save/cancel
- Works on most websites and tested for robustness

---

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

## Day 5 Implementation

### Features Added
- **Full Integration:** The extension now fully connects the frontend (content script) to the backend (Google Apps Script Web App).
- **POST Request:** When the user confirms saving a highlight, the extension sends a POST request with the selected text, page title, URL, and timestamp to the Apps Script endpoint.
- **Success/Error Feedback:** The extension displays a success message if the data is saved, or an error message if something goes wrong.
- **No Manifest URL Needed:** The Apps Script Web App URL is hardcoded in the content script; it does not need to be listed in the manifest.

### How It Works
1. User highlights text on any webpage.
2. The floating "Save to Sheet" button appears near the selection.
3. On clicking the button, a confirmation popup previews the data to be saved.
4. When the user confirms, the extension sends a POST request to the Google Apps Script Web App URL:
   - Example endpoint: `https://script.google.com/macros/s/AKfycbw0oyDX1ap_AMgzQJ6IiRqv3w9tFiCg5X4_ea4PThYfYm6FXDXKl4mp3F_YkfgOY-Se/exec`
   - Data sent (JSON):
     ```json
     {
       "text": "Selected text...",
       "url": "https://example.com/page",
       "title": "Page Title",
       "timestamp": "2025-05-19T14:25:00"
     }
     ```
5. The Apps Script receives the data and appends it as a new row in the connected Google Sheet.
6. The extension shows a success or error message to the user.

### Files Modified
- `content.js`: Handles the POST request, user feedback, and error handling.
- `manifest.json`: Ensures permissions for web requests and content scripts.

### Testing Instructions
1. Open any webpage.
2. Select some text.
3. Click the "Save to Sheet" button and confirm in the popup.
4. Check your Google Sheet for the new entry.
5. Observe the success or error message in the browser.

---

## Day 6 Implementation

### Features Added & Polish
- **Context Menu Support:**
  - Right-click any selected text and choose "Save selection to Sheet" to trigger the save flow.
- **UI Polish & Edge Cases:**
  - Success/error messages always visible (appear below navbars)
  - Button and popup never get stuck or hidden
  - Popup and button disappear after save/cancel
  - Prevents UI interference with page content
  - Tested on various websites (news, blogs, etc.)
- **Validation:**
  - Only non-empty selections can be saved
  - Confirmation popup always shows all metadata

### Files Modified
- `background.js`: Adds context menu and handles context menu actions
- `content.js`: Handles context menu messages, UI polish, and edge cases
- `manifest.json`: Ensures permissions for context menus and content scripts
- `popup.html`, `popup.js`: Status and instructions

### Testing Instructions
1. Open any webpage
2. Select some text
3. Use either:
   - The floating "Save to Sheet" button near your selection
   - Or right-click and choose "Save selection to Sheet"
4. Confirm in the popup
5. Check your Google Sheet for the new entry
6. Observe the success or error message in the browser

---

## Demo Video (for Day 7)
- Show loading the extension
- Highlighting text and saving via button and context menu
- Confirmation popup and metadata preview
- Google Sheet updating in real time
- Success/error messages

---

## Next Steps
- Day 7: Final demo and submission

---

## Google Apps Script (Copy & Deploy)

A copyable Google Apps Script is available in the extension popup for easy deployment.

<button onclick="navigator.clipboard.writeText(document.getElementById('script-code').innerText)">Copy Script</button>

<!-- The script code is now only available in the popup, not shown here. -->
