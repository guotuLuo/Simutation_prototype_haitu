// Radar 类，用于管理飞机对象的创建、飞行和删除
class Radar {
    constructor(map, position, icon, contextMenu) {
        this.map = map;
        this.position = position;
        this.icon = icon;
        this.contextMenu = contextMenu;
        this.marker = this.createMarker();
        this.radarCenter = this.marker.getLatLng(); // 雷达中心的地理坐标
        this.scanRadius = 60000; // 扫描半径，单位为米
        this.detectedPoints = []; // 存储被检测到的飞机
        this.scanInterval = null; // 用于保存扫描的定时器
        this.Points = [];
        this.markerElement = []
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
    
        // 创建雷达组件容器
        const radarItem = document.createElement("div");
        radarItem.className = "radar-item";
        radarItem.id = this.id;
    
        // 创建雷达背景并设置唯一 id
        const radarBackground = document.createElement("div");
        radarBackground.className = "radar-background";
        radarBackground.id = `radar-background-${this.id}`; // 设置唯一 id
    
        // 创建扫描线
        const radarScanline = document.createElement("div");
        radarScanline.className = "radar-scanline";
    
        // 将扫描线和目标点添加到雷达背景
        radarBackground.appendChild(radarScanline);
    
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



        // const radarScanline = document.querySelector(".radar-scanline");
        // radarScanline.classList.add("scanning"); // 为扫描线添加动画类

        // 开始定时扫描
        this.scanInterval = setInterval(() => {
            this.detectedPoints = [];
            axios.get("http://127.0.0.1:8081/api/radars/scan")
            .then(response => {
                const data = response.data;
                // 处理接收到的数据
                this.Points = Object.entries(data).map(([key, airplaneData]) => {
                    return new Point(airplaneData.id, airplaneData.lat, airplaneData.lon);
                });
            })
            .catch(error => {
                console.error("请求失败:", error);
            });
            // 遍历所有飞机，捕获范围内的飞机
            this.Points.forEach(point => {
                const planePosition = point.getLatLng();
                const distance = this.map.distance(this.radarCenter, planePosition)// 计算距离

                if (distance <= this.scanRadius) {
                    // 如果在扫描范围内
                    this.detectedPoints.push(point);
                    this.addPlaneToRadar(point); // 显示在雷达表盘上
                }
            });
            console.log(`捕获到 ${this.detectedPoints.length} 架飞机`);
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
        this.detectedPoints.forEach(plane => plane.removeMarker());
        this.detectedPoints = [];
    }

    addPlaneToRadar(point) {
        const planePosition = point.getLatLng();
        const distance = this.map.distance(this.radarCenter, planePosition);
        const angle = this.calculateAngle(this.radarCenter, planePosition);
    
        // 转换距离到雷达表盘像素距离
        const radarRadiusInPixels = 150;
        const distanceRatio = distance / this.scanRadius;
        const displayDistance = distanceRatio * radarRadiusInPixels;
    
        // 计算飞机在雷达表盘上的位置
        const x = Math.cos(angle) * displayDistance + radarRadiusInPixels;
        const y = Math.sin(angle) * displayDistance + radarRadiusInPixels;
    
        // 创建飞机的显示标记
        const planeMarker = document.createElement("div");
        planeMarker.className = "plane-marker";
        planeMarker.style.left = `${x}px`;
        planeMarker.style.top = `${y}px`;
    
        // 将飞机标记添加到对应的雷达背景中
        const radarBackground = document.getElementById(`radar-background-${this.id}`);
        if (radarBackground) {
            radarBackground.appendChild(planeMarker);
        }else{
            console.log("查找失败");
        }
        
        // 保存标记，以便清除时使用
        this.markerElement.push(planeMarker);
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
        const url = `http://127.0.0.1:8081/api/radars/delete?uuid=${encodeURIComponent(this.id)}`;
        navigator.sendBeacon(url);
    }
}
