// Point 类，用于管理雷达点迹
class Point {
    constructor(id, lat, lng) {
        this.id = id;
        this.lat = parseFloat(lat);
        this.lng = parseFloat(lng);
        this.lastSeen = Date.now(); // 初始化为当前时间
    }

    updateTimestamp() {
        this.lastSeen = Date.now(); // 更新为最新时间
    }

    getLatLng() {
        return {
            lat: this.lat,
            lng: this.lng
        };
    }
    
    getLat(){
        return this.lat;
    }

    getLng(){
        return this.lng;
    }
}
