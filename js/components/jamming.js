// Jamming 类
import {ContextMenu} from "../contextMenus/contextMenu.js";
class Jamming {
    constructor(map, position, icon, contextMenu, itemType, className, name) {
        super();
        this.map = map;
        this.position = position;
        this.icon = icon;
        this.contextMenu = contextMenu;
        this.itemType = itemType;
        this.className = className;
        this.name = name;
        this.createMarker();

        // 经度维度海拔
        this.latitude = position.lat;
        this.longitude = position.lng;
        this.altitude = 0;

        // nBatch 不知道干啥的，先留在这
        this.batch = parseInt(this.name.substring(this.className.length));
        this.use = 3;
        this.track = [];
        const lat = position.lat.toFixed(5);
        const lng = position.lng.toFixed(5);
        this.track.push([lat, lng]);
        this.sys_proto_type = 'SYS_PROTO_JAM';
        this.outlineManager = window.app.outlineManager;

    }

    createMarker() {
        this.id = generateUUID();
        this.marker = L.marker(this.position, { icon: this.icon, draggable: true }).addTo(this.map);
        const latLng = this.marker.getLatLng();  // 获取当前经纬度
        const iconSize = this.icon.options.iconSize;

        this.marker.bindPopup("干扰: " + this.id).openPopup();
        this.marker.setPopupContent("干扰: " + this.id + "<br>经纬度: " + latLng.lat.toFixed(6) + ", " + latLng.lng.toFixed(6));
        // 监听拖动过程中的事件
        this.marker.on('drag', (event) => {
            const latLng = event.target.getLatLng();  // 获取当前经纬度
            this.marker.setPopupContent("干扰: " + this.id + "<br>经纬度: " + latLng.lat.toFixed(6) + ", " + latLng.lng.toFixed(6));
            this.marker.openPopup();  // 更新并重新打开弹出窗口
            this.outlineManager.showOutline(latLng, iconSize, this); // 调用虚线框管理器

        });

        this.marker.on('contextmenu', (event) => {
            event.originalEvent.preventDefault();
            const latLng = event.target.getLatLng();
            this.outlineManager.showOutline(latLng, iconSize, this); // 调用虚线框管理器
            this.contextMenu.show(event, this);
        });

        this.marker.on("click", (event) => {
            const latLng = event.target.getLatLng();
            this.outlineManager.showOutline(latLng, iconSize, this); // 调用虚线框管理器
        });

        // 地图缩放时更新虚线框
        this.map.on("zoomend", () => {
            const latLng = this.marker.getLatLng();
            this.outlineManager.updateOutline(latLng, iconSize);
        });

        // 点击地图空白处隐藏虚线框
        this.map.on("click", () => {
            this.outlineManager.hideOutline();
        });
    }

    delete() {
        this.map.removeLayer(this.marker);
        const jammingItem = document.getElementById(`${this.id}`);
        if (jammingItem) {
            jammingItem.remove();
        }

        window.app.componentManager.deleteInstance(this.itemType, this.className, this.name);
        window.app.componentManager.instanceNumber--;

        removeObjectFromList(this.itemType, this.className, this.name);
        // 相比于使用axios发送前端请求，使用sendBeacon可以保证发送的请求在关闭当前标签的时候仍然可以成功发送
        const url = `http://127.0.0.1:8081/api/jamming/delete?uuid=${encodeURIComponent(this.id)}`;
        navigator.sendBeacon(url);
    }

    getClassName(){
        return this.className;
    }
}
