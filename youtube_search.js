function search_cruise() {
    const primarySection = document.getElementById('primary');
    
    if (!primarySection) {
        return;
    }
    primarySection.id = "primary-1";
    const contentSection = primarySection.querySelector("div#contents");
    if (!contentSection) {
        console.warn("❗ Content section not found, cannot search for 'cruise'.");
        return;
    }
    const itemSections = contentSection.querySelectorAll("ytd-item-section-renderer");

    for (const itemSection of itemSections) {
        const itemContent = itemSection.querySelector("div[id='contents']");
        if (!itemContent) {
            console.warn("❗ Item content not found, skipping this section.");
            continue;
        }

        const videoList = itemContent.querySelectorAll("ytd-video-renderer");
        for (const video of videoList) {
            const thumbnail = video.querySelector("ytd-thumbnail");
            if (!thumbnail) {
                return;
            }
            const videoAnchor = thumbnail.querySelector("a#thumbnail");
            console.log("🔍 Searching for 'cruise' " + videoAnchor.href);
        }
    }
}