// Radar 类，用于管理飞机对象的创建、飞行和删除
class Radar {
    constructor(map, position, icon, contextMenu) {
        this.map = map;
        this.position = position;
        this.icon = icon;
        this.contextMenu = contextMenu;
        this.marker = this.createMarker();
        this.scanRadius = 30000; // 扫描半径，单位为米
        this.scanInterval = null; // 用于保存扫描的定时器
        this.Points = [];
        this.markerElement = [];
        this.initializeRadarCenter();
        this.radarGeoCenter = this.marker.getLatLng(); // 雷达中心的地理坐标
        this.detectedPointsMap = new Map();  // 存储检测到的飞机
    }


    initializeRadarCenter() {
        const radarBackground = document.getElementById(`radar-background-${this.id}`);
        if (radarBackground) {
            // 假设 radarBackground 是一个固定大小的正方形容器
            const width = radarBackground.offsetWidth;
            const height = radarBackground.offsetHeight;
            console.log("radarbackground width is:", width);
            console.log("radarbackground height is:", height);
            this.radarCenter = {
                x: width / 2,
                y: height / 2
            };
    
            // 添加中心标记用于调试
            const radarCenterMarker = document.createElement("div");
            radarCenterMarker.className = "center-marker";
            radarCenterMarker.style.position = "absolute";
            radarCenterMarker.style.width = "4px";
            radarCenterMarker.style.height = "4px";
            radarCenterMarker.style.backgroundColor = "blue";
            radarCenterMarker.style.borderRadius = "50%";
            
            // 使用相对位置设置中心标记
            radarCenterMarker.style.left = "50%";
            radarCenterMarker.style.top = "50%";
            radarCenterMarker.style.transform = "translate(-50%, -50%)"; // 使标记居中于中心
            // 初始化刻度环
            this.createRadarScale(radarBackground);
            this.createAngleLines(radarBackground);

            radarBackground.appendChild(radarCenterMarker);
        } else {
            console.error("雷达背景元素未找到，无法初始化中心坐标");
        }
    }

    createRadarScale(radarBackground) {
        const radarRadiusInPixels = radarBackground.offsetWidth / 2;
        const numberOfCircles = 4;
        const stepDistance = this.scanRadius / numberOfCircles;

        for (let i = 1; i <= numberOfCircles; i++) {
            const circleDistance = i * stepDistance;
            const circleRatio = circleDistance / this.scanRadius;
            const circleRadius = circleRatio * radarRadiusInPixels;

            const rangeCircle = document.createElement("div");
            rangeCircle.className = "range-circle";
            rangeCircle.style.width = `${circleRadius * 2}px`;
            rangeCircle.style.height = `${circleRadius * 2}px`;
            rangeCircle.style.left = "50%";
            rangeCircle.style.top = "50%";
            rangeCircle.style.transform = `translate(-50%, -50%) scale(${circleRatio})`;
            radarBackground.appendChild(rangeCircle);

            const rangeLabel = document.createElement("div");
            rangeLabel.className = "range-label";
            rangeLabel.style.left = `${50}%`;
            rangeLabel.style.top = `${50 - circleRatio * 50}%`;
            rangeLabel.style.transform = "translate(-50%, -50%)";
            rangeLabel.textContent = `${(circleDistance / 1000).toFixed(1)} km`;
            radarBackground.appendChild(rangeLabel);
        }
    }

