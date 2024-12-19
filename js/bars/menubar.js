class Menubar {
    constructor() {
        // 绑定文件输入框事件
        document.getElementById('file-input').addEventListener('change', handleFileInputChange);

    }

    initializeMenubar() {
        // 子菜单点击事件分发
        const subMenuLinks = document.querySelectorAll('.sub-menu a');
        subMenuLinks.forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                this.handleMenuAction(link);
            });
        });
    }

    /**
     * 菜单操作处理
     */
    handleMenuAction(link) {
        const action = link.textContent.trim(); // 获取菜单项文字
        switch (action) {
            case "本地打开":
                const fileInput = document.getElementById('file-input');
                fileInput.click();
                break;
            case "保存到本地":
                const localXMLDoc = createXMLFile();
                saveXMLToFile(localXMLDoc);
                break;
            case "保存到云端":
                const cloudXMLDoc = createXMLFile();
                saveToCloud(cloudXMLDoc);
                break;
            case "新建文件":
                // 跳转到新建文件页面
                // 打开新标签页并加载 index.html
                window.open('index.html', '_blank');
                break;
            default:
                break;
        }
    }
}

