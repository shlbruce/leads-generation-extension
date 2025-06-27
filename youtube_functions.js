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
      await processComments(replyComments, url, span);
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

    const span = analyzeDiv.querySelector('span');
    const userData = collectUserData(commentSection);
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
      analyzeComment(commentSection, userData, span, true);
    } catch (err) {
      console.error("❌ Error fetching pros/cons:", err);
      alert("Failed to fetch analysis.");
    }
  });
  
}

function analyzeComment(element, commentData, span, isSingle) {
  const rect = element.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  // Request screenshot from background
  chrome.runtime.sendMessage(
    {
      type: "REQUEST_SCREENSHOT"
    },
    (dataUrl) => {
      const img = new Image();
      img.onload = function () {
        // Coordinates in device pixels
        const sx = rect.left * dpr;
        const sy = rect.top * dpr;
        const sw = rect.width * dpr;
        const sh = rect.height * dpr;

        const canvas = document.createElement("canvas");
        canvas.width = sw;
        canvas.height = sh;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

        // Convert to Blob and upload with FormData
        canvas.toBlob(async function (blob) {
          try {
            const result = await fetchAnalyzeResultWithImage(commentData, blob);
            showParsedResult(result.answer);
          }
          catch (err) {
            console.error("❌ Error fetching pros/cons:", err);
            alert("Failed to fetch analysis.");
          } finally {
            if (isSingle) {
              span.textContent = "analyzed";
            }
          }
        }, "image/png");
      };
      img.src = dataUrl;
    }
  );
}

// Helper to process a list of comment nodes
async function processComments(commentList, url, span) {
  let count = 0;
  for (const commentSection of commentList) {
    count++;
    if (count > 1) {
      break;
    }
    const userData = collectUserData(commentSection);
    if (!userData) continue;
    //if (isOldComment(userData)) break;
    //if (!isValidComment(userData)) continue;
    userData.url = url;

    try {
      if (!isReallyVisible(commentSection)) {
        commentSection.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        await delay(DELAY.SCROLL);
      }
      await analyzeComment(commentSection, userData, span, false);
      console.log("✅ Analyzed:", userData.author, "-", userData.content);
    } catch (err) {
      console.error("❌ Analyze error:", err);
    }
    await delay(DELAY.PROCESS_COMMENT); // 20 sec between comments
  }
}