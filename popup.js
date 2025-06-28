const startButton = document.getElementById('start');
if (startButton) {
  startButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "start_sequential_processing" });
  });
}
const searchCruiseButton = document.getElementById('search_cruise');
if (searchCruiseButton) {
  searchCruiseButton.addEventListener('click', () => {
    const url = "https://www.youtube.com/results?search_query=cruise";
    chrome.tabs.create({ url });  // Opens a new tab
  });
}
