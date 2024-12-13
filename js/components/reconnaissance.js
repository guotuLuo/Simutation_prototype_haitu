// Jamming 类
class Reconnaissance extends BaseComponent{
    constructor(map, position, icon, contextMenu, itemType, className, name) {
        super();
        this.map = map;
        this.position = position;
        this.icon = icon;
        this.contextMenu = contextMenu;
        this.routeMarkers = [];
        this.speed = 300;
        this.moving = false;
        this.name = name;
        this.className = className;
        this.itemType = itemType;
        this.createMarker();
        this.startSendingCoordinates();
        this.startposition=position;

        // 经度维度海拔
        this.latitude = position.lat;
        this.longitude = position.lng;
        this.altitude = 0;

        this.batch = parseInt(this.name.substring(this.itemType.length));
        this.use = 2;
        // 将纬度和经度格式化为字符串
        this.track = [];
        const lat = position.lat.toFixed(5);
        const lng = position.lng.toFixed(5);
        this.track.push([lat, lng]);
    }
    backToStart(){
        this.marker.setLatLng(this.startposition);

        this.currentRouteIndex = 0;
    }

    createMarker() {
        this.id = generateUUID();
        this.marker = L.marker(this.position, {icon: this.icon, draggable: true}).addTo(this.map);
        this.marker.bindPopup("飞机: " + this.id).openPopup();

        // 绑定拖动事件
        this.marker.on('drag', (event) => {
            const latLng = event.target.getLatLng();
            this.marker.setPopupContent("飞机: " + this.id + "<br>经纬度: " + latLng.lat.toFixed(6) + ", " + latLng.lng.toFixed(6));
            this.marker.openPopup();

            // 更新 track 数组中的初始位置（如果有路径点，更新初始位置的坐标）
            if (this.track.length > 0) {
                this.setLat(latLng.lat);
                this.setLng(latLng.lng);
                this.track[0] = [latLng.lat.toFixed(5), latLng.lng.toFixed(5)];
            }

            // 更新初始 marker 的位置（即第一个路径点）
            if (this.routeMarkers.length > 0) {
                // 只更新初始位置标记，不更新后续标记
                this.routeMarkers[0].setLatLng(latLng);
            }

            // 如果路径点数量大于等于2，更新前两个点之间的连线
            if (this.routeMarkers.length >= 3) {
                const firstMarkerLatLng = this.routeMarkers[0].getLatLng();
                const secondMarkerLatLng = this.routeMarkers[2].getLatLng();
                this.routeMarkers[1].remove();
                this.routeMarkers[1] = L.polyline([firstMarkerLatLng, secondMarkerLatLng], {color: 'red'}).addTo(this.map);
                console.log(this.routeMarkers);
            }
        });

        this.marker.on('contextmenu', (event) => {
            event.originalEvent.preventDefault();
            this.contextMenu.show(event, this);
        });

        const initialPosition = this.marker.getLatLng();
        // 添加初始位置的红色标记
        this.addRoutesMarker(initialPosition, "red");

        axios.post("http://127.0.0.1:8081/api/airplanes/uploadCoordinates", {
            id: this.id,
            lat: this.marker.getLatLng().lat,
            lon: this.marker.getLatLng().lng
        }).then(response => {
            console.log(`初始路径点 ${this.id} 坐标已成功上传到服务器`);
        }).catch(error => {
            console.error(`初始路径点 ${this.id} 坐标上传失败:`, error);
        });
    }



