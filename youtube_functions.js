function setupAnalyzeAllButton() {
  const analyzeAllDiv = addAnalyzeAllButton();
  if (!analyzeAllDiv) {
    return;
  }

  analyzeAllDiv.addEventListener('click', async () => {
    
    const span = analyzeAllDiv.querySelector('span');
    // Show spinner
    span.innerHTML = `<span style="
        display: inline-block;
        width: 14px; height: 14px;
        border: 2px solid white;
        border-top: 2px solid red;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        vertical-align: middle;"></span>`;
  
    const contentsSection = document.getElementById('contents');
    if (!contentsSection) return;
  
    const url = await getCurrentTabUrl();
  
    //
    // Default there are 20 comments until you scroll down, so there are 20 replies sections. even if there are no replies.
    // if no replies, the block - div[id="replies"] is hidden. 

    //if add analyze button to all comments, then use comment-1 here
    const topLevelComments = contentsSection.querySelectorAll('ytd-comment-view-model[id="comment"]');
    // Analyze top-level comments
    console.log("🔍 Analyzing top-level comments... " + topLevelComments.length);
    await processComments(topLevelComments, url, span);
  
    // Analyze replies
    const repliesSectionList = contentsSection.querySelectorAll('div[id="replies"]');
    //let replyCount = 0;
    console.log("🔍 Analyzing replies... " + repliesSectionList.length);
    for (const replySection of repliesSectionList) {
      //debug begin
      // replyCount++;
      // console.log(`🔍 Processing reply section ${replyCount}/${repliesSectionList.length}`);
      //debug end

      const mainComment = replySection.previousElementSibling;
      if (!mainComment) {
        console.warn("❗ No main comment found for this reply section, skipping...");
        continue;
      }
      const mainCommentData = collectUserData(mainComment);
      const moreButton = replySection.querySelector('ytd-button-renderer[id="more-replies"]');
      if (moreButton && !isReallyVisible(moreButton)) {
        moreButton.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        await delay(DELAY.SCROLL);
      }
      if (moreButton) {
        moreButton.click();
        await delay(DELAY.LOAD_REPLIES); // Wait for replies to load
      }
      
      const replyComments = replySection.querySelectorAll('div[id="contents"] ytd-comment-view-model');
      //debug begin
      // console.log(`🔍 Found ${replyComments.length} replies in section ${replyCount}/${repliesSectionList.length}`)
      // if (replyComments.length === 0) {
      //   console.warn("❗ No replies found in this section, skipping...");
      //   continue;
      // }
      //debug end

      if (!DEBUG_MODE) {
        await processComments(replyComments, url, span, mainCommentData);
      }
    }
  
    console.log("✅ Analyzed all comments and replies.");
    span.textContent = "analyze all";
    chrome.runtime.sendMessage({ action: "page_processed" });
  });

  return analyzeAllDiv;
}

function setupAnalyzeButton(commentSection) {

  const analyzeDiv = addAnalyzeButton(commentSection);
  if (!analyzeDiv) {
    return;
  }

  //⛳ Click handler
  analyzeDiv.addEventListener('click', async () => {

    const url = await getCurrentTabUrl();
    const span = analyzeDiv.querySelector('span');
    const userData = collectUserData(commentSection);
    userData.url = url;
    // Set spinner
    span.innerHTML = `<span style="
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid white;
          border-top: 2px solid red;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          vertical-align: middle;
        "></span>`;

    try {
      analyzeComment(commentSection, userData, span, true, null);
    } catch (err) {
      console.error("❌ Error fetching pros/cons:", err);
      alert("Failed to fetch analysis.");
    }
  });
  
}

async function analyzeComment(commentSection, commentData, span, isSingle, mainCommentData) {

  const rect = commentSection.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  try {
    let dataUrl = await getScreenshot();
    let img = await loadImage(dataUrl);
    const screenshot = await cropImageToBlob(img, rect, dpr);

    truncateAuthorSpan(commentSection);
    await delay(DELAY.UPDATE_DOM); // Wait for screenshot to be ready
    dataUrl = await getScreenshot();
    img = await loadImage(dataUrl);
    const screenshot_updated = await cropImageToBlob(img, rect, dpr);

    const result = await fetchAnalyzeResultWithImage(commentData, screenshot, screenshot_updated, mainCommentData);
    console.log("✅ Analysis result: " + result.answer.lead + " - " + result.answer.level);
    if (DEBUG_MODE) {
      showParsedResult(result.answer);
    }
  } catch (err) {
    console.error("❌ Error in analyzeComment:", err);
  }
  finally {
    if (isSingle) {
      span.textContent = "analyzed";
    }
  }
}

// Helper to process a list of comment nodes
async function processComments(commentList, url, span, mainCommentData) {
  //let count = 0;
  for (const commentSection of commentList) {
    // count++;
    // if (count > 1) {
    //   break;
    // }
    const userData = collectUserData(commentSection);
    if (!userData) continue;
    if (isOldComment(userData)) continue;
    if (!isValidComment(userData)) continue;
    userData.url = url;

    try {
      if (!isReallyVisible(commentSection)) {
        commentSection.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        await delay(DELAY.SCROLL);
      }
      await analyzeComment(commentSection, userData, span, false, mainCommentData);
      console.log("✅ Analyzed:", userData.author, "-", userData.content);
    } catch (err) {
      console.error("❌ Analyze error:", err);
    }
    await delay(DELAY.PROCESS_COMMENT); // 20 sec between comments
  }
}