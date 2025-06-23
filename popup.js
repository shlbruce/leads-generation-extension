const serverUrlInput = document.getElementById('serverUrl');
const apiKeyInput = document.getElementById('apiKey');
const delayInput = document.getElementById('replyDelay');
const saveButton = document.getElementById('save');
const categoryRadios = document.querySelectorAll('input[name="category"]');

// Load stored values
chrome.storage.local.get(
  ['serverUrl', 'talx2meApiKey', 'businessCategory', 'replyDelay'],
  function (result) {
    serverUrlInput.value = result.serverUrl || "https://talx2me.com";

    if (result.talx2meApiKey) {
      apiKeyInput.value = result.talx2meApiKey;
    }

    if (result.replyDelay !== undefined) {
      delayInput.value = result.replyDelay;
    }

    if (result.businessCategory) {
      for (const radio of categoryRadios) {
        if (radio.value === result.businessCategory) {
          radio.checked = true;
          break;
        }
      }
    }
  }
);

// Save values
saveButton.addEventListener('click', () => {
  const serverUrl = serverUrlInput.value.trim();
  const key = apiKeyInput.value.trim();
  const selectedCategory = [...categoryRadios].find(r => r.checked)?.value;
  const replyDelay = parseInt(delayInput.value.trim(), 10) || 1000; // default to 1000 if invalid

  chrome.storage.local.set(
    {
      serverUrl,
      talx2meApiKey: key,
      businessCategory: selectedCategory || null,
      replyDelay
    },
    () => {
      saveButton.textContent = "✅ Saved!";
      setTimeout(() => saveButton.textContent = "💾 Save Settings", 1500);
    }
  );
});
