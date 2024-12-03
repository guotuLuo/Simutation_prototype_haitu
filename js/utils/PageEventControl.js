function disablePageInteractions() {
        // 禁用页面所有点击事件
        const allElements = document.querySelectorAll('body *');
        allElements.forEach(element => {
            element.style.pointerEvents = 'none';
        });
    }

function enablePageInteractions() {
        // 恢复页面所有点击事件
        const allElements = document.querySelectorAll('body *');
        allElements.forEach(element => {
            element.style.pointerEvents = 'auto';
        });
    }