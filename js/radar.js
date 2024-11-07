// Radar 类，用于管理飞机对象的创建、飞行和删除
class Radar {
    constructor(map, position, icon, contextMenu) {
        this.map = map;
        this.position = position;
        this.icon = icon;
        this.contextMenu = contextMenu;
        this.marker = this.createMarker();
        this.radarCenter = this.marker.getLatLng; // 雷达中心的地理坐标
        this.scanRadius = 60000; // 扫描半径，单位为米
        this.detectedPlanes = []; // 存储被检测到的飞机
        this.scanInterval = null; // 用于保存扫描的定时器
    }

    createMarker() {
        this.id = generateUUID();
        const marker = L.marker(this.position, { icon: this.icon, draggable: true }).addTo(this.map);
        marker.bindPopup("雷达: " + this.id).openPopup();

        // 绑定右键菜单显示事件
        marker.on('contextmenu', (event) => {
            event.originalEvent.preventDefault();
            this.contextMenu.show(event, this);
        });


        // 生成 UUID

        // 创建雷达组件容器
        const radarItem = document.createElement("div");
        radarItem.className = "radar-item";
        radarItem.id = this.id;

        // 创建雷达背景
        const radarBackground = document.createElement("div");
        radarBackground.className = "radar-background";

        // 创建扫描线
        const radarScanline = document.createElement("div");
        radarScanline.className = "radar-scanline";

        // 创建目标点（示例位置，实际应用中可以根据需要动态定位）
        const target = document.createElement("div");
        target.className = "target";
        target.style.top = "30px"; // 可以根据需要调整位置
        target.style.left = "40px";

        // 将扫描线和目标点添加到雷达背景
        radarBackground.appendChild(radarScanline);
        radarBackground.appendChild(target);

        // 创建 UUID 显示区域
        const radarText = document.createElement("p");
        radarText.textContent = `雷达 UUID: ${this.id}`;

        // 将所有元素添加到雷达组件
        radarItem.appendChild(radarBackground);
        radarItem.appendChild(radarText);

        // 将雷达组件添加到右侧容器中
        document.getElementById("radar-container").appendChild(radarItem);


        return marker;
    }

    startScan() {
        console.log("开始雷达扫描");
        // 创建扫描线动画
        const radarScanline = document.querySelector(".radar-scanline");
        radarScanline.classList.add("scanning"); // 为扫描线添加动画类

        // 开始定时扫描
        this.scanInterval = setInterval(() => {
            // 清空上次扫描的结果
            this.detectedPlanes.forEach(plane => plane.removeMarker());
            this.detectedPlanes = [];

            // 遍历所有飞机，捕获范围内的飞机
            allAirplanes.forEach(airplane => {
                const planePosition = airplane.getLatLng();
                const distance = this.map.distance(this.radarCenter, planePosition); // 计算距离

                if (distance <= this.scanRadius) {
                    // 如果在扫描范围内
                    this.detectedPlanes.push(airplane);
                    this.addPlaneToRadar(airplane); // 显示在雷达表盘上
                }
            });

            console.log(`捕获到 ${this.detectedPlanes.length} 架飞机`);
        }, 1000); // 每秒扫描一次
    }

    // 停止扫描
    stopScan() {
        console.log("停止雷达扫描");
        clearInterval(this.scanInterval);

        // 移除扫描线动画
        const radarScanline = document.querySelector(".radar-scanline");
        radarScanline.classList.remove("scanning");

        // 清除雷达表盘上的飞机显示
        this.detectedPlanes.forEach(plane => plane.removeMarker());
        this.detectedPlanes = [];
    }

    // 将飞机添加到雷达表盘上
    addPlaneToRadar(airplane) {
        const planePosition = airplane.getLatLng();
        const distance = this.map.distance(this.radarCenter, planePosition);
        const angle = this.calculateAngle(this.radarCenter, planePosition);

        // 将地理距离转换为雷达表盘上的像素距离
        const radarRadiusInPixels = 150; // 假设雷达表盘的半径为150像素
        const distanceRatio = distance / this.scanRadius; // 距离比例
        const displayDistance = distanceRatio * radarRadiusInPixels;

        // 计算飞机在雷达表盘上的位置
        const x = Math.cos(angle) * displayDistance + radarRadiusInPixels;
        const y = Math.sin(angle) * displayDistance + radarRadiusInPixels;

        // 创建飞机的显示标记
        const planeMarker = document.createElement("div");
        planeMarker.classList.add("plane-marker");
        planeMarker.style.left = `${x}px`;
        planeMarker.style.top = `${y}px`;

        document.querySelector(".radar-container").appendChild(planeMarker);
        airplane.markerElement = planeMarker; // 保存标记，以便清除时使用
    }

    // 计算两个地理坐标之间的角度
    calculateAngle(center, point) {
        const dLon = point.lng - center.lng;
        const y = Math.sin(dLon) * Math.cos(point.lat);
        const x = Math.cos(center.lat) * Math.sin(point.lat) - Math.sin(center.lat) * Math.cos(point.lat) * Math.cos(dLon);
        return Math.atan2(y, x);
    }

    delete() {
        this.map.removeLayer(this.marker);
        const radarItem = document.getElementById(`${this.id}`);
        if (radarItem) {
            radarItem.remove();
        }
    }
}
