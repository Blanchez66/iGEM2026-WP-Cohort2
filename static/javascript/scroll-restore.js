document.addEventListener("DOMContentLoaded", () => {
    const pageKey = `${window.location.pathname}${window.location.search}`;
    const storageKey = `scroll-pos:${pageKey}`;
    let scrollTimer = null;

    const saveScrollPosition = () => {
        sessionStorage.setItem(storageKey, String(window.scrollY));
    };

    const isReloadNavigation = () => {
        if (typeof performance.getEntriesByType === "function") {
            const navEntries = performance.getEntriesByType("navigation");
            if (navEntries.length > 0) {
                return navEntries[0].type === "reload";
            }
        }

        if (performance.navigation) {
            return performance.navigation.type === 1;
        }

        return false;
    };

    window.addEventListener(
        "scroll",
        () => {
            if (scrollTimer) {
                window.clearTimeout(scrollTimer);
            }
            scrollTimer = window.setTimeout(saveScrollPosition, 120);
        },
        { passive: true }
    );

    window.addEventListener("beforeunload", saveScrollPosition);

    const restoreScrollPosition = () => {
        const savedY = Number.parseInt(sessionStorage.getItem(storageKey) || "", 10);
        if (Number.isNaN(savedY)) {
            return;
        }

        // Run after initial layout/anchor processing to ensure final position is restored.
        window.requestAnimationFrame(() => {
            window.scrollTo(0, savedY);
        });
    };

    if (isReloadNavigation()) {
        restoreScrollPosition();
        window.addEventListener("load", restoreScrollPosition, { once: true });
    }
});
