document.addEventListener("DOMContentLoaded", () => {
    const MAX_WIDTH_KEY = "layout-scale:max-width";
    const MIN_SCALE = 0.7;
    const DESKTOP_MEDIA_QUERY = "(min-width: 992px)";
    const supportsZoom = CSS.supports("zoom", "1");

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const getViewportWidth = () =>
        Math.max(window.innerWidth || 0, document.documentElement.clientWidth || 0);

    let maxViewportWidth = Number.parseInt(sessionStorage.getItem(MAX_WIDTH_KEY) || "", 10);
    if (Number.isNaN(maxViewportWidth) || maxViewportWidth <= 0) {
        maxViewportWidth = getViewportWidth();
        sessionStorage.setItem(MAX_WIDTH_KEY, String(maxViewportWidth));
    }

    const clearScaleStyles = () => {
        const body = document.body;
        if (!body) {
            return;
        }

        body.style.zoom = "";
        body.style.width = "";
        body.style.overflowX = "";
        body.style.transform = "";
        body.style.transformOrigin = "";
    };

    const applyScale = () => {
        const body = document.body;
        if (!body) {
            return;
        }

        if (!window.matchMedia(DESKTOP_MEDIA_QUERY).matches) {
            clearScaleStyles();
            return;
        }

        const currentWidth = getViewportWidth();
        if (currentWidth > maxViewportWidth) {
            maxViewportWidth = currentWidth;
            sessionStorage.setItem(MAX_WIDTH_KEY, String(maxViewportWidth));
        }

        // Max window width stays 1:1. Only shrink when window gets smaller.
        const scale = clamp(currentWidth / maxViewportWidth, MIN_SCALE, 1);

        if (supportsZoom) {
            body.style.zoom = scale.toFixed(4);
            body.style.width = "";
            body.style.overflowX = "";
            body.style.transform = "";
            body.style.transformOrigin = "";
            return;
        }

        // Fallback for browsers without `zoom`.
        body.style.zoom = "";
        body.style.width = `${100 / scale}%`;
        body.style.overflowX = "hidden";
        body.style.transform = `scale(${scale.toFixed(4)})`;
        body.style.transformOrigin = "top left";
    };

    let resizeTimer = null;
    window.addEventListener("resize", () => {
        if (resizeTimer) {
            window.clearTimeout(resizeTimer);
        }
        resizeTimer = window.setTimeout(applyScale, 80);
    });

    window.addEventListener("pageshow", applyScale);
    applyScale();
});
