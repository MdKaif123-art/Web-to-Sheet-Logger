console.log('Popup loaded');

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('status').textContent = 'Ready to capture highlights!';
  // Initialize popup
  console.log('Web-to-Sheet Logger popup initialized');
  
  // Check if we're connected to a Google Sheet
  chrome.storage.local.get(['sheetConnected'], function(result) {
    const statusDiv = document.getElementById('status');
    if (result.sheetConnected) {
      statusDiv.textContent = 'Connected to Google Sheet. Select text to save.';
    } else {
      statusDiv.textContent = 'Not connected to Google Sheet. Please set up connection.';
    }
  });

  // Sheet manager logic
  const sheetListContainer = document.getElementById('sheet-list-container');
  const newSheetInput = document.getElementById('new-sheet-url');
  const addSheetBtn = document.getElementById('add-sheet-btn');
  const statusDiv = document.getElementById('status');

  // Use SVG for the connected status icon
  const checkSvg = `<svg style='vertical-align:middle;margin-right:4px;' width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#388e3c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
  // Use SVG for the warning status icon
  const warnSvg = `<svg style='vertical-align:middle;margin-right:4px;' width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="1.2"/></svg>`;

  function renderSheetList(sheets) {
    sheetListContainer.innerHTML = '';
    if (sheets.length === 0) {
      statusDiv.innerHTML = warnSvg + 'Not connected to Google Sheet. Please set up connection.';
      statusDiv.style.color = 'red';
      return;
    }
    sheets.forEach(url => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '8px';
      row.style.background = 'transparent';
      row.style.borderRadius = '4px';
      row.style.padding = '2px 4px';
      // URL text
      const urlSpan = document.createElement('span');
      urlSpan.textContent = url;
      urlSpan.style.fontSize = '12px';
      urlSpan.style.flex = '1';
      urlSpan.style.overflow = 'hidden';
      urlSpan.style.textOverflow = 'ellipsis';
      urlSpan.style.whiteSpace = 'nowrap';
      // Remove button
      const removeBtn = document.createElement('button');
      removeBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>`;
      removeBtn.style.display = 'flex';
      removeBtn.style.alignItems = 'center';
      removeBtn.style.justifyContent = 'center';
      removeBtn.style.width = '24px';
      removeBtn.style.height = '24px';
      removeBtn.style.padding = '0';
      removeBtn.style.border = 'none';
      removeBtn.style.background = 'none';
      removeBtn.style.cursor = 'pointer';
      removeBtn.style.fontSize = '16px';
      removeBtn.title = 'Remove this sheet URL';
      removeBtn.addEventListener('click', function() {
        chrome.storage.local.get(['sheets'], function(result) {
          let sheets = (result.sheets || []).filter(u => u !== url);
          chrome.storage.local.set({ sheets }, function() {
            renderSheetList(sheets);
            safeSendMessageToContentScript({ type: 'updateSheet', url: '' });
          });
        });
      });
      row.appendChild(urlSpan);
      row.appendChild(removeBtn);
      sheetListContainer.appendChild(row);
    });
    // Update status
    statusDiv.innerHTML = checkSvg + 'Sheet is connected!';
    statusDiv.style.color = 'green';
  }

  // Load sheets from storage
  function refreshSheetList() {
    chrome.storage.local.get(['sheets'], function(result) {
      const sheets = result.sheets || [];
      renderSheetList(sheets);
    });
  }
  refreshSheetList();

  // Add new sheet
  addSheetBtn.addEventListener('click', function() {
    const url = newSheetInput.value.trim();
    if (url) {
      chrome.storage.local.get(['sheets'], function(result) {
        let sheets = result.sheets || [];
        if (!sheets.includes(url)) sheets.push(url);
        chrome.storage.local.set({ sheets }, function() {
          renderSheetList(sheets);
          newSheetInput.value = '';
          safeSendMessageToContentScript({ type: 'updateSheet', url });
        });
      });
    }
  });

  // Advanced UI: style inputs and buttons
  newSheetInput.style.border = '1.5px solid #bbb';
  newSheetInput.style.borderRadius = '5px';
  newSheetInput.style.padding = '7px';
  newSheetInput.style.fontSize = '14px';
  addSheetBtn.style.background = '#4285F4';
  addSheetBtn.style.color = '#fff';
  addSheetBtn.style.border = 'none';
  addSheetBtn.style.borderRadius = '5px';
  addSheetBtn.style.padding = '10px 0';
  addSheetBtn.style.fontWeight = 'bold';
  addSheetBtn.style.fontSize = '15px';
  sheetListContainer.style.border = '1.5px solid #bbb';
  sheetListContainer.style.borderRadius = '5px';
  sheetListContainer.style.padding = '7px';
  sheetListContainer.style.fontSize = '14px';

  // Copy Script button logic
  const copyBtn = document.getElementById('copy-script-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function() {
      const code = document.getElementById('script-code').innerText;
      navigator.clipboard.writeText(code).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy Script'; }, 1200);
      });
    });
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'status') {
    const statusElement = document.getElementById('status');
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
        // Content script not available (forbidden page or not injected)
        const statusElement = document.getElementById('status');
        if (statusElement) {
          statusElement.textContent = '';
        }
        // Do NOT disable input/button anymore
      }
    });
  }
});

// When sending messages to the content script, handle errors gracefully
function safeSendMessageToContentScript(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
        if (chrome.runtime.lastError) {
          // Content script not available in this tab
          const statusElement = document.getElementById('status');
          if (statusElement) {
            statusElement.textContent = '';
          }
          // Do NOT disable input/button anymore
        }
      });
    }
  });
}