class Sidebar {
    constructor() {
        this.sidebarElement = document.querySelector('.sidebar');
        this.initializeSidebar();
    }

    initializeSidebar() {
        // 初始化主导航按钮，点击时展开或折叠次级菜单
        document.querySelectorAll('.nav-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const target = e.target;  // 获取点击的目标元素

                // 如果点击的是 "add" 图标，执行添加操作
                if (target.getAttribute('data-action') === 'add') {
                    this.addItem(button);
                } else if (target.getAttribute('data-action') === 'expand' || target === button) {
                    // 如果点击的是展开/折叠区域或其他部分，展开/折叠子菜单
                    const submenuId = button.getAttribute('data-submenu');
                    this.toggleSubmenu(submenuId);
                    this.toggleIcon(button);
                }
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

    toggleIcon(button) {
        const icon = button.querySelector('.expand-icon');  // 在点击的按钮上查找图标
        if (icon) {  // 确保图标存在
            if (icon.src.includes('images/down.png')) {
                icon.src = 'images/up.png';  // 设置为上箭头
            } else {
                icon.src = 'images/down.png';  // 设置为下箭头
            }
        } else {
            console.log("图标未找到");
        }
    }

    // 新增项的操作
    addItem(button) {
        // 这里可以进行添加逻辑，比如在 submenu 中新增一个项
        console.log('新增项');

        const submenuId = button.getAttribute('data-submenu');
        const submenu = document.getElementById(submenuId);
        const newItem = document.createElement('li');
        newItem.textContent = `新项 ${submenu.children.length + 1}`;
        submenu.appendChild(newItem);
    }

    // 处理拖拽事件，设置拖拽数据类型
    handleDragStart(event) {
        event.dataTransfer.setData("text/plain", event.target.getAttribute("data-type"));
    }
}
