function init() {
  const hostname = window.location.hostname;
  const fullUrl = window.location.href;

  if (hostname === "www.youtube.com") {
      if (fullUrl.includes("search_query=cruise")) {
          search_cruise();
      } else {
          setupAnalyzeButtonsInYoutube();
      }
      return;
  }
}


const observer = new MutationObserver(init);
observer.observe(document.body, { childList: true, subtree: true });  