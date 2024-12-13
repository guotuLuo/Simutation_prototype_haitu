// ReconnaissanceContextMenu.js
class ReconnaissanceContextMenu extends ContextMenu {
    constructor(map) {
        super(map);
    }

    initializeMenu() {
        // 待修改得固定飞行路线
        // const routeCoordinates = [[25, 118], [25, 119], [25, 120], [25, 121], [25, 122], [25, 123]];

        const menuList = this.menu.querySelector("ul");
        menuList.innerHTML = ""; // 清空菜单


        const setRoutesItem = document.createElement("li");
        setRoutesItem.textContent = "设置点迹";
        setRoutesItem.onclick = () => {
            if (this.currentItem) {
                this.currentItem.setFlightRoute();
                this.hide();
            }
        };
        menuList.appendChild(setRoutesItem);


        const startFlightItem = document.createElement("li");
        startFlightItem.textContent = "飞行";
        startFlightItem.onclick = () => {
            if (this.currentItem) {
                this.currentItem.startFlight();
                this.hide();
            }
        };
        menuList.appendChild(startFlightItem);

        const setSpeedItem = document.createElement("li");
        setSpeedItem.textContent = "设置速度";
        setSpeedItem.onclick = () => {
            if (this.currentItem) {
                this.currentItem.setItemSpeed();
                this.hide();
            }
        };
        menuList.appendChild(setSpeedItem);

        const deleteItem = document.createElement("li");
        deleteItem.textContent = "删除";
        deleteItem.onclick = () => {
            if (this.currentItem) {
                this.currentItem.delete();
                this.hide();
            }
        };
        menuList.appendChild(deleteItem);

        const changeNameItem = document.createElement("li");
        changeNameItem.textContent = "修改名称";
        changeNameItem.onclick = () => {
            if (this.currentItem) {
                this.currentItem.changeName();
                this.hide();
            }
        };
        menuList.appendChild(changeNameItem);

        const stopFlightItem = document.createElement("li");
        stopFlightItem.textContent = "停止飞行";
        stopFlightItem.onclick = () => {
            if (this.currentItem) {
                this.currentItem.stopFlight();
                this.hide();
            }
        };
        menuList.appendChild(stopFlightItem);

        const deleteRouteItem = document.createElement("li");
        deleteRouteItem.textContent = "删除点迹";
        deleteRouteItem.onclick = () => {
            if (this.currentItem) {
                this.currentItem.deleteRoute();
                this.hide();
            }
        };
        menuList.appendChild(deleteRouteItem);
    }
}
