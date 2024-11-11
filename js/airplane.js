// Airplane 类，用于管理飞机对象的创建、飞行和删除
class Airplane {
    constructor(map, position, icon, contextMenu) {
        this.map = map;
        this.position = position;
        this.icon = icon;
        this.contextMenu = contextMenu;
        this.marker = this.createMarker();
        this.routes = [];
        this.routeMarkers = [];
        this.speed = 1500;
        this.moving = false;
        this.startSendingCoordinates();
    }

    createMarker() {
        this.id = generateUUID();
        const marker = L.marker(this.position, { icon: this.icon, draggable: true }).addTo(this.map);
        marker.bindPopup("飞机: " + this.id).openPopup();
        // 绑定右键菜单显示事件
        marker.on('contextmenu', (event) => {
            event.originalEvent.preventDefault();
            this.contextMenu.show(event, this);
        });

        return marker;
    }

    setFlightRoute() {
        this.routes = []; // 初始化路径数组
        console.log("请设置当前点迹");
    
        // 添加当前 marker 的位置到路径中
        const initialPosition = this.marker.getLatLng();
        
        this.routes.push([initialPosition.lat, initialPosition.lng]);
    
        // 添加初始位置的红色标记
        this.addRoutesMarker(initialPosition, "red");
    
        // 左键点击事件 - 添加点击的点到路线中
        const addRoutePoint = (event) => {
            if (!event.latlng) {
                console.error("点击事件未返回有效的经纬度。请确保地图已经初始化。");
                return;
            }
            
            const latLng = event.latlng; // 获取点击位置的经纬度
            this.routes.push([latLng.lat, latLng.lng]); // 添加到路径数组中
            this.addRoutesMarker(latLng, "red"); // 标记点击位置为红色
            console.log(`添加点迹: ${latLng.lat}, ${latLng.lng}`);
        };
    
        // 右键点击事件 - 结束路径设置
        const endRouteSetting = (event) => {
            console.log("结束点迹设置");
            // 移除事件监听器
            this.map.off("click", addRoutePoint);
            this.map.off("contextmenu", endRouteSetting);
        };
    
        // 在地图上监听左键点击事件
        this.map.on("click", addRoutePoint);
    
        // 在地图上监听右键点击事件
        this.map.on("contextmenu", endRouteSetting);
    }
    
    // 添加标记点的辅助函数
    addRoutesMarker(latLng, color) {
        if (!latLng || isNaN(latLng.lat) || isNaN(latLng.lng)) {
            console.error("无效的 LatLng 对象，无法添加标记。");
            return;
        }

        const marker = L.circleMarker(latLng, {
            color: color,
            radius: 5
        }).addTo(this.map);

        this.routeMarkers.push(marker); // 将标记添加到 routeMarkers 数组中
    }

    // 开始按速度移动
    startFlight() {
        if (this.routes.length < 2) {
            console.log("路径点不足，无法移动");
            return;
        }
        console.log("开始飞行");
        this.moving = true;
        this.currentRouteIndex = 0;
        this.moveToNextPoint();
    }

    // 移动到下一个目标点
    moveToNextPoint() {
        if (this.currentRouteIndex >= this.routes.length - 1) {
            console.log("到达终点");
            this.moving = false;
            return;
        }

        const startPoint = this.marker.getLatLng();
        const endPoint = L.latLng(this.routes[this.currentRouteIndex + 1]);
        const distance = this.map.distance(startPoint, endPoint); // 计算距离
        const duration = (distance / this.speed) * 1000; // 计算到达下一个点所需时间（毫秒）
        
        const steps = Math.ceil(duration / 50); // 将移动分成多步，每步50ms
        const deltaLat = (endPoint.lat - startPoint.lat) / steps;
        const deltaLng = (endPoint.lng - startPoint.lng) / steps;
        
        let currentStep = 0;

        const moveInterval = setInterval(() => {
            if (currentStep >= steps) {
                clearInterval(moveInterval);
                this.marker.setLatLng(endPoint);
                this.currentRouteIndex++;
                this.moveToNextPoint(); // 继续移动到下一个目标点
            } else {
                // 计算当前插值位置
                const newLat = startPoint.lat + deltaLat * currentStep;
                const newLng = startPoint.lng + deltaLng * currentStep;
                this.marker.setLatLng([newLat, newLng]);
                currentStep++;
            }
        }, 50);
    }


    setSpeed(){
        // 设置当前飞机的速度
        this.speed = 200;
    }

    // 向后端发送坐标的方法
    sendCoordinates() {
        axios.post("http://127.0.0.1:8081/api/airplanes/upload", {
            id: this.id,
            lat: this.marker.getLatLng().lat,
            lon: this.marker.getLatLng().lng
        })
        .then(response => {
            console.log(`飞机 ${this.id} 坐标已成功上传到服务器`);
        })
        .catch(error => {
            console.error(`飞机 ${this.id} 坐标上传失败:`, error);
        });
        
    }

    // 启动定时任务，每秒发送一次
    startSendingCoordinates() {
        this.intervalId = setInterval(() => {
            if(this.moving){
                this.sendCoordinates();
            }
        }, 1000); // 每秒发送一次
    }


    delete() {
        // 停止定时发送坐标的任务
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    
        // 删除所有的点迹标记
        this.routeMarkers.forEach(marker => marker.remove());
        this.routeMarkers = []; // 清空标记数组
    
        // 删除飞机的其他资源（例如 marker）
        if (this.marker) {
            this.marker.remove();
        }
        console.log(this.id);
        // 不能用一步axios，要不然关闭页面的时候来不及发送删除请求，
        // 导致下一次打开页面的时候保存的飞机数量不对
        const url = `http://127.0.0.1:8081/api/airplanes/delete?uuid=${encodeURIComponent(this.id)}`;
        navigator.sendBeacon(url);
        console.log("飞机及其所有点迹已删除");
    }
    

    getId(){
        return this.id;
    }

    getLat(){
        return this.marker.lat;
    }

    getLon(){
        return this.marker.lon;
    }
}
