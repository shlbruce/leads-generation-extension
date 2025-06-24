chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "REQUEST_SCREENSHOT") {
      chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
        sendResponse(dataUrl);
      });
      // Indicate async response
      return true;
    }
  });
  