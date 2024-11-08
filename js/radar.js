// Radar 类，用于管理飞机对象的创建、飞行和删除
class Radar {
    constructor(map, position, icon, contextMenu) {
        this.map = map;
        this.position = position;
        this.icon = icon;
        this.contextMenu = contextMenu;
        this.marker = this.createMarker();
        this.scanRadius = 60000; // 扫描半径，单位为米
        this.detectedPoints = []; // 存储被检测到的飞机
        this.scanInterval = null; // 用于保存扫描的定时器
        this.Points = [];
        this.markerElement = [];
        this.initializeRadarCenter();
        this.radarGeoCenter = this.marker.getLatLng(); // 雷达中心的地理坐标

    }


    initializeRadarCenter() {
        const radarBackground = document.getElementById(`radar-background-${this.id}`);
        if (radarBackground) {
            const rect = radarBackground.getBoundingClientRect();
            this.radarCenter = {
                x: rect.width / 2,
                y: rect.height / 2
            };
    
            // 添加中心标记用于调试
            const radarCenterMarker = document.createElement("div");
            radarCenterMarker.className = "center-marker";
            radarCenterMarker.style.position = "absolute";
            radarCenterMarker.style.width = "4px";
            radarCenterMarker.style.height = "4px";
            radarCenterMarker.style.backgroundColor = "blue";
            radarCenterMarker.style.borderRadius = "50%";
            radarCenterMarker.style.left = `${this.radarCenter.x - 2}px`;
            radarCenterMarker.style.top = `${this.radarCenter.y - 2}px`;
    
            radarBackground.appendChild(radarCenterMarker);
        } else {
            console.error("雷达背景元素未找到，无法初始化中心坐标");
        }
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
    
        // 存储当前检测到的所有点，以 `id` 为键
        this.detectedPointsMap = new Map();
    
        this.scanInterval = setInterval(() => {
            axios.get("http://127.0.0.1:8081/api/radars/scan")
                .then(response => {
                    const data = response.data;
                
                    // 处理接收到的数据，更新 Points 和 detectedPointsMap
                    const currentPoints = Object.entries(data).map(([key, airplaneData]) => {
                        let point;
                        if (this.detectedPointsMap.has(airplaneData.id)) {
                            // 如果该点已存在，则更新其坐标和 lastSeen
                            point = this.detectedPointsMap.get(airplaneData.id);
                            point.lat = parseFloat(airplaneData.lat);
                            point.lng = parseFloat(airplaneData.lon);
                            point.updateTimestamp();
                        } else {
                            // 新的点，添加到 detectedPointsMap
                            point = new Point(airplaneData.id, airplaneData.lat, airplaneData.lon);
                            this.detectedPointsMap.set(airplaneData.id, point);
                        }
                        return point;
                    });
    
                    // 检查和更新雷达上的显示
                    this.updateRadarDisplay(currentPoints);
    
                    // 删除 5 秒内未更新的点
                    const now = Date.now();
                    for (let [id, point] of this.detectedPointsMap) {
                        if (now - point.lastSeen > 5000) {
                            // 超过 5 秒未更新，从 radar 和 detectedPointsMap 中删除
                            this.removePointFromRadar(point);
                            this.detectedPointsMap.delete(id);
                        }
                    }
    
                    console.log(`当前捕获到 ${currentPoints.length} 架飞机`);
                })
                .catch(error => {
                    console.error("请求失败:", error);
                });
        }, 500); // 每秒扫描一次
    }
    

    updateRadarDisplay(points) {
        points.forEach(point => {
            const planePosition = point.getLatLng();
            const distance = this.map.distance(this.radarGeoCenter, planePosition);
    
            if (distance <= this.scanRadius) {
                // 在雷达显示上更新或添加该点
                this.addPlaneToRadar(point);
            }
        });
    }
    
    // 删除雷达上的指定点迹
    removePointFromRadar(point) {
        // 找到雷达界面上对应的点元素，并将其移除
        const planeMarker = document.getElementById(`plane-marker-${point.id}`);
        if (planeMarker) {
            planeMarker.remove();
        }
        console.log(`已删除飞机 ${point.id} 的点迹`);
    }
    


    stopScan() {
        console.log("停止雷达扫描");
    
        // 清除定时扫描的 setInterval
        if (this.scanInterval) {
            clearInterval(this.scanInterval);
            this.scanInterval = null;
        }
    
        // 删除雷达上所有点迹
        this.removeAllPlaneMarkers();
    
        // 清空 detectedPointsMap
        this.detectedPointsMap.clear();
    
        console.log("所有点迹已清除，扫描停止");
    }
    

    addPlaneToRadar(point) {
        const planePosition = point.getLatLng();
        const distance = this.map.distance(this.radarGeoCenter, planePosition);
        const angle = this.calculateAngle(this.radarGeoCenter, planePosition);
    
        // 转换距离到雷达表盘像素距离
        const radarRadiusInPixels = this.radarCenter.x; // 假设雷达半径是中心 x 坐标的距离
        const distanceRatio = Math.min(distance / this.scanRadius, 1);
        const displayDistance = distanceRatio * radarRadiusInPixels;
    
        // 计算飞机在雷达表盘上的位置
        const x = Math.cos(angle) * displayDistance + this.radarCenter.x;
        const y = Math.sin(angle) * displayDistance + this.radarCenter.y;
    
        // 创建飞机的显示标记
        const planeMarker = document.createElement("div");
        planeMarker.className = "plane-marker";
        planeMarker.style.left = `${x}px`;
        planeMarker.style.top = `${y}px`;
    
        // 将飞机标记添加到对应的雷达背景中
        const radarBackground = document.getElementById(`radar-background-${this.id}`);
        if (radarBackground) {
            radarBackground.appendChild(planeMarker);
        }
        this.markerElement.push(planeMarker);
    }
    

    removeAllPlaneMarkers() {
        this.markerElement.forEach(marker => {
            if (marker && marker.parentNode) {
                marker.parentNode.removeChild(marker); // 从 DOM 中移除标记
            }
        });
        this.markerElement = []; // 清空数组
        console.log("所有雷达点迹已删除");
    }
    
    

    // 计算两个地理坐标之间的角度
    calculateAngle(center, point) {
        const dLon = (point.lng - center.lng) * Math.PI / 180; // 转换为弧度
        const lat1 = center.lat * Math.PI / 180;
        const lat2 = point.lat * Math.PI / 180;
        const y = Math.sin(dLon) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
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
