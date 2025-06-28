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
                    return;
                }

                // if (!isReallyVisible(thumbnail)) {
                //     thumbnail.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
                //     await delay(DELAY.SCROLL);
                // }
                const videoAnchor = thumbnail.querySelector("a#thumbnail");
                console.log("🔍 Searching for 'cruise' " + videoAnchor.href);
                count++;
            }
        }
        // Scroll down to load more content
        window.scrollBy({
            top: window.innerHeight / 3,
            left: 0,
            behavior: 'smooth'
        });
        console.log("So far total count: " + count);
        await delay(DELAY.LOAD_PAGE);
    }

}