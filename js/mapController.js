// MapController 类，用于地图初始化和管理
class MapController {
    constructor() {
        this.map = this.initializeMap();
        this.contextMenus = {
            "airplane": new AirplaneContextMenu(this.map),
            "radar": new RadarContextMenu(this.map)
        };
        this.airplanes = [];  // 存储所有飞机的实例
        this.radars = [];
        this.initializeDragAndDrop();
        // 在构造函数内调用各个菜单的初始化方法
        this.contextMenus.airplane.initializeMenu();
        this.contextMenus.radar.initializeMenu();
    }

    initializeMap() {
        const map = L.map('map').setView([35.8617, 104.1954], 10);
        // 离线地图，暂时不启用
        // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //     maxZoom: 15,
        //     attribution: '© OpenStreetMap contributors'
        // }).addTo(map);

        fetch('json/china.json') // 将路径替换为你的实际路径
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    style: function() {
                        return { color: "#ADD8E6", weight: 2 }; // 设置样式
                    }
                }).addTo(map); // 添加到地图上
            })
            .catch(error => console.error("Error loading JSON:", error));
        // leftlet官方地图
        // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        // }).addTo(map);

        // // 使用高德的WMS服务
        // var layer = L.tileLayer('http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
        //     subdomains: ['1', '2', '3', '4'],
        //     minZoom: 1, // 最小放缩级别
        //     maxZoom: 10 // 最大放缩级别
        // });
        // map.addLayer(layer);

        L.tileLayer('tiles/{z}/{x}/{y}.png', {
            maxZoom: 10,
            minZoom: 0,
            attribution: 'map'
        }).addTo(map);
        return map;
    }

    addAirplane(position) {
        const airplaneIcon = L.icon({
            iconUrl: 'images/airplane.png',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
        const airplane = new Airplane(this.map, position, airplaneIcon, this.contextMenus["airplane"]);
        this.airplanes.push(airplane);
        this.contextMenus["airplane"].initializeMenu(); // 初始化特定菜单
    }

    addRadar(position){
        const radarIcon = L.icon({
            iconUrl: 'images/radar.png',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
        const radar = new Radar(this.map, position, radarIcon, this.contextMenus["radar"]);
        this.radars.push(radar);
        this.contextMenus["radar"].initializeMenu(); // 初始化特定菜单
    }

    enableDragAndDrop() {
        this.map.getContainer().addEventListener('dragover', (e) => e.preventDefault());

        this.map.getContainer().addEventListener('drop', (e) => {
            e.preventDefault();
            const itemType = e.dataTransfer.getData("text/plain");
            if (itemType === "airplane") {
                const latLng = this.map.mouseEventToLatLng(e);
                this.addAirplane(latLng);
            }else if(itemType == "radar"){
                const latLng = this.map.mouseEventToLatLng(e);
                this.addRadar(latLng);
            }
        });
    }

    initializeDragAndDrop() {
        // 允许地图上的拖放
        this.map.getContainer().addEventListener('dragover', (e) => e.preventDefault());

        // 处理地图上的放置事件
        this.map.getContainer().addEventListener('drop', (e) => {
            e.preventDefault();
            const itemType = e.dataTransfer.getData("text/plain");

            // 获取拖放位置的地理坐标
            const latLng = this.map.mouseEventToLatLng(e);
            
            // 根据拖放的类型生成对应的图标
            if (itemType === "airplane") {
                this.addAirplane(latLng);
            } else if (itemType === "radar") {
                this.addRadar(latLng);
            }
        });
    }
}
