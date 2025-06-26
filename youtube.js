function setupAnalyzeButtonsInYoutube() {

    if (!document.getElementById('analyze-all-button')) {
        const analyzeAllButton = setupAnalyzeAllButton();
        //sortNewestFirst();

        // if uncommented, this will add analyze buttons to all comments on the page 
        // and update "comment-1" for search comments. 
        // const topLevelComments = contentsSection.querySelectorAll('ytd-comment-view-model[id="comment-1"]');
        //setupAllAnalyzeButton(); 

        if (analyzeAllButton) {
            setTimeout(() => {
                analyzeAllButton.click();
            }
            , DELAY.LOAD_PAGE);
        }
    }
}

function setupAllAnalyzeButton() {
    const commentsSection = document.getElementById('comments');
    if (!commentsSection) {
        return;
    }

    const commentSectionList = commentsSection.querySelectorAll('ytd-comment-view-model[id="comment"]');

    commentSectionList.forEach((commentSection) => {
        setupAnalyzeButton(commentSection);
    });

    const repliesSectionList = commentsSection.querySelectorAll('div[id="replies"]');
    repliesSectionList.forEach((replySection) => {

        const contentsSecton = replySection.querySelector('div[id="contents"]');
        if (!contentsSecton) {
            return;
        }
        contentSectionList = contentsSecton.querySelectorAll('ytd-comment-view-model')
        if (contentSectionList.length === 0) {
            return;
        }
        contentsSecton.id = "contents-1";
        contentSectionList.forEach((commentSection) => {
            // Add analyze button to each reply comment
            setupAnalyzeButton(commentSection);
        });
    });
}