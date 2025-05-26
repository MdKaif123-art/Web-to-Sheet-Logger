// background.js
// Minimal background service worker for Web-to-Sheet Logger extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('Web-to-Sheet Logger background service worker installed.');

  // Create context menu for selected text
  chrome.contextMenus.create({
    id: 'save-to-sheet',
    title: 'Save selection to Sheet',
    contexts: ['selection']
  });
});

// Listen for context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'save-to-sheet' && info.selectionText) {
    chrome.tabs.sendMessage(tab.id, {
      type: 'contextMenuSave',
      text: info.selectionText
    });
  }
}); 