document.getElementById('start').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "start_sequential_processing" });
});

document.getElementById('search_cruise').addEventListener('click', () => {
  const url = "https://www.youtube.com/results?search_query=cruise";
  chrome.tabs.create({ url });  // Opens a new tab
});
