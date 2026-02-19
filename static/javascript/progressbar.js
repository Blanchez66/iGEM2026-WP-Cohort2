function updateScrollProgress() {
    const winScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = document.documentElement.clientHeight;
    const totalScrollable = docHeight - winHeight;
    
    if (totalScrollable > 0) {
        const scrolled = (winScroll / totalScrollable) * 100;
        
        const progressBar = document.getElementById("progress-bar");
        const progressLogo = document.getElementById("progress-logo");

        if (progressBar) {
            progressBar.style.width = scrolled + "%";
        }

        if (progressLogo) {
            const rotation = scrolled * 36; 
            
            progressLogo.style.transform = `translateY(-50%) rotate(${rotation}deg)`;
        }
    }
}

window.addEventListener('scroll', updateScrollProgress);
window.addEventListener('load', updateScrollProgress);
window.addEventListener('resize', updateScrollProgress);