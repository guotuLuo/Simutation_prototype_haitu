class Radar extends BaseComponent{
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
        this.scanRadius = 30000; // 扫描半径，单位为米
        this.scanInterval = null; // 用于保存扫描的定时器
        this.Points = [];
        this.markerElement = [];
        this.radarBackground = null; // 添加 radarBackground 属性
        this.initializeRadarCenter();
        this.radarGeoCenter = this.marker.getLatLng(); // 雷达中心的地理坐标
        this.detectedPointsMap = new Map();  // 存储检测到的飞机
        this.buttonLabels = ["标准显示", "偏心显示", "空心显示", "延迟显示"];
        this.currentDisplayType = "标准显示"; // 全局变量跟踪当前显示状态
        this.radarPdata = {};
        // 初始化按钮
        this.scanAngle = 0;
        // this.initializeRadarControls(); // 页面加载完成后再初始化雷达
        this.hollowSemiLength = 0;
        this.scanning=false;
        this.displayType='standard';
        this.lines=[];

        // 经度维度海拔
        this.latitude = position.lat;
        this.longitude = position.lng;
        this.altitude = 0;

        // nBatch 不知道干啥的，先留在这
        this.batch = parseInt(this.name.substring(this.itemType.length));
        this.use = 1;
        this.track = [];
        const lat = position.lat.toFixed(5);
        const lng = position.lng.toFixed(5);
        this.track.push([lat, lng]);
    }

    initializeRadarCenter() {
        this.radarBackground = document.getElementById(`radar-background-${this.id}`);
        if (this.radarBackground) {
            // 假设 radarBackground 是一个固定大小的正方形容器
            const width = this.radarBackground.offsetWidth;
            const height = this.radarBackground.offsetHeight;
            console.log("radar background width is:", width);
            console.log("radar background height is:", height);
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
            this.radarBackground.appendChild(radarCenterMarker);

            // 初始化刻度环
            this.createRadarScale(this.radarBackground);
            this.createAngleLines(this.radarBackground);
        }
    }

    // initializeRadarControls() {
    //     if (this.radarBackground) {
    //         const buttonContainer = document.createElement("div");
    //         buttonContainer.classList.add("button-container");
    //         // 给按钮容器添加一个类名

    //         // 遍历按钮数组并创建按钮
    //         this.buttonLabels.forEach((label) => {
    //             const button = document.createElement("button");
    //             button.innerHTML = label; // 按钮显示的文本
    //             button.classList.add("radar-button"); // 给按钮添加样式类
    //             button.addEventListener('click', () => {
    //                 this.currentDisplayType = label; // 更新当前显示状态
    //                 this.updateRadarDisplay1(this.radarBackground, this.currentDisplayType); // 更新雷达显示
    //             });
    //             buttonContainer.appendChild(button); // 将按钮添加到容器中
    //         });

    //         this.radarBackground.appendChild(buttonContainer); // 将按钮容器添加到 radarBackground 中
    //     }
    // }

    updateRadarDisplay1(radarBackground, displayType) {
        const circles = radarBackground.querySelectorAll('.range-circle');
        const labels = radarBackground.querySelectorAll('.range-label');
    
        // 删除所有生成的圆形和标签
        circles.forEach(circle => circle.remove());
        labels.forEach(label => label.remove());

        switch (displayType) {
            case '标准显示':
                this.createRadarScale(radarBackground);
                //this.createAngleLines(radarBackground);
                break;
            case '偏心显示':
                this.transformRadarBackground(radarBackground, 'eccentric');
                break;
            case '空心显示':
                this.transformRadarBackground(radarBackground, 'hollow');
                break;
            case '延迟显示':
                this.transformRadarBackground(radarBackground, 'delayed');
                break;
            default:
                this.createRadarScale(radarBackground);
                //this.createAngleLines(radarBackground);
                break;
        }
    }
    clearRadarDisplay(radarBackground) {
        //radarBackground.innerHTML = ''; // 清除所有子元素
    }

    transformRadarBackground(radarBackground, type) {
        const radarRadiusInPixels = radarBackground.offsetWidth / 2;
    
        switch (type) {
            case 'eccentric':
                // const circles = radarBackground.querySelectorAll('.range-circle');
                // const labels = radarBackground.querySelectorAll('.range-label');
            
                // // 删除所有生成的圆形和标签
                // circles.forEach(circle => circle.remove());
                // labels.forEach(label => label.remove());
                // // 偏心显示：将扫描中心移动至非几何中心位置，并将显示信息扩大两倍
                // radarBackground.style.transform = `translate(-25%, -25%) scale(2)`;
                
                // // 更新雷达中心
                // this.radarCenter.x = (radarBackground.offsetWidth * 0.75) / 2;
                // this.radarCenter.y = (radarBackground.offsetHeight * 0.75) / 2;
    
                // // 重新绘制刻度和角度线
                // this.createRadarScale(radarBackground);
                // this.createAngleLines(radarBackground);
                // break;
            case 'hollow':

                // 空心显示：将回波显示距离向外围方向延伸50公里，量程减少50公里
                //radarBackground.style.transform = `scale(0.5)`;
                //radarBackground.scroll(0, 50); // 向外滚动50个单位
    
                // 重新绘制更小的刻度和角度线
                this.createRadarScale(radarBackground, 'hollow');
                //this.createAngleLines(radarBackground);
                break;
            case 'delayed':
                // 延迟显示：设置延迟距离，扫描中心设置为延迟距离
                //const delayDistance = 50; // 假设延迟距离为50个单位
                //radarBackground.scroll(0, -delayDistance); // 向内滚动延迟距离个单位
    
                // 重新绘制刻度和角度线（考虑延迟效果）
                //this.createRadarScale(radarBackground);
                //this.createAngleLines(radarBackground);
                break;
            default:
                // 默认显示逻辑
                break;
        }
    }
    

    createRadarScale(radarBackground, displayType) {
        if(displayType!=='hollow'){
            const radarRadiusInPixels = radarBackground.offsetWidth / 2;
            const numberOfCircles = 4;
            const stepDistance = this.scanRadius / numberOfCircles;
            for (let i = 0; i <= numberOfCircles; i++) {
                const circleDistance = i * stepDistance; // 正确计算每个圆的距离
                const circleRatio = circleDistance / this.scanRadius; // 每个圈的比例
                const circleRadius = circleRatio * radarRadiusInPixels; // 根据比例计算圆的半径
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
                rangeLabel.textContent = `${(circleDistance).toFixed(1)} m`;
                radarBackground.appendChild(rangeLabel);
            }
        }
        if(displayType==='hollow'){
            const radarRadiusInPixels = radarBackground.offsetWidth / 2;
            const numberOfCircles = 5;
            const stepDistance = this.scanRadius / numberOfCircles;
            const numberOfCirclesHollow=4;
            const stepDistanceHollow = this.scanRadius/numberOfCirclesHollow;
            for (let i = 0; i <= numberOfCircles; i++) {
                const circleDistance = i * stepDistance; // 正确计算每个圆的距离
                const circleDistanceHollow = (i-1) * stepDistanceHollow;
                const circleRatio = circleDistance / this.scanRadius; // 每个圈的比例
                const circleRatioHollow = circleDistanceHollow / this.scanRadius; // 每个圈的比例
                const circleRadius = circleRatio * radarRadiusInPixels; // 根据比例计算圆的半径
                const circleRadiusHollow = circleRatioHollow * radarRadiusInPixels; // 根据比例计算圆的半径
                const rangeCircle = document.createElement("div");
                rangeCircle.className = "range-circle";
                rangeCircle.style.width = `${circleRadius * 2}px`;
                rangeCircle.style.height = `${circleRadius * 2}px`;
                rangeCircle.style.left = "50%";
                rangeCircle.style.top = "50%";
                rangeCircle.style.transform = `translate(-50%, -50%) scale(${circleRatio})`;
                if(i===0){
                        // 将圆全部用白色填满
                rangeCircle.style.backgroundColor = "white";
                }
                radarBackground.appendChild(rangeCircle);
                if(i===0)
                {
                    continue
                }
                const rangeLabel = document.createElement("div");
                rangeLabel.className = "range-label";
                rangeLabel.style.left = `${50}%`;
                rangeLabel.style.top = `${50 - circleRatio * 50}%`;
                rangeLabel.style.transform = "translate(-50%, -50%)";
                if(i===1){
                    this.hollowSemiLength = circleDistanceHollow;
                }
                rangeLabel.textContent = `${(circleDistanceHollow).toFixed(1)} m`;
                radarBackground.appendChild(rangeLabel);
            }
        }
    }

    
    

    createAngleLines(radarBackground,displayType) {
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

                
                let angleRad = angle * (Math.PI / 180);  // 将角度转换为弧度
                
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

            if(displayType==='hollow'){
                
                const lineEndX = Math.cos(angleRad) * lineLength;
                const lineEndY = Math.sin(angleRad) * lineLength;
        
                // 计算 lineStart, lineCross 和 lineEnd 的坐标
                const lineStartX = Math.cos(angleRad) * lineStart;
                const lineStartY = Math.sin(angleRad) * lineStart;
                const lineCrossX = Math.cos(angleRad) * lineCross;
                const lineCrossY = Math.sin(angleRad) * lineCross;
        
                // 计算从 lineCross 到 lineEnd 的绘制部分
                const startX = lineCrossX;
                const startY = lineCrossY;
                const endX = lineEndX;
                const endY = lineEndY;
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
        this.marker = L.marker(this.position, { icon: this.icon, draggable: true }).addTo(this.map);
        const latLng = this.marker.getLatLng();
        this.marker.bindPopup("雷达: " + this.id + "<br>经纬度: " + latLng.lat.toFixed(6) + ", " + latLng.lng.toFixed(6) ).openPopup();

        // 监听拖动过程中的事件
        this.marker.on('drag', (event) => {
            const latLng = event.target.getLatLng();  // 获取当前经纬度
            this.marker.setPopupContent("雷达: " + this.id + "<br>经纬度: " + latLng.lat.toFixed(6) + ", " + latLng.lng.toFixed(6));
            this.marker.openPopup();  // 更新并重新打开弹出窗口
        });

        // 绑定右键菜单显示事件
        this.marker.on('contextmenu', (event) => {
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
        radarText.textContent = `雷达 UUID: ${this.id.replace(/-/g, '').substring(0, 18)}`;

        // 创建按钮数组
        var buttonLabels = ["标准显示", "空心显示", "切换线段显示"]; // 新的按钮文本内容，加入切换线段显示
        var currentDisplayType = "标准显示"; // 全局变量跟踪当前显示状态
        var displayTypes = ['standard', 'hollow'];
        var radarContainer = document.getElementById("radar-container");

        // 创建一个容器来放置这些按钮
        var buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container"); // 给按钮容器添加一个类名

        buttonLabels.forEach((label) => {
            var button = document.createElement("button");
            button.innerHTML = label; // 按钮显示的文本
            button.classList.add("radar-button"); // 给按钮添加样式类
            this.displayType = displayTypes[buttonLabels.indexOf(currentDisplayType)];

            // 为每个按钮绑定事件
            button.addEventListener('click', (event) => {
                if (label === "切换线段显示") {
                    this.toggleLines(); // 当点击“切换线段显示”按钮时，切换线段显示状态
                } else {
                    currentDisplayType = label; // 更新当前显示状态
                    this.stopScan();
                    console.log("currentDisplayType is:", currentDisplayType);
                    this.updateRadarDisplay1(radarBackground, currentDisplayType); // 更新雷达显示
                    this.redrawPlaneMarkers();
                    if (this.scanning === true) {
                        this.startScan();
                    }
                }
            });

            buttonContainer.appendChild(button); // 将按钮添加到容器中
        });

        // 将按钮容器添加到页面中
        radarContainer.appendChild(buttonContainer);

        

        // 将按钮容器添加到 radar-container 中
        // 将所有元素添加到雷达组件
        radarItem.appendChild(radarBackground);
        radarItem.appendChild(radarText);
        radarItem.appendChild(buttonContainer);

        // 将雷达组件添加到右侧容器中
        document.getElementById("radar-container").appendChild(radarItem);
    }

    redrawPlaneMarkers() {
        // 删除雷达上所有点迹
        this.removeAllPlaneMarkers();
        this.detectedPointsMap.forEach(point => {
            this.addPlaneToRadar(point);
        });
    }
    startScan() {

        console.log("开始雷达扫描");

        // 初始化状态
        this.detectedPointsMap = new Map();
        
        this.scanStep = 0.2; // 扫描步长
        const scanIntervalMs = 20; // 扫描间隔（毫秒）
        const maxRetries = 5; // 最大重试次数
        let retryCount = 0; // 当前重试次数
        let stopRequested = false; // 标志位，避免重复停止扫描

        // 定时扫描
        this.scanInterval = setInterval(() => {
            if (stopRequested) {
                // 如果已经请求停止扫描，清除定时器并退出
                console.log("扫描已停止，取消定时器");
                clearInterval(this.scanInterval);
                return; // 退出当前执行
            }

            // 更新扫描线的当前角度
            this.scanAngle = (this.scanAngle + this.scanStep) % 360;
            const scanline = document.querySelector(`#radar-scanline-${this.id}`);
            scanline.style.transform = `rotate(${this.scanAngle}deg)`;
            
            // 获取新的数据并处理
            axios.get("http://127.0.0.1:8081/api/radars/scan")
                .then(response => {
                    retryCount = 0; // 重试次数归零，成功时重置
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
                            // this.radarPdata[planeId].push(airplaneData.lat,airplaneData.lon);
                        }
                    });

                    // 更新雷达显示
                    this.updateRadarDisplay(Array.from(this.detectedPointsMap.values()));
                })
                .catch(error => {
                    console.error("请求失败:", error);

                    // 网络请求失败时增加重试次数
                    if (retryCount < maxRetries) {
                        retryCount++;
                        console.log(`网络请求失败，正在重试 ${retryCount}/${maxRetries} 次...`);
                    } else {
                        console.log("最大重试次数已达到，停止扫描");
                        stopRequested = true; // 设置停止扫描的标志
                        this.stopScan(); // 超过最大重试次数才停止扫描
                    }
                });
        }, scanIntervalMs);
    }
    stopScan() {
        console.log("停止雷达扫描");

        // 清除定时扫描的 setInterval
        if (this.scanInterval) {
            console.log("调用停止雷达扫描函数");
            clearInterval(this.scanInterval);
            this.scanInterval = null;
        }

        // 删除雷达上所有点迹
        this.removeAllPlaneMarkers();

        // 清空 detectedPointsMap
        this.detectedPointsMap.clear();

        console.log("所有点迹已清除，扫描停止");
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
    

    addPlaneToRadar(point) {
        const planePosition = point.getLatLng();
        const distance = this.map.distance(this.radarGeoCenter, planePosition);
        const angle = this.calculateAngle(this.radarGeoCenter, planePosition);
        
        if(this.displayType==='hollow'){
        // 转换距离到雷达表盘像素距离
        
        const radarRadiusInPixels = this.radarCenter.x-this.hollowSemiLength; // 假设雷达半径是中心 x 坐标的距离
        const distanceRatio = Math.min((distance- this.hollowSemiLength) / this.scanRadius, 1);
        const displayDistance = distanceRatio * radarRadiusInPixels;
    
        // 计算飞机在雷达表盘上的位置
        const x = Math.cos(angle) * (displayDistance+this.hollowSemiLength) + this.radarCenter.x;
        const y = Math.sin(angle) * (displayDistance+this.hollowSemiLength) + this.radarCenter.y;
        
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
        else if(this.displayType==='standard'){
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
        else{}
        // 更新线段集合并绘制线段
        this.updateLines();
    }



    // 显示所有线段
    showLines() {
        this.lines.forEach(line => {
            line.style.display = 'block';  // 显示线段
        });
    }

    // 隐藏所有线段
    hideLines() {
        this.lines.forEach(line => {
            line.style.display = 'none';  // 隐藏线段
        });
    }

    // 切换显示状态
    toggleLines() {
        this.lines.forEach(line => {
            // 如果线段目前显示，则隐藏；如果隐藏，则显示
            line.style.display = (line.style.display === 'none' || line.style.display === '') ? 'block' : 'none';
        });
    }
    updateLines() {
        // 清除现有的线段
        // this.lines.forEach(line => line.remove());
        // this.lines = [];

        // 绘制新的线段
        let i = this.markerElement.length - 1 ;
        if(i>=1){
        const startMarker = this.markerElement[i-1];
        const endMarker = this.markerElement[i];

        const startX = parseFloat(startMarker.style.left);
        const startY = parseFloat(startMarker.style.top);
        const endX = parseFloat(endMarker.style.left);
        const endY = parseFloat(endMarker.style.top);

        const line = this.createLine(startX, startY, endX, endY);
        const radarBackground = document.getElementById(`radar-background-${this.id}`);
        if (radarBackground) {
            radarBackground.appendChild(line);
        }
        this.lines.push(line);}
    }
    

    createLine(x1, y1, x2, y2) {
        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

        const line = document.createElement("div");
        line.className = "line";
        line.style.position = "absolute";
        line.style.transformOrigin = "0 0";
        line.style.width = `${length}px`;
        line.style.height = "1px";
        line.style.backgroundColor = "white";
        line.style.left = `${x1}px`;
        line.style.top = `${y1}px`;
        line.style.transform = `rotate(${angle}deg)`;

        return line;
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


    // 删除雷达的同时需要关闭雷达的一切活动，包括scan之类的
    delete() {
        this.stopScan();
        this.map.removeLayer(this.marker);
        const radarItem = document.getElementById(`${this.id}`);
        if (radarItem) {
            radarItem.remove();
        }
        componentManager.deleteInstance(this.itemType, this.className, this.name);
        removeObjectFromList(this.itemType, this.className, this.name);
        // 相比于使用axios发送前端请求，使用sendBeacon可以保证发送的请求在关闭当前标签的时候仍然可以成功发送
        const url = `http://127.0.0.1:8081/api/radars/delete?uuid=${encodeURIComponent(this.id)}`;
        navigator.sendBeacon(url);
    }

    getClassName(){
        return this.className;
    }

}
