// MapController 类，用于地图初始化和管理
class MapController {
    constructor() {
        this.map = this.initializeMap();
        this.contextMenus = {
            "object": new AirplaneContextMenu(this.map),
            "radar": new RadarContextMenu(this.map),
            "reconnoissance": new ReconnoissanceContextMenu(this.map),
            "jamming": new JammingContextMenu(this.map)
        };

        this.initThreeJS();
        this.threeLayer = new ThreeLayer();
        this.map.addLayer(this.threeLayer);

        this.initializeDragAndDrop();
    }
    getMap() {
        return this.map;
    }

    // initializeMap() {
    //     // 初始视图中心 L.map('map')这里的map对应了html里面的map-container里的map
    //     const mapElement = document.getElementById('map');
    //     const map = L.map(mapElement).setView([35.8617, 104.1954], 10);
    //     mapElement._leafletMap = map;
    //     // fetch('json/china.json') // 将路径替换为你的实际路径
    //     //     .then(response => response.json())
    //     //     .then(data => {
    //     //         L.geoJSON(data, {
    //     //             style: function () {
    //     //                 return {color: "#000000", weight: 2}; // 设置样式
    //     //             }
    //     //         }).addTo(map); // 添加到地图上
    //     //     })
    //     //     .catch(error => console.error("Error loading JSON:", error));
    //
    //     // 在线加载leaflet官方地图 这个过一段时间就得去官网更新
    //     L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //     }).addTo(map);
    //
    //     // 使用高德的WMS服务
    //     let layer = L.tileLayer('http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
    //         subdomains: ['1', '2', '3', '4'],
    //         minZoom: 1, // 最小放缩级别
    //         maxZoom: 10 // 最大放缩级别
    //     });
    //     map.addLayer(layer);
    //
    //
    //     // // 分片加载地图
    //     // L.tileLayer('tiles/{z}/{x}/{y}.png', {
    //     //     maxZoom: 10,
    //     //     minZoom: 0,
    //     //     attribution: 'map'
    //     // }).addTo(map);
    //     return map;
    // }

    initializeMap() {
        // const map = L.map('map').setView([35.8617, 104.1954], 10);

        // fetch('json/china.json') // 将路径替换为你的实际路径
        //     .then(response => response.json())
        // map.addLayer(layer);


        const map = L.map('map', {
            crs: L.CRS.EPSG3857, // 默认坐标系统
            zoomControl: true,
            center: [35.8617, 104.1954],
            zoom: 10
        });

        // 加载瓦片图层
        L.tileLayer('tiles/{z}/{x}/{y}.png', {
            maxZoom: 10,
            minZoom: 0,
            attribution: 'map'
        }).addTo(map);

        // 设置初始视角，模拟 3D
        map.setView([35.8617, 104.1954], 10);

        // 通过自定义 CSS 来模拟 3D 效果
        map.getContainer().style.transform = 'perspective(1000px) rotateX(30deg)';
        // 让地图倾斜一定角度，模拟 3D 效果
        map.on('load', function() {
            console.log('Map loaded with 3D view');
        });

        // 返回 map 对象
        return map;

    }

    initThreeJS() {
        // 创建 Three.js 场景
        this.scene = new THREE.Scene();
        //随便输入一个API，测试下是否已经正常引入three.js
        console.log(THREE.Scene);
        // 创建相机
        // this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        // this.camera.position.set(0, 0, 500);

        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        // 禁用浏览器默认滚轮缩放行为
        // window.addEventListener('wheel', (event) => {
        //     if (event.ctrlKey) {
        //         event.preventDefault();
        //         this.zoom(event.deltaY);
        //     }
        // }, { passive: false });
        // 创建一个平面几何体，将其作为地图的容器
        const planeGeometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
        const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.set(0, 0, 0);
        this.scene.add(plane);
        // 渲染循环
        // const animate = () => {
        //     requestAnimationFrame(animate);
        //     this.renderer.render(this.scene, this.camera);
        // };
        // animate();
    }
    zoom(deltaY) {
        const zoomFactor = 1.1;
        if (deltaY < 0) {
            this.camera.position.z /= zoomFactor;
        } else {
            this.camera.position.z *= zoomFactor;
        }
    }



    // addComponent(itemType, className, instanceName, position){
    //     const Icon = L.icon({
    //         iconUrl: 'images/' + itemType + '.png',
    //         iconSize: [32, 32],
    //         iconAnchor: [16, 16]
    //     });
    //
    //     const instance = ComponentFactory.createComponent(this.map, position, Icon, this.contextMenus[itemType], itemType, className, instanceName)
    //     // TODO 这里组件的组织需要想想,怎么管理所有组件
    //     // 每一次调用工厂创建新的对象都要将对象加入组件，删除的时候调用删除函数
    //     window.app.componentManager.addInstance(itemType, className, instanceName, instance);
    //     addObjectToList(instance);
    //
    //     // 根据不同的类初始化特定菜单， 这里的itemType是一级菜单的类
    //     this.contextMenus[itemType].initializeMenu();
    // }

    addComponent(itemType, className, instanceName, position){
        const Icon = L.icon({
            iconUrl: 'images/' + itemType + '.png',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });


        const latLng = this.map.mouseEventToLatLng(e);
        this.threeLayer.addCube(latLng);

        const instance = ComponentFactory.createComponent(this.map, position, Icon, this.contextMenus[itemType], itemType, className, instanceName)
        // TODO 这里组件的组织需要想想,怎么管理所有组件
        // 每一次调用工厂创建新的对象都要将对象加入组件，删除的时候调用删除函数
        window.app.componentManager.addInstance(itemType, className, instanceName, instance);
        addObjectToList(instance);

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
            const [itemType, className] = dragData.split('|');
            // 获取拖放位置的地理坐标
            const position = this.map.mouseEventToLatLng(e);
            const instanceName = className + String(window.app.componentManager.getNextInstanceName());
            this.addComponent(itemType, className, instanceName, position);
        });
    }
}
