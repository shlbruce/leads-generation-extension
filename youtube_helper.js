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
  sortMenu.parentNode.insertBefore(analyzeAllDiv, sortMenu.nextSibling);
}

function collectUserData(commentSection)  {
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

function waitNextFrame() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}

// async function sequentialClicks(elements) {
//   for (const el of elements) {
//     el.click();
//     await waitNextFrame(); // wait for the UI to respond before next click
//   }
// }

function showParsedResult(parsed) {
  const popup = document.createElement("div");
  popup.style.background = "#fff";
  popup.style.border = "1px solid #ccc";
  popup.style.padding = "20px";
  popup.style.borderRadius = "8px";
  popup.style.maxWidth = "400px";
  popup.style.fontFamily = "sans-serif";
  popup.style.fontSize = "18px";
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.boxShadow = "0 4px 24px rgba(0,0,0,0.15)";
  popup.style.zIndex = "999999";

  // Create close ("×") button
  const closeBtn = document.createElement("span");
  closeBtn.textContent = "×";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "12px";
  closeBtn.style.right = "18px";
  closeBtn.style.fontSize = "24px";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.fontWeight = "bold";
  closeBtn.style.color = "#888";
  closeBtn.onmouseenter = () => closeBtn.style.color = "#f00";
  closeBtn.onmouseleave = () => closeBtn.style.color = "#888";
  closeBtn.onclick = () => popup.remove();

  popup.appendChild(closeBtn);

  // Loop through each key-value in the parsed object
  for (const [key, value] of Object.entries(parsed)) {
    const section = document.createElement("div");
    section.style.marginBottom = "10px";

    const header = document.createElement("div");
    header.style.padding = "5px 0";

    const title = document.createElement("strong");
    title.textContent = `${key}: `;
    title.style.fontSize = "20px";

    header.appendChild(title);
    header.appendChild(document.createTextNode(value));

    section.appendChild(header);
    popup.appendChild(section);
  }

  document.body.appendChild(popup);
}

function sortNewestFirst() {
  const sortMenu = document.getElementById('sort-menu');
  if (!sortMenu) {
    return;
  }

  setTimeout(async () => {
    // Ensure the menu is visible
    const trigger = sortMenu.querySelector('tp-yt-paper-button[id="label"]');
    if (!trigger) {
      return;
    }
    trigger.click();
    await waitNextFrame();
    clickNewestFirst(sortMenu);
  }, 5000);
}

function clickNewestFirst(sortMenu) {
  const menu = sortMenu.querySelector('tp-yt-paper-listbox[id="menu"]');
  if (!menu) {
    return;
  }

  const sortOptions = menu.querySelectorAll('a');
  for (const option of sortOptions) {
    if (option.textContent.includes('Newest first')) {
      option.click();
      break;
    }
  }
}

function analyzeComment(serverUrl, element, apiKey, commentData, span) {
  const rect = element.getBoundingClientRect();
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
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
        const sx = (rect.left + scrollX) * dpr;
        const sy = (rect.top + scrollY) * dpr;
        const sw = rect.width * dpr;
        const sh = rect.height * dpr;

        const canvas = document.createElement("canvas");
        canvas.width = sw;
        canvas.height = sh;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

        // Convert to Blob and upload with FormData
        canvas.toBlob(async function (blob) {

          //
          //debug start
          //
          // Check if blob is created successfully
          if (blob) {
            const blobUrl = URL.createObjectURL(blob);
            console.log('Blob URL created:', blobUrl); // Log the Blob URL

            // Open the Blob URL in a new tab
            window.open(blobUrl, "_blank");

            // IMPORTANT: Revoke the Blob URL when no longer needed to free up memory
            // You can do this after the tab has loaded, or when the user closes the tab,
            // or just later in your code if you're keeping track. For a simple display,
            // you might revoke it after a short delay or when the tab loses focus.
            // For this example, we'll revoke it in the next tick to ensure the new tab has time to load it.
            // In a more complex app, you might track opened tabs and revoke on close.
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000); // Revoke after 1 second
          } else {
            console.error("Failed to create blob from canvas.");
          }
          //
          //debug end
          //

          try {
            //debug
            console.log('Blob size:', blob.size);
            //

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