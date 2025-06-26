function collectUserData(commentSection) {
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

function isValidComment(userData) {
  return userData.content.length > 10;
}

function isOldComment(userData) {
  if (!userData.publishTime) {
    return true; // If no publish time, consider it old
  }
  const minutes = timeAgoToMinutes(userData.publishTime);
  return minutes > 3 * 24 * 60; // Consider comments older than 3 days as old
}