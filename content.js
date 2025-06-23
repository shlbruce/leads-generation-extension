

function addButtonsToAnalyze() {

  if (!document.getElementById('analyze-all-button')) {
    addAnalyzeAllButton();
    sortNewestFirst();
  }



  const commentsSection = document.getElementById('comments');
  if (!commentsSection) {
    return;
  }
  
  const commentSectionList = commentsSection.querySelectorAll('ytd-comment-view-model[id="comment"]');

  commentSectionList.forEach((commentSection) => {
    addAnalyzeButton(commentSection);
  });
}

// Run initially and observe DOM changes
addButtonsToAnalyze();
const observer = new MutationObserver(addButtonsToAnalyze);
observer.observe(document.body, { childList: true, subtree: true });  