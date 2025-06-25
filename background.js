chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "REQUEST_SCREENSHOT") {
      chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
        sendResponse(dataUrl);
      });
      // Indicate async response
      return true;
    }
    else if (msg.type === "GET_TAB_URL") {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          sendResponse({ url: tabs[0].url });
        });
        return true; // Keeps the message channel open for sendResponse
      } 
  });