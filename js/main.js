document.addEventListener("DOMContentLoaded", () => {
    const mapController = new MapController();
    const sidebar = new Sidebar();
    const toolbar = new Toolbar();
    componentManager.init();
    window.addEventListener("beforeunload", () => {
        componentManager.deleteAllInstances();
    });
});
