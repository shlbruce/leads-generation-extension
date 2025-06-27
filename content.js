function init() {
  const hostname = window.location.hostname;
  if (hostname === "www.youtube.com") {
      setupAnalyzeButtonsInYoutube();
      return;
  }
}


const observer = new MutationObserver(init);
observer.observe(document.body, { childList: true, subtree: true });  