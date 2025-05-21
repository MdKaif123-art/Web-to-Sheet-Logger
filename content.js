// Log that content script has loaded
console.log('Web-to-Sheet Logger content script loaded');

// Create and inject the floating button
const floatingButton = document.createElement('div');
floatingButton.id = 'web-to-sheet-button';
floatingButton.style.display = 'none';
floatingButton.style.position = 'absolute';
floatingButton.style.padding = '8px 12px';
floatingButton.style.backgroundColor = '#4285f4';
floatingButton.style.color = 'white';
floatingButton.style.borderRadius = '4px';
floatingButton.style.cursor = 'pointer';
floatingButton.style.zIndex = '10000';
floatingButton.style.fontSize = '14px';
floatingButton.textContent = 'Save to Sheet';
document.body.appendChild(floatingButton);

// Handle text selection
document.addEventListener('mouseup', function(e) {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (selectedText) {
    // Position the button near the selection
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    floatingButton.style.top = `${window.scrollY + rect.bottom + 10}px`;
    floatingButton.style.left = `${window.scrollX + rect.left}px`;
    floatingButton.style.display = 'block';

    // Store the selected text
    floatingButton.dataset.selectedText = selectedText;
  } else {
    floatingButton.style.display = 'none';
  }
});

// Handle click on the floating button
floatingButton.addEventListener('click', function() {
  const selectedText = this.dataset.selectedText;
  console.log('Selected text:', selectedText);
  console.log('Page URL:', window.location.href);
  console.log('Page title:', document.title);
  console.log('Timestamp:', new Date().toISOString());
  
  // Hide the button after clicking
  this.style.display = 'none';
}); 