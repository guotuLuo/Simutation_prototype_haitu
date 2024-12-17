
class Toolbar {
    constructor() {
        this.toolbarElement = document.querySelector(".tool-bar");
        this.centerMarker = null; // 用于存储中心标记
        this.centerCoordinates = null; // 用于存储中心坐标
    }

    initializeToolbar() {
        // 初始化工具栏按钮
        document.querySelectorAll('.tool-bar button').forEach(button => {
            button.addEventListener('click', (e) => {
                const toolAction = e.target.getAttribute('data-action');
                this.handleToolAction(toolAction);
            });
        });
    }

    // 根据按钮的 data-action 执行不同的操作
    handleToolAction(action) {
        switch (action) {
            case 'start':
                console.log("态势启动");
                window.app.componentManager.startAllRadars();
                window.app.componentManager.startAllObjects();
                break;
            case 'stop':
                console.log("态势停止");
                window.app.componentManager.stopAllObjects();
                window.app.componentManager.stopAllRadars();
                break;
            case 'refresh':
                console.log("态势复原");
                window.app.componentManager.returnAllObjects();
                break;
            case 'generate':
                console.log("态势代码生成");
                break;
            case 'delete':
                console.log("组件删除");
                window.app.componentManager.deleteAllObjects();
                break;
            case 'reset':
                console.log("中心复位");
                if (this.centerCoordinates) {
                    window.app.mapController.getMap().setView(this.centerCoordinates, 10);
                }
                break;
            case 'center':
                console.log("设置态势中心");
                this.setCenter();
                break;
            case 'match':
                console.log("匹配连接");
                break;
            case 'evaluate':
                console.log("评估");
                break;
            case 'toggle-full':
                // 获取sidebar和按钮
                document.querySelector('.side-bar').classList.toggle('hidden');
                document.querySelector('.radar-display').classList.toggle('hidden');
                break;
            case 'toggle-sidebar':
                // 获取sidebar和按钮
                document.querySelector('.side-bar').classList.toggle('hidden');
                break;
            case 'toggle-radarbar':
                // 获取sidebar和按钮
                document.querySelector('.radar-display').classList.toggle('hidden');
                break;
            case 'setting':
                console.log("样机设置");
                openModal();
                break;
            default:
                console.log("Unknown tool action", action);
        }
    }
    setCenter() {
        // 获取当前地图中心
        let map = window.app.mapController.getMap();
        map.once('contextmenu', function(e) {
            // 获取右键点击的位置（经纬度）
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;

            // 将右键点击的位置设置为地图的中心点
            map.setView([lat, lng]);

            // 更新 this.centerCoordinates
            this.centerCoordinates = [lat, lng];

            // 如果已经有中心标记，先移除它
            if (this.centerMarker) {
                map.removeLayer(this.centerMarker);
            }

            // 创建新的中心标记
            const icon = L.icon({
                iconUrl: 'images/center50.png',
                iconSize: [50, 50], // 图标大小
                iconAnchor: [25, 25] // 图标锚点
            });

            this.centerMarker = L.marker(this.centerCoordinates, { icon: icon }).addTo(map);

            console.log("右键点击位置：", this.centerCoordinates);
        }.bind(this)); // 确保 this 指向当前对象


    }
}