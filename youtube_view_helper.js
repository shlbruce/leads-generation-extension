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