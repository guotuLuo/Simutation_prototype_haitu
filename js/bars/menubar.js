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
                this.triggerFileInput();
                break;
            case "保存到本地":
                const localXMLDoc = createXMLFile();
                saveXMLToFile(localXMLDoc);
                break;
            case "保存到云端":
                const cloudXMLDoc = createXMLFile();
                saveToCloud(cloudXMLDoc);
                break;
            default:
                break;
        }
    }

    /**
     * 触发文件输入框
     */
    triggerFileInput() {
        const fileInput = document.getElementById('file-input');
        fileInput.click();
    }
}

