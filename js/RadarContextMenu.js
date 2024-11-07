// radarContextMenu.js
class RadarContextMenu extends ContextMenu {
    constructor(map) {
        super(map);
    }

    initializeMenu() {
        const menuList = this.menu.querySelector("ul");
        menuList.innerHTML = ""; // 清空菜单

        const startScanItem = document.createElement("li");
        startScanItem.textContent = "扫描";
        startScanItem.onclick = () => {
            if (this.currentItem) {
                this.currentItem.startScan();
                this.hide();
            }
        };
        menuList.appendChild(startScanItem);




        const stopScanItem = document.createElement("li");
        stopScanItem.textContent = "停止扫描";
        stopScanItem.onclick = () =>{
            if(this.currentItem){
                this.currentItem.stopScan();
                this.hide();
            }
        }
        menuList.appendChild(stopScanItem);

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
