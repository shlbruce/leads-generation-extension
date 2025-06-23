function findReview(rootElement) {
    if (!rootElement) return null;

    const path = ['div', 'div[4]'];
    const reviewNode = followPathWithIndex(rootElement, path);

    if (!reviewNode) {
        console.warn("Review node not found in the expected path.");
        return null;
    }
    return reviewNode.innerText.trim();
}


function findBody(rootElement) {
    if (!rootElement) return null;

    const bodys = rootElement.querySelectorAll('div[data-message-id]');

    for (const el of bodys) {
        const text = el.textContent.trim();
        if (text) {
            return text;
        }
    }

    return null;
}

function insertSmartReplyText(replyBody, replyText, thinkingSpan) {
    // Remove the "Thinking..." span
    if (thinkingSpan) {
        thinkingSpan.remove();
    }

    const replyEmailDiv = document.createElement("div");
    replyEmailDiv.innerHTML = replyText;
    replyEmailDiv.id = "replyEmailId";

    // Insert the reply span at the beginning of the reply box
    if (replyBody.firstChild) {
        replyBody.insertBefore(replyEmailDiv, replyBody.firstChild);
    } else {
        replyBody.appendChild(replyEmailDiv);
    }

    // Add a zero-width space so the cursor has somewhere to go
    replyBody.insertBefore(document.createTextNode("\u200B"), replyEmailDiv.nextSibling);

    // Dispatch input event to simulate typing
    replyBody.dispatchEvent(new InputEvent("input", { bubbles: true }));

    // Move cursor right after the reply text
    const range = document.createRange();
    const selection = window.getSelection();
    range.setStartAfter(replyEmailDiv);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
}