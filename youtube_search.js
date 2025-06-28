async function search_cruise() {
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

    const urlSet = new Set();

    const result = await chrome.storage.local.get(['cruiseUrls']);
    const savedUrls = result.cruiseUrls || [];
    for (const url of savedUrls) {
    urlSet.add(url);
    }
    // urlSet is now updated
    console.log("Loaded URLs into urlSet:", urlSet);

    let count = 0;

    while (count < 100) {
        const itemContentList = contentSection.querySelectorAll("div#contents");
        console.log("🔍 Find itemContent section" + itemContentList.length);
        for (const itemContent of itemContentList) {
            if (!itemContent) {
                console.warn("❗ Item content not found, skipping this section.");
                continue;
            }
            itemContent.id = "contents-1";
            const videoList = itemContent.querySelectorAll("ytd-video-renderer");
            for (const video of videoList) {
                const thumbnail = video.querySelector("ytd-thumbnail");
                if (!thumbnail) {
                    console.warn("❗ Thumbnail not found, skipping this video.");
                    return;
                }

                // if (!isReallyVisible(thumbnail)) {
                //     thumbnail.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
                //     await delay(DELAY.SCROLL);
                // }
                const videoAnchor = thumbnail.querySelector("a#thumbnail");
                //https://www.youtube.com/shorts/ReLbQsajSms
                if (videoAnchor.href.incluedes("www.youtube.com/shorts")) {
                    console.warn("❗ Skipping shorts video: " + videoAnchor.href);
                    continue;
                }
                console.log("🔍 Searching for 'cruise' " + videoAnchor.href);
                urlSet.add(videoAnchor.href);
                count++;
            }
        }
        // Scroll down to load more content
        window.scrollBy({
            top: window.innerHeight * 2 / 3,
            left: 0,
            behavior: 'smooth'
        });
        console.log("So far total count: " + count);
        await delay(DELAY.LOAD_PAGE);
    }

    await chrome.storage.local.set({ cruiseUrls: Array.from(urlSet) });
    console.log("URLs saved to chrome.storage.local");
}