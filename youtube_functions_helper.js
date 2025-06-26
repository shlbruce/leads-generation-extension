function addAnalyzeAllButton() {
  let sortMenu = document.getElementById('sort-menu');

  if (!sortMenu) {
    return;
  }

  sortMenu = sortMenu.parentElement

  const analyzeAllDiv = document.createElement("div");
  analyzeAllDiv.id = "analyze-all-button";

  // Apply styling
  analyzeAllDiv.style.border = '2px solid white';      // White border
  analyzeAllDiv.style.borderRadius = '20px';           // Fully rounded corners
  analyzeAllDiv.style.padding = '5px 12px';            // Comfortable spacing
  analyzeAllDiv.style.cursor = 'pointer';              // Pointer on hover

  const span = document.createElement("span");
  span.textContent = "analyze all";
  span.style.color = 'red';
  span.style.fontSize = '14px';
  span.style.fontFamily = '"Segoe UI", "Roboto", "Helvetica", sans-serif';
  analyzeAllDiv.appendChild(span);

  analyzeAllDiv.addEventListener('click', async () => {
    const serverUrl = "http://localhost:3001";
    const apiKey = "your-api-key";

    const span = analyzeAllDiv.querySelector('span');
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

    const contentsSection = document.getElementById('contents');
    if (!contentsSection) {
      return;
    }

    const url = await getCurrentTabUrl();

    // const commentSectionList = contentsSection.querySelectorAll('ytd-comment-view-model[id="comment-1"]');

    // for (const commentSection of commentSectionList) {
    //   const userData = collectUserData(commentSection);

    //   if (userData) {
    //     if (isOldComment(userData)) {
    //       console.log("Stopping old comment:", userData.author + " - " + userData.content);
    //       break; // Stop processing if we hit an old comment
    //     }
    //     if (!isValidComment(userData)) {
    //       console.log("Skipping invalid comment:", userData.author + " - " + userData.content);
    //       continue; // Skip invalid comments
    //     }
    //     userData.url = url;
    //     try {

    //       if (!isReallyVisible(commentSection)) {
    //         commentSection.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    //         await delay(5000); // Wait for scroll to finish
    //       }
    //       await analyzeComment(serverUrl, commentSection, apiKey, userData, span);
    //       console.log("✅ Successfully analyzed comment:", userData.author + " - " + userData.content);
    //     } catch (err) {
    //       console.error("❌ Error fetching analyze result:", err);
    //     }
    //   }
    //   await delay(20000); // Wait 10 seconds before next iteration
    // }

    const repliesSectionList = contentsSection.querySelectorAll('div[id="replies"]');
    for (const replySection of repliesSectionList) {

      const moreButton = replySection.querySelector('ytd-button-renderer[id="more-replies"]');
      if (!moreButton) {
        continue;
      }

      if (!isReallyVisible(moreButton)) {
        moreButton.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        await delay(2000);
      }

      moreButton.click();
      await delay(10000); // Wait for replies to load

      const contentsSecton = replySection.querySelector('div[id="contents"]');
      if (!contentsSecton) {
        continue;
      }
      contentSectionList = contentsSecton.querySelectorAll('ytd-comment-view-model')
      if (contentSectionList.length === 0) {
        continue;
      }

      for (const commentSection of contentSectionList) {
        const userData = collectUserData(commentSection);
        console.log("Processing reply comment:", userData.author + " - " + userData.content);
        if (userData) {
          // if (isOldComment(userData)) {
          //   console.log("Stopping old comment:", userData.author + " - " + userData.content);
          //   break; // Stop processing if we hit an old comment
          // }
          // if (!isValidComment(userData)) {
          //   console.log("Skipping invalid comment:", userData.author + " - " + userData.content);
          //   continue; // Skip invalid comments
          // }
          userData.url = url;
          try {
  
            if (!isReallyVisible(commentSection)) {
              commentSection.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
              await delay(5000); // Wait for scroll to finish
            }
            await analyzeComment(serverUrl, commentSection, apiKey, userData, span);
            console.log("✅ Successfully analyzed comment:", userData.author + " - " + userData.content);
          } catch (err) {
            console.error("❌ Error fetching analyze result:", err);
          }
        }
        await delay(20000); // Wait 10 seconds before next iteration
      }
    }
    console.log("✅ Successfully analyzed all replies.");
    span.textContent = "analyze all";
  });

  sortMenu.parentNode.insertBefore(analyzeAllDiv, sortMenu.nextSibling);
}

function collectUserData(commentSection) {
  const mainSection = commentSection.querySelector('div[id="main"]');
  if (!mainSection) {
    return null;
  }
  const author = mainSection.querySelector('a[id="author-text"]');
  if (!author) {
    return null;
  }
  const authorName = author.textContent.trim();
  let publishTime = mainSection.querySelector('span[id="published-time-text"]');
  if (publishTime) {
    publishTime = publishTime.textContent.trim();
  }
  const content = mainSection.querySelector('yt-attributed-string[id="content-text"]');
  if (!content) {
    return {};
  }
  const commentText = content.textContent.trim();
  return {
    author: authorName,
    publishTime: publishTime,
    content: commentText
  }
}

function addAnalyzeButton(commentSection) {

  const reply = commentSection.querySelector('ytd-button-renderer[id="reply-button-end"]');

  const analyzeDiv = document.createElement("div");
  // change the id to avoid repeatedly adding the button
  commentSection.id = "comment-1";
  analyzeDiv.id = "analyze-button";
  // Apply styling
  analyzeDiv.style.border = '2px solid white';      // White border
  analyzeDiv.style.borderRadius = '20px';           // Fully rounded corners
  analyzeDiv.style.padding = '5px 12px';            // Comfortable spacing
  analyzeDiv.style.cursor = 'pointer';              // Pointer on hover

  const span = document.createElement("span");
  span.textContent = "analyze";
  span.style.color = 'red';
  span.style.fontSize = '14px';
  span.style.fontFamily = '"Segoe UI", "Roboto", "Helvetica", sans-serif';

  analyzeDiv.appendChild(span);

  //⛳ Click handler
  analyzeDiv.addEventListener('click', async () => {
    const serverUrl = "http://localhost:3001";
    const apiKey = "your-api-key";

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
      analyzeComment(serverUrl, commentSection, apiKey, userData, span);
    } catch (err) {
      console.error("❌ Error fetching pros/cons:", err);
      alert("Failed to fetch analysis.");
    }
  });
  reply.parentNode.insertBefore(analyzeDiv, reply.nextSibling);
}

function analyzeComment(serverUrl, element, apiKey, commentData, span) {
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
            const result = await fetchAnalyzeResultWithImage(serverUrl, apiKey, commentData, blob);
            showParsedResult(result.answer);
          }
          catch (err) {
            console.error("❌ Error fetching pros/cons:", err);
            alert("Failed to fetch analysis.");
          } finally {
            span.textContent = "analyze";
          }
        }, "image/png");
      };
      img.src = dataUrl;
    }
  );
}

function isValidComment(userData) {
  return userData.content.length > 10;
}

function isOldComment(userData) {
  if (!userData.publishTime) {
    return true; // If no publish time, consider it old
  }
  const minutes = timeAgoToMinutes(userData.publishTime);
  return minutes > 3 * 24 * 60; // Consider comments older than 3 days as old
}