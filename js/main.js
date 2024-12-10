document.addEventListener("DOMContentLoaded", () => {
    const mapController = new MapController();
    const sidebar = new Sidebar();
    const toolbar = new Toolbar(mapController);

    // mapController.contextMenus.initializeMenu(); // 确保菜单在页面加载后初始化
    // 是否需要用mapController来管理所有的组件？
    //const toolbar = new Toolbar();
    componentManager.init();
    window.addEventListener("beforeunload", () => {
        componentManager.deleteAllInstances();
    });
});
