// static/js/number.js

document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll('.counter-num');
    const animationDuration = 2000; // 动画总时长，2000毫秒(2秒)

    const animateCounters = (counter) => {
        const targetStr = counter.getAttribute('data-target');
        const target = parseFloat(targetStr);
        // 判断原数字有几位小数，以保证动画过程中格式统一
        const decimals = targetStr.includes('.') ? targetStr.split('.')[1].length : 0;
        
        const startTime = performance.now();

        const updateCount = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / animationDuration, 1);
            
            // 使用 easeOutQuart 缓动函数，让数字增长先快后慢，更自然
            const easeOutProgress = 1 - Math.pow(1 - progress, 4); 
            const currentCount = target * easeOutProgress;

            if (progress < 1) {
                counter.innerText = currentCount.toFixed(decimals);
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target.toFixed(decimals); // 确保最后定格在精确数字
            }
        };
        requestAnimationFrame(updateCount);
    };

    // IntersectionObserver 用来检测元素是否滚动到可视区域内
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters(entry.target);
                // 动画触发后取消观察，保证只会执行一次
                observer.unobserve(entry.target); 
            }
        });
    }, { 
        threshold: 0.8 // 当数字元素 80% 进入屏幕时触发
    });

    counters.forEach(counter => {
        observer.observe(counter);
    });
});