

function addButtonsToAnalyze() {

  if (!document.getElementById('analyze-all-button')) {
    addAnalyzeAllButton();
    sortNewestFirst();
  }



  const commentsSection = document.getElementById('comments');
  if (!commentsSection) {
    return;
  }
  const replyButtonList = commentsSection.querySelectorAll('ytd-button-renderer[id="reply-button-end"]');

  replyButtonList.forEach((reply) => {
    addAnalyzeButton(reply);
  });
}

// Run initially and observe DOM changes
addButtonsToAnalyze();
const observer = new MutationObserver(addButtonsToAnalyze);
observer.observe(document.body, { childList: true, subtree: true });  