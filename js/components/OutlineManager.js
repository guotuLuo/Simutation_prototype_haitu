class OutlineManager {
    constructor(map) {
        this.map = map; // 地图实例
        this.currentOutline = null; // 当前虚线框实例
        this.currentTarget = null; // 当前选中的目标对象（如飞机实例）
    }

    // 创建虚线框
    createOutline(latLng, iconSize) {
        const pixelToLatLng = this.getPixelToLatLng();
        const halfWidth = iconSize[0] * pixelToLatLng / 2;
        const halfHeight = iconSize[1] * pixelToLatLng / 2;

        const bounds = [
            [latLng.lat - halfHeight, latLng.lng - halfWidth], // 左下角
            [latLng.lat + halfHeight, latLng.lng + halfWidth]  // 右上角
        ];

        return L.rectangle(bounds, {
            color: "blue",
            dashArray: "5, 5", // 虚线样式
            weight: 2,
            fillOpacity: 0
        });
    }

    // 动态计算像素与经纬度的比例
    getPixelToLatLng() {
        const zoom = this.map.getZoom();
        const scale = this.map.options.crs.scale(zoom);
        const mapBounds = this.map.getBounds();
        const latDiff = mapBounds.getNorth() - mapBounds.getSouth();
        const pixelHeight = this.map.getSize().y;
        return latDiff / pixelHeight;
    }

    // 显示虚线框
    showOutline(latLng, iconSize, target) {
        // 如果当前已有虚线框，且选中的目标不是当前目标，移除虚线框
        if (this.currentOutline && this.currentTarget !== target) {
            this.hideOutline();
        }

        // 创建新的虚线框并显示
        this.currentOutline = this.createOutline(latLng, iconSize).addTo(this.map);
        this.currentTarget = target; // 记录当前选中的目标
    }

    // 隐藏虚线框
    hideOutline() {
        if (this.currentOutline) {
            this.currentOutline.remove();
            this.currentOutline = null;
            this.currentTarget = null;
        }
    }

    // 地图缩放时重新调整虚线框大小
    updateOutline(latLng, iconSize) {
        if (this.currentOutline) {
            this.currentOutline.setBounds(this.createOutline(latLng, iconSize).getBounds());
        }
    }
}
