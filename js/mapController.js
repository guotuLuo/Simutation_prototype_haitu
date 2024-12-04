// MapController 类，用于地图初始化和管理
class MapController {
    constructor() {
        this.map = this.initializeMap();
        this.contextMenus = {
            "object": new AirplaneContextMenu(this.map),
            "radar": new RadarContextMenu(this.map),
            "reconnaissance": new ReconnaissanceContextMenu(this.map),
            "jamming": new JammingContextMenu(this.map)
        };
        this.initializeDragAndDrop();
    }

    initializeMap() {
        const map = L.map('map').setView([35.8617, 104.1954], 10);

        // fetch('json/china.json') // 将路径替换为你的实际路径
        //     .then(response => response.json())
        //     .then(data => {
        //         L.geoJSON(data, {
        //             style: function () {
        //                 return {color: "#000000", weight: 2}; // 设置样式
        //             }
        //         }).addTo(map); // 添加到地图上
        //     })
        //     .catch(error => console.error("Error loading JSON:", error));

        // 在线加载leaflet官方地图
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // // 使用高德的WMS服务
        // var layer = L.tileLayer('http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
        //     subdomains: ['1', '2', '3', '4'],
        //     minZoom: 1, // 最小放缩级别
        //     maxZoom: 10 // 最大放缩级别
        // });
        // map.addLayer(layer);


        // // 分片加载地图
        // L.tileLayer('tiles/{z}/{x}/{y}.png', {
        //     maxZoom: 10,
        //     minZoom: 0,
        //     attribution: 'map'
        // }).addTo(map);
        return map;
    }

    addComponent(itemType, className, instanceName, position){
        const Icon = L.icon({
            iconUrl: 'images/' + itemType + '.png',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
        const component = ComponentFactory.createComponent(itemType, this.map, position, Icon, this.contextMenus[itemType], className, instanceName)


        // TODO 这里组件的组织需要想想,怎么管理所有组件
        // 每一次调用工厂创建新的对象都要将对象加入组件，删除的时候调用删除函数
        componentManager.addInstance(className, instanceName, component);

        // 根据不同的类初始化特定菜单， 这里的itemType是一级菜单的类
        this.contextMenus[itemType].initializeMenu();
    }


    // 从组件栏获取到拖放信号
    initializeDragAndDrop() {
        // 允许地图上的拖放
        this.map.getContainer().addEventListener('dragover', (e) => e.preventDefault());

        // 处理地图上的放置事件
        this.map.getContainer().addEventListener('drop', (e) => {
            e.preventDefault();
            const dragData = e.dataTransfer.getData('text/plain');

            // 分割数据（假设数据是以'|'分隔的）
            const [itemType, className, instanceName] = dragData.split('|');

            // 获取拖放位置的地理坐标
            const latLng = this.map.mouseEventToLatLng(e);
            this.addComponent(itemType, className, instanceName, latLng);
        });
    }
}
