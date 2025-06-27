// apis.js
const serverUrl = "http://localhost:3001";
const apiKey = "your-api-key";

async function fetchAnalyzeResult(userData) {
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

async function fetchAnalyzeResultWithImage(userData, blob, mainCommentData) {
    const formData = new FormData();
    formData.append("screenshot", blob, "clip.png");
    formData.append("key", apiKey);
    // Add your JSON data as a string field
    formData.append("data", JSON.stringify(userData));
    if (mainCommentData) {
        formData.append("main_comment_data", JSON.stringify(mainCommentData));
    }
    const url = `${serverUrl}/api/v1/lead/travel_cruise/analyze`;
    const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        //can't set "multipart/form-data" manually, browser will set it automatically
        // otherwise the BE will report error : Error: Multipart: Boundary not found
        //headers: { "Content-Type": "multipart/form-data" },
        body: formData,
    });

    if (!response.ok) throw new Error("Network error");
    const data = await response.json();
    return data;
}