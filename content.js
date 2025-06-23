function showParsedResult(parsed) {
  // Create the popup container
  const popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.backgroundColor = "#fff";
  popup.style.border = "1px solid #ccc";
  popup.style.borderRadius = "8px";
  popup.style.padding = "20px";
  popup.style.width = "400px";
  popup.style.maxHeight = "80vh";
  popup.style.overflowY = "auto";
  popup.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
  popup.style.zIndex = "9999";

  // Close button
  const closeButton = document.createElement("div");
  closeButton.textContent = "✖";
  closeButton.style.position = "absolute";
  closeButton.style.top = "10px";
  closeButton.style.right = "15px";
  closeButton.style.cursor = "pointer";
  closeButton.style.fontSize = "18px";
  closeButton.style.fontWeight = "bold";
  closeButton.onclick = () => document.body.removeChild(popup);
  popup.appendChild(closeButton);

  // Content
  for (const [category, info] of Object.entries(parsed)) {
    if (category === "Overall Impression") {
      const overall = document.createElement("p");
      overall.style.marginTop = "20px";
      overall.style.fontStyle = "italic";
      overall.textContent = `💬 ${category}: ${info}`;
      popup.appendChild(overall);
      continue;
    }

    const section = document.createElement("div");
    section.style.marginBottom = "10px";

    const header = document.createElement("div");
    header.style.cursor = "pointer";
    header.style.padding = "5px 0";

    const toggleIcon = document.createElement("span");
    toggleIcon.textContent = "+ ";
    toggleIcon.style.fontWeight = "bold";
    toggleIcon.style.marginRight = "6px";

    const hasExplanation = info.explanation && info.explanation !== "Not mentioned" && info.score !== null;

    const title = document.createElement("strong");
    title.textContent = `${category}:`;

    const starSpan = document.createElement("span");
    starSpan.style.marginLeft = "12px";

    if (hasExplanation) {
      const fullStars = "★".repeat(info.score);
      const emptyStars = "☆".repeat(5 - info.score);
      starSpan.style.color = "gold";
      starSpan.textContent = `${fullStars}${emptyStars}`;
    } else {
      starSpan.style.color = "#999";
      starSpan.textContent = "Not mentioned";
    }

    header.appendChild(toggleIcon);
    header.appendChild(title);
    header.appendChild(starSpan);

    const body = document.createElement("div");
    body.style.display = "none";
    body.style.marginLeft = "20px";
    body.textContent = hasExplanation ? info.explanation : "";

    header.onclick = () => {
      const isCollapsed = body.style.display === "none";
      body.style.display = isCollapsed ? "block" : "none";
      toggleIcon.textContent = isCollapsed ? "− " : "+ ";
    };

    section.appendChild(header);
    section.appendChild(body);
    popup.appendChild(section);
  }

  document.body.appendChild(popup);
}

function addButtonsToAnalyze() {

  if (!document.getElementById('analyze-all-button')) {
    addAnalyzeAllButton();
  }



  const commentsSection = document.getElementById('comments');
  if (!commentsSection) {
    return;
  }
  const replyButtonList = commentsSection.querySelectorAll('ytd-button-renderer[id="reply-button-end"]');

  replyButtonList.forEach((reply) => {

    addAnalyzeButton(reply);



    // ⛳ Click handler
    // prosConsButtun.addEventListener('click', async () => {
    //     const serverUrl = "http://localhost:3001"; 
    //     const apiKey = "your-api-key"; 
    //     const category = "restaurant"; 

    //     const span = prosConsButtun.querySelector('span');
    //     if (!span) return;

    //     // Backup original text
    //     const originalText = span.textContent;

    //     // Set spinner
    //     span.innerHTML = `<span style="
    //       display: inline-block;
    //       width: 14px;
    //       height: 14px;
    //       border: 2px solid white;
    //       border-top: 2px solid red;
    //       border-radius: 50%;
    //       animation: spin 1s linear infinite;
    //       vertical-align: middle;
    //     "></span>`;

    //     try {
    //       const result = await fetchSmartReply(serverUrl, apiKey, category, reviewText);
    //       const parsed = JSON.parse(result.answer);
    //       showParsedResult(parsed);
    //     } catch (err) {
    //       console.error("❌ Error fetching pros/cons:", err);
    //       alert("Failed to fetch pros/cons analysis.");
    //     } finally {
    //       // Restore text
    //       span.textContent = originalText;
    //     }
    //   });
  });
}

// Run initially and observe DOM changes
addButtonsToAnalyze();
const observer = new MutationObserver(addButtonsToAnalyze);
observer.observe(document.body, { childList: true, subtree: true });  