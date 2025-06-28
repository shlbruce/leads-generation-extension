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
  }, DELAY.LOAD_WHOLE_COMMENTS);
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

function createAnalyzeAllButton() {
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

  return analyzeAllDiv;
}

function addAnalyzeAllButton() {
  let sortMenu = document.getElementById('sort-menu');
  if (!sortMenu) {
    return;
  }
  sortMenu = sortMenu.parentElement

  const analyzeAllDiv = createAnalyzeAllButton();
  sortMenu.parentNode.insertBefore(analyzeAllDiv, sortMenu.nextSibling);
  return analyzeAllDiv;
}

function createAnalyzeButton() {
  const analyzeDiv = document.createElement("div");
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

  return analyzeDiv;
}

function addAnalyzeButton(commentSection) {
  const reply = commentSection.querySelector('ytd-button-renderer[id="reply-button-end"]');
  if (!reply) {
    return;
  }

  // change the id to avoid repeatedly adding the button
  commentSection.id = "comment-1";
  const analyzeDiv = createAnalyzeButton();

  reply.parentNode.insertBefore(analyzeDiv, reply.nextSibling);

  return analyzeDiv;
}