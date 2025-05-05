document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("replaceButton").addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "replacePassword" });
      });
    });
  });