    createAngleLines(radarBackground) {
        const radarRadiusInPixels = radarBackground.offsetWidth / 2;
        const majorLineLength = radarRadiusInPixels;        // 大刻度线长度，为雷达半径
        const middleLineLength = 10;                       // 中角度线长度，固定为10像素
        const minorLineLength = 5;                         // 小角度线长度，固定为5像素
    
        for (let angle = 0; angle < 360; angle++) {
            const angleLine = document.createElement("div");
    
            if (angle % 45 === 0) {
                // 大刻度线，每 45 度一条
                angleLine.className = "angle-line-major";
                angleLine.style.height = `${majorLineLength}px`; // 大刻度线长度
                angleLine.style.transformOrigin = `50% 0%`;      // 从圆周边缘向内延伸
            } else if (angle % 5 === 0) {
                // 中角度线，每 5 度一条
                angleLine.className = "angle-line-middle";
                angleLine.style.height = `${middleLineLength}px`; // 中角度线长度
                angleLine.style.transformOrigin = `50% 0%`;       // 从圆周边缘向内延伸
            } else {
                // 小角度线，每 1 度一条
                angleLine.className = "angle-line-minor";
                angleLine.style.height = `${minorLineLength}px`; // 小角度线长度
                angleLine.style.transformOrigin = `50% 0%`;      // 从圆周边缘向内延伸
            }
    
            // 设置公共样式
            angleLine.style.position = "absolute";
            angleLine.style.width = angle % 45 === 0 ? "1px" : "0.5px"; // 大刻度线更粗
            angleLine.style.left = "50%";
            angleLine.style.top = "50%";
    
            // 旋转角度，以使刻度线正确分布
            angleLine.style.transform = `rotate(${angle}deg) translate(0, -${radarRadiusInPixels}px)`;
    
            // 添加到雷达背景
            radarBackground.appendChild(angleLine);
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
        radarScanline.id = `radar-scanline-${this.id}`;
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
    
        // 初始化状态
        this.detectedPointsMap = new Map();
        this.scanAngle = 0;
        this.scanStep = 0.2; // 扫描步长
        const scanIntervalMs = 20; // 扫描间隔（毫秒）
    
        // 定时扫描
        this.scanInterval = setInterval(() => {
            // 更新扫描线的当前角度
            this.scanAngle = (this.scanAngle + this.scanStep) % 360;
                // 先通过 ID 获取雷达背景元素
            const scanline = document.querySelector(`#radar-scanline-${this.id}`);
            scanline.style.transform = `rotate(${this.scanAngle}deg)`;
        
            // 获取新的数据并处理
            axios.get("http://127.0.0.1:8081/api/radars/scan")
                .then(response => {
                    const data = response.data.data;

                    // 处理接收到的点并更新 `detectedPointsMap`
                    Object.entries(data).forEach(([key, airplaneData]) => {
                        const planeId = airplaneData.id;
                        const point = new Point(planeId, airplaneData.lat, airplaneData.lon);

                        // 检查点是否在扫描范围内
                        const planePosition = point.getLatLng();
                        const distance = this.map.distance(this.radarGeoCenter, planePosition);
                        const angle = this.calculateAngle(this.radarGeoCenter, planePosition) * (180 / Math.PI); // 转换为度
                        const angleDifference = (this.scanAngle - angle + 360) % 360;

                        // 扇形区域内的点
                        if (angleDifference <= 90 && distance <= this.scanRadius) {
                            this.detectedPointsMap.set(planeId, point); // 更新或添加点
                        }
                    });

                    // 更新雷达显示
                    this.updateRadarDisplay(Array.from(this.detectedPointsMap.values()));
                })
                .catch(error => {
                    console.error("请求失败:", error);
                });
        }, scanIntervalMs);
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

        // 确保雷达表盘显示的飞机位置跟地图观感上一致
        const angle = Math.atan2(y, x) - Math.PI / 2 ;
    
        // 确保角度在 0 到 2π 之间
        return (angle + 2 * Math.PI) % (2 * Math.PI);
    }
    

    delete() {
        this.map.removeLayer(this.marker);
        const radarItem = document.getElementById(`${this.id}`);
        if (radarItem) {
            radarItem.remove();
        }
        // 相比于使用axios发送前端请求，使用sendBeacon可以保证发送的请求在关闭当前标签的时候仍然可以成功发送
        const url = `http://127.0.0.1:8081/api/radars/delete?uuid=${encodeURIComponent(this.id)}`;
        navigator.sendBeacon(url);
    }
}
