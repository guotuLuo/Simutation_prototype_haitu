// Jamming 类
class Jamming {
    constructor(map, position, icon, contextMenu, className, name) {
        this.map = map;
        this.position = position;
        this.icon = icon;
        this.contextMenu = contextMenu;
        this.name = name;
        this.className = className;
        this.createMarker();
    }

    createMarker() {
        this.id = generateUUID();
        this.marker = L.marker(this.position, { icon: this.icon, draggable: true }).addTo(this.map);
        const latLng = this.marker.getLatLng();  // 获取当前经纬度
        this.marker.bindPopup("干扰: " + this.id).openPopup();
        this.marker.setPopupContent("干扰: " + this.id + "<br>经纬度: " + latLng.lat.toFixed(6) + ", " + latLng.lng.toFixed(6));
        // 监听拖动过程中的事件
        this.marker.on('drag', (event) => {
            const latLng = event.target.getLatLng();  // 获取当前经纬度
            this.marker.setPopupContent("干扰: " + this.id + "<br>经纬度: " + latLng.lat.toFixed(6) + ", " + latLng.lng.toFixed(6));
            this.marker.openPopup();  // 更新并重新打开弹出窗口
        });

        // 绑定右键菜单显示事件
        this.marker.on('contextmenu', (event) => {
            event.originalEvent.preventDefault();
            this.contextMenu.show(event, this);
        });
    }

    delete() {
        this.map.removeLayer(this.marker);
        const jammingItem = document.getElementById(`${this.id}`);
        if (jammingItem) {
            jammingItem.remove();
        }
        // 相比于使用axios发送前端请求，使用sendBeacon可以保证发送的请求在关闭当前标签的时候仍然可以成功发送
        const url = `http://127.0.0.1:8081/api/jamming/delete?uuid=${encodeURIComponent(this.id)}`;
        navigator.sendBeacon(url);
    }
}
