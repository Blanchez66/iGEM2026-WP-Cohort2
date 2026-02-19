document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const h2s = mainContent.querySelectorAll('h2');

    h2s.forEach(h2 => {
        h2.style.cursor = 'pointer';
        h2.classList.add('d-flex', 'justify-content-between', 'align-items-center');
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-chevron-down ms-2';
        icon.style.transition = 'transform 0.3s ease';
        h2.appendChild(icon);

        const wrapper = document.createElement('div');
        wrapper.className = 'collapse-wrapper';
        wrapper.style.overflow = 'hidden';
        wrapper.style.transition = 'max-height 0.5s ease-out, opacity 0.3s ease';
        
        let next = h2.nextElementSibling;
        while (next && next.tagName !== 'H2') {
            let temp = next.nextElementSibling;
            wrapper.appendChild(next);
            next = temp;
        }
        h2.parentNode.insertBefore(wrapper, next);

        h2.addEventListener('click', () => {
            const isCollapsed = wrapper.style.maxHeight === '0px';
            
            if (isCollapsed) {
                wrapper.style.maxHeight = wrapper.scrollHeight + "px";
                wrapper.style.opacity = "1";
                icon.style.transform = 'rotate(0deg)';
            } else {
                wrapper.style.maxHeight = "0px";
                wrapper.style.opacity = "0";
                icon.style.transform = 'rotate(-90deg)';
            }
        });

        wrapper.style.maxHeight = wrapper.scrollHeight + "px";
    });
});