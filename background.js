let currentIndex = 0;
let workingTabId = null;
let currentUrlList = [];

// Call this to start the process
function startSequentialProcessing() {
  chrome.storage.local.get(['cruiseUrls'], (result) => {
    currentUrlList = result.cruiseUrls || [];
    if (!currentUrlList.length) {
      alert("No URLs found in storage!");
      return;
    }
    currentIndex = 0;
    // Open the first URL in a new tab
    chrome.tabs.create({ url: currentUrlList[currentIndex], active: true }, function (tab) {
      workingTabId = tab.id;
      // Listen for tab updates to know when it's loaded
      chrome.tabs.onUpdated.addListener(tabUpdateListener);
    });
  });
}

function tabUpdateListener(tabId, changeInfo, tab) {
  if (tabId === workingTabId && changeInfo.status === 'complete') {
    // Page finished loading: tell content script to process
    console.log(`🔄 Page loaded: ${tab.url}`);
    // content scripts monitor dom page changes, so we needn't send message to content script
    //chrome.tabs.sendMessage(tabId, { action: "process_page" });
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "REQUEST_SCREENSHOT") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      sendResponse(dataUrl);
    });
    return true;
  }
  else if (msg.type === "GET_TAB_URL") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      sendResponse({ url: tabs[0].url });
    });
    return true;
  }
  else if (msg.action === "page_processed") {
    currentIndex++;
    console.log(`✅ Page processed, moving to index: ${currentIndex}`);
    if (currentUrlList && currentIndex < currentUrlList.length) {
      // Load the next URL in the same tab
      chrome.tabs.update(workingTabId, { url: currentUrlList[currentIndex] });
      console.log(`🔄 Loading next URL: ${currentUrlList[currentIndex]}`);
    } else {
      // Done!
      chrome.tabs.onUpdated.removeListener(tabUpdateListener);
      workingTabId = null;
      currentIndex = 0;
      currentUrlList = [];
      console.log("✅ All pages processed in the same tab!");
    }
  }
  else if (msg.action === "start_sequential_processing") {
    startSequentialProcessing();
  }
});
