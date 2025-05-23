document.addEventListener('DOMContentLoaded', function() {
  // Initialize popup
  console.log('Web-to-Sheet Logger popup initialized');
  
  // Check if we're connected to a Google Sheet
  chrome.storage.local.get(['sheetConnected'], function(result) {
    const statusDiv = document.querySelector('.status');
    if (result.sheetConnected) {
      statusDiv.textContent = 'Connected to Google Sheet. Select text to save.';
    } else {
      statusDiv.textContent = 'Not connected to Google Sheet. Please set up connection.';
    }
  });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'status') {
    const statusElement = document.querySelector('.status');
    if (statusElement) {
      statusElement.textContent = message.text;
    }
  }
});

// Check if the extension is active on the current tab
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTab = tabs[0];
  if (currentTab) {
    chrome.tabs.sendMessage(currentTab.id, { type: 'getStatus' }, (response) => {
      if (chrome.runtime.lastError) {
        // Content script not ready yet
        const statusElement = document.querySelector('.status');
        if (statusElement) {
          statusElement.textContent = 'Extension is ready. Select text on any webpage to begin.';
        }
      }
    });
  }
}); 

document.getElementById('cancel-save').addEventListener('click', () => {
  confirmationPopup.style.display = 'none';
  window.getSelection().removeAllRanges();
  saveButton.style.display = 'none';
});

document.getElementById('confirm-save').addEventListener('click', () => {
  // TODO: Implement Google Sheets integration
  console.log('Data to be saved:', data);
  confirmationPopup.style.display = 'none';
  window.getSelection().removeAllRanges();
  saveButton.style.display = 'none';
});