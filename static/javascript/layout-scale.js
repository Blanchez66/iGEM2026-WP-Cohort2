document.addEventListener("DOMContentLoaded", () => {
    const clearScaleStyles = () => {
        const body = document.body;
        if (!body) {
            return;
        }

        // Keep typography stable: do not apply global zoom/scale to body.
        body.style.zoom = "";
        body.style.width = "";
        body.style.overflowX = "";
        body.style.transform = "";
        body.style.transformOrigin = "";
    };

    window.addEventListener("resize", clearScaleStyles);
    window.addEventListener("pageshow", clearScaleStyles);
    clearScaleStyles();
});
