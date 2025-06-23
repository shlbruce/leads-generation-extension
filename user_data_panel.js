async function submitUserData({ serverUrl, apiKey, category, userData }) {

    const replyBody = document.querySelector("div[aria-label='Message Body']");
    if (!replyBody) {
        alert("⚠️ Could not find reply body.");
        return;
    }

    replyBody.focus();

    try {
        const reply = await fetchSmartReplyWithData(serverUrl, apiKey, category, userData);

        insertSmartReplyText(replyBody, reply.answer, thinkingSpan);
    } catch (err) {
        console.error("❌ Error fetching smart reply:", err);
        alert("Failed to get smart reply.");
    }
}

function createDataInputPanel(tasks) {
    // Create overlay
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "9999";
  
    // Create panel
    const panel = document.createElement("div");
    panel.style.background = "#fff";
    panel.style.padding = "20px";
    panel.style.borderRadius = "8px";
    panel.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
    panel.style.width = "500px";
    panel.style.maxWidth = "90%";
    panel.style.boxSizing = "border-box";
    panel.style.maxHeight = "90vh";
    panel.style.overflowY = "auto";
  
    // Map to hold <textarea> for each task
    const responseMap = {};
  
    tasks.forEach(task => {
      // Create label
      const label = document.createElement("label");
      label.textContent = task.description || task.name;
      label.style.display = "block";
      label.style.marginTop = "12px";
      label.style.marginBottom = "6px";
      label.style.fontWeight = "bold";
  
      // Create textarea
      const textarea = document.createElement("textarea");
      textarea.style.width = "100%";
      textarea.style.height = "80px";
      textarea.style.marginBottom = "10px";
      textarea.style.padding = "8px";
      textarea.style.boxSizing = "border-box";
  
      responseMap[task.name] = textarea;
  
      panel.appendChild(label);
      panel.appendChild(textarea);
    });
  
    // Buttons container
    const buttonsDiv = document.createElement("div");
    buttonsDiv.style.display = "flex";
    buttonsDiv.style.justifyContent = "flex-end";
    buttonsDiv.style.gap = "10px";
    buttonsDiv.style.marginTop = "12px";
  
    // Cancel button
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.onclick = () => document.body.removeChild(overlay);
  
    // Submit button
    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.onclick = () => {
      // Step 1: build TaskUpdate[]
      const taskUpdates = tasks.map(task => ({
        name: task.name,
        result: responseMap[task.name].value
      }));
  
      // Step 2: remove panel
      document.body.removeChild(overlay);
  
      // Step 3: get config and call submitUserData
      chrome.storage.local.get(['serverUrl', 'talx2meApiKey', 'businessCategory'], (result) => {
        const serverUrl = result.serverUrl;
        const apiKey = result.talx2meApiKey;
        const category = result.businessCategory;
  
        if (apiKey && category) {
          submitUserData({ serverUrl, apiKey, category, userData: taskUpdates });
        } else {
          console.warn("⚠️ API key or business category missing.");
        }
      });
    };
  
    buttonsDiv.appendChild(cancelButton);
    buttonsDiv.appendChild(submitButton);
    panel.appendChild(buttonsDiv);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
  }
  
  