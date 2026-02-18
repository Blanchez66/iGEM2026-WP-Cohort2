document.addEventListener('DOMContentLoaded', function () {
    const tocSidebar = document.querySelector('#toc-sidebar ul');
    const mainContent = document.getElementById('main-content');

    if (!tocSidebar || !mainContent) {
        return; // Exit if sidebar or main content not found
    }

    const headings = mainContent.querySelectorAll('h2, h3');
    if (headings.length === 0) {
        const tocContainer = document.getElementById('toc-sidebar');
        if(tocContainer) tocContainer.style.display = 'none';
        return; // Hide sidebar if no headings
    }

    headings.forEach((heading, index) => {
        // Ensure heading has an ID for linking
        if (!heading.id) {
            // Create a simple, unique ID
            heading.id = `toc-heading-${index}`;
        }

        // Create list item and link
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        
        link.setAttribute('href', `#${heading.id}`);
        link.textContent = heading.textContent;
        link.classList.add('nav-link');

        // Indent H3 titles
        if (heading.tagName === 'H3') {
            link.classList.add('ms-3');
        }

        listItem.appendChild(link);
        tocSidebar.appendChild(listItem);
    });
});
