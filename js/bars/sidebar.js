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

    // 新增项的操作，需要获取对话框以及绑定元素拖拽函数
    // 以Airplane类为例，这里新增项是否只是新增了不同名称的Airplane,而不是新增了一个新的AirplaneNew 类，这也太鸡肋了
    addItem(button) {
        // customDialog是弹出对话框函数，获取输入到对话框里面的字符串
        customDialog(button)
            .then(className => {
                if (className) {
                    const submenuId = button.getAttribute('data-submenu');
                    const submenu = document.getElementById(submenuId);

                    // 创建新项
                    const newItem = document.createElement('li');
                    newItem.textContent = className;  // 使用用户输入的名称, 这是可拖拽项的名称，就是二级菜单的名称, 不是实例对象的名称

                    // 使新项可拖拽
                    newItem.draggable = true;

                    // 获取项的类名
                    const itemType = button.querySelector('.button-text').textContent.trim().toLowerCase();
                    newItem.setAttribute('data-type', itemType);  // 可以根据需求调整data-type的值

                    // 根据当前地图上所有相同className的对象来确定当前拖拽时间需要新建的对象名称
                    // 这里创建实例对象名称比较简陋，就直接获取当前list.length + 1;
                    const instanceName = componentManager.getInstanceList(itemType) + 1;


                    // 绑定拖拽监听事件
                    newItem.addEventListener('dragstart', (e) => {
                        // 连接数据项，使用'|'作为分隔符
                        const dragData = `${itemType}|${className}|${instanceName}`;
                        e.dataTransfer.setData('text/plain', dragData);  // 设置拖拽数据

                    });
                    // 将新项添加到 submenu 中
                    submenu.appendChild(newItem);

                } else {
                    console.log('用户未输入名称或取消了操作');
                }
            });
    }



    // 初始化处理拖拽事件，设置拖拽数据类型
    handleDragStart(event) {
        event.dataTransfer.setData("text/plain", event.target.getAttribute("data-type"));
    }
}
