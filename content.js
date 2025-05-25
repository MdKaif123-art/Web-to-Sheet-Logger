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

document.body.appendChild(saveButton);
document.body.appendChild(confirmationPopup);

// Function to create confirmation popup content
function createConfirmationContent(data) {
  return `
    <div style="font-family: Arial, sans-serif;">
      <h3 style="margin: 0 0 15px 0; color: #333;">Confirm Save to Sheet</h3>
      <div style="margin-bottom: 15px;">
        <strong>Selected Text:</strong>
        <p style="margin: 5px 0; padding: 8px; background: #f5f5f5; border-radius: 4px;">${data.text}</p>
      </div>
      <div style="margin-bottom: 15px;">
        <strong>Page Title:</strong>
        <p style="margin: 5px 0;">${data.title}</p>
      </div>
      <div style="margin-bottom: 15px;">
        <strong>URL:</strong>
        <p style="margin: 5px 0; word-break: break-all;">${data.url}</p>
      </div>
      <div style="margin-bottom: 20px;">
        <strong>Timestamp:</strong>
        <p style="margin: 5px 0;">${data.timestamp}</p>
      </div>
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button id="cancel-save" style="padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; background: #fff; cursor: pointer;">Cancel</button>
        <button id="confirm-save" style="padding: 8px 16px; border: none; border-radius: 4px; background: #4285F4; color: #fff; cursor: pointer;">Save to Sheet</button>
      </div>
    </div>
  `;
}

// Detect text selection and show button
document.addEventListener('mouseup', (event) => {
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

// On button click, show confirmation popup
saveButton.addEventListener('click', () => {
  const selectedText = saveButton.dataset.selectedText;
  const data = {
    text: selectedText,
    url: window.location.href,
    title: document.title,
    timestamp: new Date().toISOString()
  };

  confirmationPopup.innerHTML = createConfirmationContent(data);
  confirmationPopup.style.display = 'block';
  saveButton.style.display = 'none';

  // Remove the highlight as soon as the preview appears
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
      const response = await fetch('https://script.google.com/macros/s/AKfycbw0oyDX1ap_AMgzQJ6IiRqv3w9tFiCg5X4_ea4PThYfYm6FXDXKl4mp3F_YkfgOY-Se/exec', {
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
});

// Close confirmation popup when clicking outside
document.addEventListener('click', (event) => {
  if (event.target === confirmationPopup) {
    confirmationPopup.style.display = 'none';
  }
});
