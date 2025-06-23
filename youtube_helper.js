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

function addAnalyzeButton(reply) {
  const analyzeDiv = document.createElement("div");
  // change the id to avoid repeatedly adding the button
  reply.id = "reply-button-end-1";
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
  reply.parentNode.insertBefore(analyzeDiv, reply.nextSibling);
}
  