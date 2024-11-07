document.addEventListener("DOMContentLoaded", () => {
    const mapController = new MapController();
    const sidebar = new Sidebar();
    const toolbar = new Toolbar();

    // mapController.contextMenus.initializeMenu(); // 确保菜单在页面加载后初始化
    window.addEventListener("beforeunload", () => {
        mapController.airplanes.forEach(airplane => airplane.delete());
        mapController.radars.forEach(radar => radar.delete());
    });
});
