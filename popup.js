document.getElementById('start').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "start_sequential_processing" });
});
