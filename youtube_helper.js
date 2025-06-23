function addAnalyzeAllButton() {
  let sortMenu = document.getElementById('sort-menu');

  if (!sortMenu) {
    return;
  }

  sortMenu = sortMenu.parentElement

  const analyzeAllDiv = document.createElement("div");
  analyzeAllDiv.id = "analyze-all-button";
  const button = document.createElement("button");
  button.textContent = "analyze all";
  analyzeAllDiv.appendChild(button);
  sortMenu.parentNode.insertBefore(analyzeAllDiv, sortMenu.nextSibling);
}

function addAnalyzeButton(reply) {
  const analyzeDiv = document.createElement("div");
  reply.id = "reply-button-end-1";
  analyzeDiv.id = "analyze-button";
  const button = document.createElement("button");
  button.textContent = "analyze";
  analyzeDiv.appendChild(button);
  reply.parentNode.insertBefore(analyzeDiv, reply.nextSibling);
}
  