// contextMenu.js
class ContextMenu {
    constructor(map) {
        this.map = map;
        this.menu = document.getElementById("context-menu");
        this.currentItem = null;
        // 监听全局点击事件
        document.addEventListener("click", (event) => {
            if (this.menu.style.display === "block" && !this.menu.contains(event.target)) {
                // 如果菜单是显示状态，且点击在菜单外部，则隐藏菜单
                this.hide();
            }
        });
    }

    show(event, item) {
        this.currentItem = item;
        this.initializeMenu(); // 动态生成菜单项
        const iconRect = item.marker._icon.getBoundingClientRect();
        const offsetX = 0;
        const offsetY = -120;
        this.menu.style.left = (iconRect.right + window.scrollX + offsetX) + "px";
        this.menu.style.top = (iconRect.bottom + window.scrollY + offsetY) + "px";
        this.menu.style.display = "block";
    }

    hide() {
        this.menu.style.display = "none";
        this.currentItem = null;
    }

    // 抽象方法，子类实现不同的菜单内容
    initializeMenu() {
        throw new Error("initializeMenu() must be implemented by subclass");
    }

    delete() {
        // TODO 这里去除了this.marker 不知道有啥影响
        // this.map.removeLayer(this.marker);
        this.map.removeLayer();
    }
}
