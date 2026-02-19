document.addEventListener("DOMContentLoaded", () => {
    const tocContainer = document.querySelector('#toc-sidebar ul');
    const mainContent = document.querySelector('#main-content');
    if (!tocContainer || !mainContent) return;

    const headings = mainContent.querySelectorAll('h2, h3');
    let currentH2Item = null;
    let currentH2List = null;

    headings.forEach((heading, index) => {
        const id = heading.id || `heading-${index}`;
        heading.id = id;

        const li = document.createElement('li');
        li.className = 'nav-item';
        
        const a = document.createElement('a');
        a.className = 'nav-link';
        a.href = `#${id}`;
        a.textContent = heading.textContent.replace('▼', '').trim(); // 清理可能的箭头字符

        if (heading.tagName === 'H2') {
            li.appendChild(a);
            
            // 为 H2 创建一个专门放子 H3 的容器
            currentH2List = document.createElement('ul');
            currentH2List.className = 'nav flex-column'; 
            li.appendChild(currentH2List);
            
            tocContainer.appendChild(li);
            currentH2Item = li;
        } else if (heading.tagName === 'H3' && currentH2List) {
            li.appendChild(a);
            currentH2List.appendChild(li);
        }
    });

    // 监听 Bootstrap 的 ScrollSpy 激活事件
    window.addEventListener('activate.bs.scrollspy', (e) => {
        const activeLink = document.querySelector('#toc-sidebar .nav-link.active');
        if (!activeLink) return;

        // 找到当前激活链接所属的最高级 H2 项目
        const parentLi = activeLink.closest('#toc-sidebar > .nav > .nav-item');
        
        // 收起所有其他的 H3 列表
        document.querySelectorAll('#toc-sidebar > .nav > .nav-item').forEach(item => {
            const subNav = item.querySelector('.nav');
            if (subNav) {
                if (item === parentLi) {
                    subNav.style.display = 'block';
                } else {
                    subNav.style.display = 'none';
                }
            }
        });
    });
});