// 定义全局管理器类 App
class App {
    constructor() {
        window.app = this;
        this.initApplication();
    }

    initApplication(){
        this.initOpenDialog();
        this.initMapController();
        this.initComponentManager();

        this.initSideBar();
        this.initMenuBar();
        this.initToolBar();
        this.initEnvi();

        // 页面卸载前清理所有对象
        window.addEventListener("beforeunload", () => {
            window.app.componentManager.deleteAllObjects();
        });
    }

    initOpenDialog(){
        this.openDialog = new OpenDialog();
        this.openDialog.initializeOpenDialog();
    }

    initMapController(){
        this.mapController = new MapController();
    }

    initComponentManager(){
        this.componentManager = new componentManager();
        this.componentManager.initComponentManager();
    }

    initSideBar(){
        this.sidebar = new Sidebar();
        this.sidebar.initializeSidebar();
    }

    initMenuBar(){
        this.menubar = new Menubar();
        this.menubar.initializeMenubar();

    }

    initToolBar(){
        this.toolbar = new Toolbar();
        this.toolbar.initializeToolbar();
    }

    initEnvi(){
        this.envi = new Envi(this.mapController, this.componentManager);
        this.envi.initEnvi();
    }
}

// 在 DOMContentLoaded 事件中实例化 App
document.addEventListener("DOMContentLoaded", () => {
    window.app = new App();
});