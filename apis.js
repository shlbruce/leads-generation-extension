// apis.js
async function fetchSmartReply(serverUrl, apiKey, category, review) {
    const url = `${serverUrl}/api/v1/chatbot/${category}/analyze_review`;
    const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: apiKey, review: review })
    });

    if (!response.ok) throw new Error("Network error");
    const data = await response.json();
    return data;
}