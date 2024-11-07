// Airplane 类，用于管理飞机对象的创建、飞行和删除
class Point {
    constructor(id, lat, lng) {
        this.id = id;
        this.lat = parseFloat(lat); // 确保 lat 为数字类型
        this.lng = parseFloat(lng); // 确保 lng 为数字类型
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
