function followPathWithIndex(root, path) {
  let current = root;

  for (const step of path) {
    let match = step.match(/^([a-zA-Z0-9\-\._]+)(\[(\d+)\])?$/); // e.g., div[3] or div
    let selector = step;
    let index = 1; // default to first match

    if (match) {
      selector = match[1];           // tag or class
      index = match[3] ? Number(match[3]) : 1;
    }

    const elements = current.querySelectorAll(':scope > div');
    if (elements.length < index) return null; // not enough matches
    current = elements[index - 1]; // 0-based index
    if (!current) return null;
  }
  return current;
}

function waitNextFrame() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// async function sequentialClicks(elements) {
//   for (const el of elements) {
//     el.click();
//     await waitNextFrame(); // wait for the UI to respond before next click
//   }
// }

function getCurrentTabUrl() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "GET_TAB_URL" }, function (response) {
      resolve(response.url);
    });
  });
}

function isEntirelyInViewport(elem) {
  if (!elem) return false;
  const rect = elem.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
}

function isElementVisible(elem) {
  if (!elem) return false;
  const style = window.getComputedStyle(elem);
  return (
    style &&
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0'
  );
}

function isReallyVisible(elem) {
  return isElementVisible(elem) && isEntirelyInViewport(elem);
}

// 7 months ago
// 1 year ago
// 13 days ago
// 1 day ago
// 2 weeks ago 
// 6 minutes ago
// 5 hours ago
function timeAgoToMinutes(str) {
  const regex = /(\d+)\s+(minute|hour|day|week|month|year)s?\s+ago/i;
  const match = str.match(regex);
  if (!match) return null; // Invalid input

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  // Conversion rates to minutes
  const factors = {
    minute: 1,
    hour: 60,
    day: 60 * 24,
    week: 60 * 24 * 7,
    month: 60 * 24 * 30, // approx, not exact
    year: 60 * 24 * 365  // approx, not exact
  };

  return value * factors[unit];
}

function getScreenshot() {
  // Returns a Promise that resolves with the dataUrl
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: "REQUEST_SCREENSHOT" },
      (dataUrl) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(dataUrl);
        }
      }
    );
  });
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function cropImageToBlob(img, rect, dpr) {
  const sx = rect.left * dpr;
  const sy = rect.top * dpr;
  const sw = rect.width * dpr;
  const sh = rect.height * dpr;

  const canvas = document.createElement("canvas");
  canvas.width = sw;
  canvas.height = sh;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to create image blob"));
    }, "image/png")
  );
}

function shuffleArray(array) {
  // Fisher-Yates shuffle (in-place)
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]];    // swap elements
  }
}
