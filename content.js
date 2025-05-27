if (typeof chrome !== 'undefined' && chrome.runtime && document.body) {
  (function() {
    // Day 1 Log
    console.log('Web-to-Sheet Logger content script loaded');

    // Create and style the floating "Save to Sheet" button
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save to Sheet';
    saveButton.id = 'web-to-sheet-btn';
    Object.assign(saveButton.style, {
      position: 'absolute',
      display: 'none',
      zIndex: '9999',
      padding: '8px 12px',
      background: '#4285F4',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.2s ease'
    });

    // Create confirmation popup
    const confirmationPopup = document.createElement('div');
    confirmationPopup.id = 'web-to-sheet-confirmation';
    Object.assign(confirmationPopup.style, {
      position: 'fixed',
      display: 'none',
      zIndex: '10000',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      width: '400px',
      maxWidth: '90vw'
    });

    // Add hover effect to save button
    saveButton.addEventListener('mouseover', () => {
      saveButton.style.background = '#3367D6';
    });

    saveButton.addEventListener('mouseout', () => {
      saveButton.style.background = '#4285F4';
    });

    // Only append UI if document.body exists, and suppress any errors
    if (document.body) {
      try {
        document.body.appendChild(saveButton);
        document.body.appendChild(confirmationPopup);
      } catch (e) {
        // Silently ignore any error
      }
    }

    // Multi-select highlights and tags/categories support
    let multiHighlights = [];
    let currentTag = '';
    let activeSheetUrl = '';

    // On load, get active sheet from storage
    function updateActiveSheetUrlFromStorage() {
      if (chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['activeSheet'], function(result) {
          if (result.activeSheet) activeSheetUrl = result.activeSheet;
        });
      }
    }
    updateActiveSheetUrlFromStorage();

    // Add a tag input to the confirmation popup
    function createConfirmationContent(data, isBulk = false) {
      return `
        <div style="font-family: Arial, sans-serif;">
          <h3 style="margin: 0 0 15px 0; color: #333;">${isBulk ? 'Bulk Save to Sheet' : 'Confirm Save to Sheet'}</h3>
          <div style="margin-bottom: 15px;">
            <strong>Selected Text:</strong>
            <div style="margin: 5px 0; padding: 8px; background: #f5f5f5; border-radius: 4px; max-height: 120px; overflow-y: auto;">
              ${isBulk ? data.map(d => `<div style='margin-bottom:6px;word-break:break-word;'>${d.text}</div>`).join('') : data.text}
            </div>
          </div>
          <div style="margin-bottom: 15px;">
            <strong>Page Title:</strong>
            <p style="margin: 5px 0;">${isBulk ? data[0].title : data.title}</p>
          </div>
          <div style="margin-bottom: 15px;">
            <strong>URL:</strong>
            <div style="margin: 5px 0; word-break: break-all; overflow-x: auto; white-space: nowrap; max-width: 340px; padding: 4px 2px; background: #f5f5f5; border-radius: 4px;">
              ${isBulk ? data[0].url : data.url}
            </div>
          </div>
          <div style="margin-bottom: 20px;">
            <strong>Timestamp:</strong>
            <p style="margin: 5px 0;">${isBulk ? data[0].timestamp : data.timestamp}</p>
          </div>
          <div style="margin-bottom: 20px;">
            <strong>Tag/Category:</strong>
            <input id="tag-input" type="text" placeholder="Enter tag or category" style="width: 100%; padding: 6px; border-radius: 4px; border: 1px solid #ccc;" value="${currentTag}">
          </div>
          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button id="add-another" style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: #fff; cursor: pointer;">Add Another</button>
            <button id="cancel-save" style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: #fff; cursor: pointer;">Cancel</button>
            <button id="confirm-save" style="padding: 8px 16px; border: none; border-radius: 4px; background: #4285F4; color: #fff; cursor: pointer;">${isBulk ? 'Save All to Sheet' : 'Save to Sheet'}</button>
          </div>
        </div>
      `;
    }

    // Detect text selection and show button (multi-select)
    document.addEventListener('mouseup', (event) => {
      updateActiveSheetUrlFromStorage(); // Always get latest sheet before showing button
      const selectedText = window.getSelection().toString().trim();
      if (selectedText) {
        const x = event.pageX;
        const y = event.pageY;
        saveButton.style.left = `${x + 10}px`;
        saveButton.style.top = `${y + 10}px`;
        saveButton.style.display = 'block';
        saveButton.dataset.selectedText = selectedText;
      } else {
        saveButton.style.display = 'none';
      }
    });

    // On button click, show confirmation popup (multi-select)
    saveButton.addEventListener('click', () => {
      const selectedText = saveButton.dataset.selectedText;
      const data = {
        text: selectedText,
        url: window.location.href,
        title: document.title,
        timestamp: new Date().toISOString()
      };
      // If there are already highlights, show bulk confirmation
      if (multiHighlights.length > 0) {
        multiHighlights.push(data);
        confirmationPopup.innerHTML = createConfirmationContent(multiHighlights, true);
      } else {
        confirmationPopup.innerHTML = createConfirmationContent(data);
      }
      confirmationPopup.style.display = 'block';
      saveButton.style.display = 'none';
      window.getSelection().removeAllRanges();

      // Add event listeners for confirmation buttons
      const addAnotherBtn = document.getElementById('add-another');
      const cancelBtn = document.getElementById('cancel-save');
      const confirmBtn = document.getElementById('confirm-save');
      const tagInput = document.getElementById('tag-input');

      if (addAnotherBtn) {
        addAnotherBtn.addEventListener('click', () => {
          // Save current tag
          currentTag = tagInput.value;
          // If not already in multiHighlights, add the current data
          if (multiHighlights.length === 0 || multiHighlights[multiHighlights.length-1].text !== data.text) {
            multiHighlights.push(data);
          }
          confirmationPopup.style.display = 'none';
          saveButton.style.display = 'none';
          // Wait for next selection
        });
      }

      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          multiHighlights = [];
          currentTag = '';
          confirmationPopup.style.display = 'none';
          saveButton.style.display = 'none';
        });
      }

      if (confirmBtn) {
        confirmBtn.addEventListener('click', async () => {
          confirmBtn.disabled = true;
          confirmBtn.textContent = 'Saving...';
          currentTag = tagInput.value;
          if (multiHighlights.length > 0) {
            // Bulk save
            await saveBulkHighlights(multiHighlights, currentTag);
            multiHighlights = [];
            currentTag = '';
          } else {
            // Single save
            await saveSingleHighlight(data, currentTag);
          }
          confirmationPopup.style.display = 'none';
          saveButton.style.display = 'none';
          confirmBtn.disabled = false;
          confirmBtn.textContent = multiHighlights.length > 0 ? 'Save All to Sheet' : 'Save to Sheet';
        });
      }
    });

    // Helper to get all sheet URLs from storage
    function getAllSheetUrls(callback) {
      if (chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['sheets'], function(result) {
          callback((result.sheets || []).filter(url => url));
        });
      } else {
        callback([]);
      }
    }

    // Bulk save function
    async function saveBulkHighlights(highlights, tag) {
      getAllSheetUrls(async (urls) => {
        if (!urls.length) {
          showErrorMessage('No Google Sheet URLs configured. Please add a sheet URL in the popup.');
          return;
        }
        for (const item of highlights) {
          await Promise.all(urls.map(url => saveSingleHighlightToUrl(item, tag, url, true)));
        }
        showSuccessMessage('All highlights saved to all Google Sheets!');
      });
    }

    // Single save function
    async function saveSingleHighlight(data, tag, silent = false) {
      getAllSheetUrls(async (urls) => {
        if (!urls.length) {
          showErrorMessage('No Google Sheet URLs configured. Please add a sheet URL in the popup.');
          return;
        }
        await Promise.all(urls.map(url => saveSingleHighlightToUrl(data, tag, url, silent)));
        if (!silent) showSuccessMessage('Saved to all Google Sheets!');
      });
    }

    // Save to a specific URL
    async function saveSingleHighlightToUrl(data, tag, url, silent = false) {
      try {
        // Always include tag as the last property
        const payload = { ...data, tag: tag || '' };
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (error) {
        if (!silent) showErrorMessage(error.message);
      }
    }

    function showSuccessMessage(msg) {
      const successMessage = document.createElement('div');
      successMessage.textContent = msg;
      successMessage.style.cssText = `
        position: fixed !important;
        top: 80px !important;
        right: 20px !important;
        background: #4CAF50 !important;
        color: white !important;
        padding: 12px 24px !important;
        border-radius: 6px !important;
        border: 2px solid #fff !important;
        box-shadow: 0 8px 32px rgba(0,0,0,0.35), 0 0 0 4px rgba(76,175,80,0.15) !important;
        font-size: 18px !important;
        font-family: Arial, sans-serif !important;
        z-index: 2147483647 !important;
        pointer-events: none !important;
      `;
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);
    }

    function showErrorMessage(msg) {
      const errorMessage = document.createElement('div');
      errorMessage.textContent = `Error: ${msg}`;
      errorMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        z-index: 10000;
      `;
      document.body.appendChild(errorMessage);
      setTimeout(() => errorMessage.remove(), 3000);
    }

    // Close confirmation popup when clicking outside
    document.addEventListener('click', (event) => {
      if (event.target === confirmationPopup) {
        confirmationPopup.style.display = 'none';
      }
    });

    // Listen for messages from background (context menu)
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'contextMenuSave' && message.text) {
        // Prepare data for confirmation popup
        const data = {
          text: message.text,
          url: window.location.href,
          title: document.title,
          timestamp: new Date().toISOString()
        };
        confirmationPopup.innerHTML = createConfirmationContent(data);
        confirmationPopup.style.display = 'block';
        saveButton.style.display = 'none';

        // Remove highlight if any
        window.getSelection().removeAllRanges();

        // Add event listeners for confirmation buttons
        document.getElementById('cancel-save').addEventListener('click', () => {
          confirmationPopup.style.display = 'none';
          saveButton.style.display = 'none';
        });

        document.getElementById('confirm-save').addEventListener('click', async () => {
          try {
            // Show loading state
            const confirmButton = document.getElementById('confirm-save');
            const originalText = confirmButton.textContent;
            confirmButton.textContent = 'Saving...';
            confirmButton.disabled = true;

            // Send data to Google Apps Script
            const response = await fetch(activeSheetUrl, {
              method: 'POST',
              mode: 'no-cors',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data)
            });

            // Since we're using no-cors, we can't read the response
            // Assume success if no error is thrown
            const successMessage = document.createElement('div');
            successMessage.textContent = 'Saved to Google Sheet!';
            successMessage.style.cssText = `
              position: fixed !important;
              top: 80px !important;
              right: 20px !important;
              background: #4CAF50 !important;
              color: white !important;
              padding: 12px 24px !important;
              border-radius: 6px !important;
              border: 2px solid #fff !important;
              box-shadow: 0 8px 32px rgba(0,0,0,0.35), 0 0 0 4px rgba(76,175,80,0.15) !important;
              font-size: 18px !important;
              font-family: Arial, sans-serif !important;
              z-index: 2147483647 !important;
              pointer-events: none !important;
            `;
            document.body.appendChild(successMessage);
            setTimeout(() => successMessage.remove(), 3000);

          } catch (error) {
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.textContent = `Error: ${error.message}`;
            errorMessage.style.cssText = `
              position: fixed;
              top: 20px;
              right: 20px;
              background: #f44336;
              color: white;
              padding: 10px 20px;
              border-radius: 4px;
              z-index: 10000;
            `;
            document.body.appendChild(errorMessage);
            setTimeout(() => errorMessage.remove(), 3000);
          } finally {
            // Reset button state
            const confirmButton = document.getElementById('confirm-save');
            confirmButton.textContent = 'Save to Sheet';
            confirmButton.disabled = false;
            // Close popup and clear selection
            confirmationPopup.style.display = 'none';
            window.getSelection().removeAllRanges();
            saveButton.style.display = 'none';
          }
        });
      }
      if (message.type === 'updateSheet' && message.url) {
        activeSheetUrl = message.url;
      }
    });
  })();
}
