function setupAnalyzeButtonsInYoutube() {

    if (!document.getElementById('analyze-all-button')) {
        setupAnalyzeAllButton();
        //sortNewestFirst();
    }

    setupAllAnalyzeButton();
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