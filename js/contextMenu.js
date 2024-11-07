// contextMenu.js
class ContextMenu {
    constructor(map) {
        this.map = map;
        this.menu = document.getElementById("context-menu");
        this.currentItem = null;
    }

    show(event, item) {
        this.currentItem = item;
        this.initializeMenu(); // 动态生成菜单项
        const iconRect = item.marker._icon.getBoundingClientRect();
        const offsetX = 0;
        const offsetY = 0;
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
        this.map.removeLayer(this.marker);
    }
}
