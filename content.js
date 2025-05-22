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
  padding: '6px 10px',
  background: '#4285F4',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  cursor: 'pointer',
  fontSize: '14px'
});
document.body.appendChild(saveButton);

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

// On button click, log only the selected text
saveButton.addEventListener('click', () => {
  const selectedText = saveButton.dataset.selectedText;

  console.log("Selected Text:");
  console.log(selectedText);

  saveButton.style.display = 'none';
});
