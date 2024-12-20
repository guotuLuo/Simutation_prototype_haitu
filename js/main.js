import { MapController } from "./mapController.js";
import { Sidebar } from "./bars/sidebar.js";
import { Toolbar } from "./bars/toolbar.js";
import { componentManager } from "./components/componentManager.js";
//import { ComponentFactory } from "./factories/ComponentFactory.js";

document.addEventListener("DOMContentLoaded", () => {
    const mapController = new MapController();
    const sidebar = new Sidebar();
    const toolbar = new Toolbar(mapController);

    initApplication(){
        this.initOpenDialog();
        this.initMapController();
        this.initComponentManager();

        this.initSideBar();
        this.initMenuBar();
        this.initToolBar();
        this.initEnvi();
        this.initOutlineManager();
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
        this.envi = new Envi();
        this.envi.initEnvi();
    }

    initOutlineManager(){
        this.outlineManager = new OutlineManager();
        this.outlineManager.initOutlineManager();
    }
}

// 在 DOMContentLoaded 事件中实例化 App
document.addEventListener("DOMContentLoaded", () => {
    window.app = new App();
});