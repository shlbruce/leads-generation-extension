const urlList = [
  "https://www.youtube.com/watch?v=vgk47T_Jg9k",
  "https://www.youtube.com/watch?v=U5UqKUeokbk&t=953s",
  "https://www.youtube.com/watch?v=2RcpjhOMLuc"
];
let currentIndex = 0;
let workingTabId = null;

// Call this to start the process
function startSequentialProcessing() {
  // Open the first URL in a new tab
  chrome.tabs.create({ url: urlList[currentIndex], active: true }, function (tab) {
    workingTabId = tab.id;
    // Listen for tab updates to know when it's loaded
    chrome.tabs.onUpdated.addListener(tabUpdateListener);
  });
}

function tabUpdateListener(tabId, changeInfo, tab) {
  if (tabId === workingTabId && changeInfo.status === 'complete') {
    // Page finished loading: tell content script to process
    chrome.tabs.sendMessage(tabId, { action: "process_page" });
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "REQUEST_SCREENSHOT") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      sendResponse(dataUrl);
    });
    // Indicate async response
    return true;
  }
  else if (msg.type === "GET_TAB_URL") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      sendResponse({ url: tabs[0].url });
    });
    return true; // Keeps the message channel open for sendResponse
  }
  else if (msg.action === "page_processed") {
    currentIndex++;
    if (currentIndex < urlList.length) {
      // Load the next URL in the same tab
      chrome.tabs.update(workingTabId, { url: urlList[currentIndex] });
    } else {
      // Done!
      chrome.tabs.onUpdated.removeListener(tabUpdateListener);
      workingTabId = null;
      currentIndex = 0;
      console.log("✅ All pages processed in the same tab!");
    }
  }
  else if (msg.action === "start_sequential_processing") {
    startSequentialProcessing();
  }
});