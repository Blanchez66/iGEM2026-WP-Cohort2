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
        wrapper.style.opacity = '1';
        
        let next = h2.nextElementSibling;
        while (next && next.tagName !== 'H2') {
            let temp = next.nextElementSibling;
            wrapper.appendChild(next);
            next = temp;
        }
        h2.parentNode.insertBefore(wrapper, next);

        let isCollapsed = false;

        const setExpanded = () => {
            isCollapsed = false;
            wrapper.style.maxHeight = 'none';
            wrapper.style.opacity = '1';
            icon.style.transform = 'rotate(0deg)';
        };

        const collapse = () => {
            isCollapsed = true;
            // Start from full content height so closing animation is smooth.
            wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
            window.requestAnimationFrame(() => {
                wrapper.style.maxHeight = '0px';
                wrapper.style.opacity = '0';
            });
            icon.style.transform = 'rotate(-90deg)';
        };

        const expand = () => {
            isCollapsed = false;
            wrapper.style.opacity = '1';
            wrapper.style.maxHeight = '0px';
            window.requestAnimationFrame(() => {
                wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
            });
            icon.style.transform = 'rotate(0deg)';
        };

        h2.addEventListener('click', () => {
            if (isCollapsed) {
                expand();
            } else {
                collapse();
            }
        });

        wrapper.addEventListener('transitionend', (event) => {
            if (event.propertyName === 'max-height' && !isCollapsed) {
                wrapper.style.maxHeight = 'none';
            }
        });

        setExpanded();
    });
});
