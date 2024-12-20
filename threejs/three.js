class ThreeLayer extends L.Layer {
    constructor() {
        super();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.pointerEvents = 'none';
        this.camera.position.z = 5;
    }
    onAdd(map) {
        this.map = map;
        map.getPanes().overlayPane.appendChild(this.renderer.domElement);
        map.on('move', this._update, this);
        this._update();
        this._animate();
    }
    onRemove(map) {
        map.getPanes().overlayPane.removeChild(this.renderer.domElement);
        map.off('move', this._update, this);
    }
    _update() {
        const center = this.map.getCenter();
        const latLngToPoint = this.map.latLngToContainerPoint(center);
        this.camera.position.x = latLngToPoint.x;
        this.camera.position.y = latLngToPoint.y;
    }
    _animate() {
        requestAnimationFrame(this._animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
    addCube(position) {
        const latLngToPoint = this.map.latLngToContainerPoint(position);
        const x = latLngToPoint.x;
        const y = latLngToPoint.y;
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(x, y, 0);
        this.scene.add(cube);
        const lineMaterial = new THREE.LineDashedMaterial({ color: 0xff0000, dashSize: 3, gapSize: 1 });
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x, y, 0),
            new THREE.Vector3(x, y, -5)
        ]);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        line.computeLineDistances();
        this.scene.add(line);
    }
}

