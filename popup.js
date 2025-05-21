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