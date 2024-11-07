// sidebar.js
class Sidebar {
    constructor() {
        this.sidebarElement = document.querySelector('.sidebar');
        this.initializeSidebar();
    }

    initializeSidebar() {
        // 初始化主导航按钮，点击时展开或折叠次级菜单
        document.querySelectorAll('.nav-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const submenuId = e.target.getAttribute('data-submenu');
                this.toggleSubmenu(submenuId);
            });
        });

        // 初始化次级菜单项的拖拽功能
        document.querySelectorAll('.submenu li').forEach(item => {
            item.addEventListener('dragstart', this.handleDragStart);
        });
    }

    // 切换子菜单显示
    toggleSubmenu(id) {
        const submenu = document.getElementById(id);
        submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
    }

    // 处理拖拽事件，设置拖拽数据类型
    handleDragStart(event) {
        event.dataTransfer.setData("text/plain", event.target.getAttribute("data-type"));
    }
}
