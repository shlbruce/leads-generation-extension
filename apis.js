// apis.js
async function fetchAnalyzeResult(serverUrl, apiKey, userData) {
    const url = `${serverUrl}/api/v1/lead/travel_cruise/analyze`;
    const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: apiKey, data: userData })
    });

    if (!response.ok) throw new Error("Network error");
    const data = await response.json();
    return data;
}