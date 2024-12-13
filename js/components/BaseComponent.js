class BaseComponent {
    constructor(latitude, longitude, altitude, name = null, itemType = null, batch = null, identity = 2, model = 'dgn', speed = 0, rcs = 1000, rcsFile = null, status = 0, use = null, band = 0, band1 = null, track = null) {
        this.name = name;
        this.itemType = itemType;
        this.batch = batch;
        this.identity = identity;
        this.model = model;
        this.speed = speed;
        this.rcs = rcs;
        this.rcsFile = rcsFile;
        this.status = status;
        this.use = use;
        this.band = band;
        this.band1 = band1;
        this.track = track;
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
    }

    // Getter 和 Setter 方法

    // name
    getName() {
        return this.name;
    }
    setName(value) {
        this.name = value;
    }

    // itemType
    getItemType() {
        return this.itemType;
    }
    setItemType(value) {
        this.itemType = value;
    }

    // batch
    getBatch() {
        return this.batch;
    }
    setBatch(value) {
        this.batch = value;
    }

    // identity
    getIdentity() {
        return this.identity;
    }
    setIdentity(value) {
        this.identity = value;
    }

    // model
    getModel() {
        return this.model;
    }
    setModel(value) {
        this.model = value;
    }

    // speed
    getSpeed() {
        return this.speed;
    }
    setSpeed(value) {
        if (value < 0) {
            throw new Error("Speed cannot be negative");
        }
        this.speed = value;
    }

    // rcs
    getRcs() {
        return this.rcs;
    }
    setRcs(value) {
        if (value < 0) {
            throw new Error("RCS cannot be negative");
        }
        this.rcs = value;
    }

    // status
    getStatus() {
        return this.status;
    }
    setStatus(value) {
        this.status = value;
    }

    // use
    getUse() {
        return this.use;
    }
    setUse(value) {
        this.use = value;
    }

    // band
    getBand() {
        return this.band;
    }
    setBand(value) {
        this.band = value;
    }

    getRCSFile(){
        return this.rcsFile;
    }
    setRCSFile(value){
        this.rcsFile = value;
    }

    getBand1(){
        return this.band1;
    }

    setBand1(value){
        this.band1 = value;
    }

    getLat(){
        return this.latitude;
    }

    getLng(){
        return this.longitude;
    }

    getAlt(){
        return this.altitude;
    }

    setLat(value){
        this.latitude = value;
    }

    setLng(value){
        this.longitude = value;

    }

    setAlt(value){
        this.altitude = value;
    }

    getTrack(){
        return this.track;
    }

    setTrack(value){
        this.track = value;
    }
}