    setFlightRoute() {
        console.log("请设置当前点迹");

        // 添加当前 marker 的位置到路径中
        axios.post("http://127.0.0.1:8081/api/airplanes/uploadCoordinates", {
            id: this.id,
            lat: this.marker.getLatLng().lat,
            lon: this.marker.getLatLng().lng
        }).then(response => {
            console.log(`路径点 ${this.id} 坐标已成功上传到服务器`);
        }).catch(error => {
            console.error(`路径点 ${this.id} 坐标上传失败:`, error);
        });

        // 左键点击事件 - 添加点击的点到路线中
        const addRoutePoint = (event) => {
            if (!event.latlng) {
                console.error("点击事件未返回有效的经纬度。请确保地图已经初始化。");
                return;
            }

            const latLng = event.latlng; // 获取点击位置的经纬度
            axios.post("http://127.0.0.1:8081/api/airplanes/uploadCoordinates", {
                id: this.id,
                lat: this.marker.getLatLng().lat,
                lon: this.marker.getLatLng().lng
            }).then(response => {
                console.log(`路径点 ${this.id} 坐标已成功上传到服务器`);
            }).catch(error => {
                console.error(`路径点 ${this.id} 坐标上传失败:`, error);
            });

            // 如果有上一个点，则绘制线段连接
            if (this.track.length >= 1) {
                const previousLatLng = this.track[this.track.length - 1];
                const polyline = L.polyline([previousLatLng, [latLng.lat, latLng.lng]], {color: 'red'}).addTo(this.map);
                this.routeMarkers.push(polyline); // 将线段添加到 routeMarkers 数组中}
                console.log(`添加点迹: ${latLng.lat}, ${latLng.lng}`);
            }
            this.addRoutesMarker(latLng, "red"); // 标记点击位置为红色
            this.track.push([latLng.lat, latLng.lng]); // 添加到路径数组中
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

    startFlight() {
        if (this.track.length < 2) {
            console.log("路径点不足，无法移动");
            return;
        }
        console.log("开始飞行");
        this.moving = true;

        // Only reset currentRouteIndex if the flight is starting for the first time
        if (this.currentRouteIndex === undefined || this.currentRouteIndex === null) {
            this.currentRouteIndex = 0;
        }
        //这么做是为了让这个函数方便的多次调用，不用每次都从头开始飞行
        this.moveToNextPoint();
    }

    stopFlight() {
        if (!this.moving) {
            console.log("飞行已经停止");
            return;
        }
        console.log("停止飞行");
        this.moving = false;
    }

    // 修改 moveToNextPoint 方法
    moveToNextPoint() {
        if (!this.moving) {
            return;
        }
        if (this.currentRouteIndex >= this.track.length - 1) {
            console.log("到达终点");
            this.moving = false;
            return;
        }
        const startPoint = this.marker.getLatLng();//开始点应该是什么呢？
        const endPoint = L.latLng(this.track[this.currentRouteIndex + 1]);
        const totalDistance = this.map.distance(startPoint, endPoint); // 计算总距离
        const updateInterval = 50; // 每步50ms
        let currentStep = 0;
        let startTime = Date.now();

        const moveStep = () => {
            if (!this.moving) {
                return;
            }
            const elapsedTime = Date.now() - startTime;
            const duration = (totalDistance / this.speed) * 1000; // 计算到达下一个点所需时间（毫秒）
            const steps = Math.ceil(duration / updateInterval); // 将移动分成多步
            const deltaLat = (endPoint.lat - startPoint.lat) / steps;
            const deltaLng = (endPoint.lng - startPoint.lng) / steps;

            const currentStep = Math.min(Math.floor(elapsedTime / updateInterval), steps);
            if (currentStep >= steps) {
                this.marker.setLatLng(endPoint);  // 确保最终定位在目标点
                this.currentRouteIndex++;
                this.moveToNextPoint(); // 继续移动到下一个目标点
            } else {
                // 计算当前插值位置
                const newLat = startPoint.lat + deltaLat * currentStep;
                const newLng = startPoint.lng + deltaLng * currentStep;
                this.marker.setLatLng([newLat, newLng]);
                //currentStep++;
                setTimeout(moveStep, updateInterval); // 调用下一步
            }
        };
        moveStep(); // 开始移动
    }

    setItemSpeed() {
        // 设置当前飞机的速度
        this.setSpeed(parseInt(prompt("初始速度300,请输入新的速度", this.speed)));
        this.marker.getPopup().setContent("飞机: " + this.speed);
        axios.post("http://127.0.0.1:8081/api/airplanes/setSpeed", {
            id: this.id,
            speed: this.speed
        }).then(response => {
            console.log(`飞机 ${this.id} 速度设置成功`);
        }).catch(error => {
            console.error(`飞机 ${this.id} 速度设置失败:`, error);
        });
    }

    // 向后端发送坐标的方法
    sendCoordinates() {
        axios.post("http://127.0.0.1:8081/api/reconnaissances/uploadCoordinates", {
            id: this.id,
            lat: this.marker.getLatLng().lat,
            lon: this.marker.getLatLng().lng
        }).then(response => {
            console.log(`侦察样机 ${this.id} 坐标已成功上传到服务器`);
        }).catch(error => {
            console.error(`侦察样机 ${this.id} 坐标上传失败:`, error);
        });
    }

    // 启动定时任务，每秒发送一次
    startSendingCoordinates() {
        this.intervalId = setInterval(() => {
            if (this.moving) {
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

        // 删除侦察样机的其他资源（例如 marker）
        if (this.marker) {
            this.marker.remove();
        }
        componentManager.deleteInstance(this.itemType, this.className, this.name);
        removeObjectFromList(this.itemType, this.className, this.name);
        // 不能用异步axios，要不然关闭页面的时候来不及发送删除请求，
        // 导致下一次打开页面的时候保存的侦察样机数量不对
        const url = `http://127.0.0.1:8081/api/reconnaissances/delete?uuid=${encodeURIComponent(this.id)}`;
        navigator.sendBeacon(url);
        console.log("侦察样机及其所有点迹已删除");
    }

    changeName() {
        this.name = prompt("请输入新的侦察样机名称", this.name);
        this.marker.getPopup().setContent("侦察样机: " + this.name);
        axios.post(`http://127.0.0.1:8081/api/reconnaissances/editName`, {
            id: this.id,
            name: this.name
        }).then(response => {
            console.log(`侦察样机 ${this.id} 名称已修改成功`);
        }).catch(error => {
            console.error(`侦察样机 ${this.id} 名称已修改失败:`, error);
        });
    }


    deleteRoute() {
        this.stopFlight();
        this.track = [];
        this.track.push([this.getLat(), this.getLng()]);
        // 只删除路径标记，不删除初始坐标的标记
        this.routeMarkers.slice(1).forEach(marker => marker.remove());  // 删除除初始坐标外的所有标记
        this.routeMarkers = [this.routeMarkers[0]]; // 保留初始标记

        const url = `http://127.0.0.1:8081/api/airplanes/deleteTrackPoint?uuid=${encodeURIComponent(this.id)}`;
        navigator.sendBeacon(url);
    }

    getClassName(){
        return this.className;
    }


}
