// JammingContextMenu.js
import {ContextMenu} from "./contextMenu.js";
class JammingContextMenu extends ContextMenu {
    constructor(map) {
        super(map);
    }

    initializeMenu() {
        const menuList = this.menu.querySelector("ul");
        menuList.innerHTML = ""; // 清空菜单
        const deleteItem = document.createElement("li");
        deleteItem.textContent = "删除";
        deleteItem.onclick = () => {
            if (this.currentItem) {
                this.currentItem.delete();
                this.hide();
            }
        };
        menuList.appendChild(deleteItem);
    }
}
export {JammingContextMenu};