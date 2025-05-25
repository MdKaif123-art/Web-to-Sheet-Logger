// background.js
// Minimal background service worker for Web-to-Sheet Logger extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('Web-to-Sheet Logger background service worker installed.');
}); 