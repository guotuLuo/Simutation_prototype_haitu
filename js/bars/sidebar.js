class Sidebar {
    constructor() {

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

        // 初始化主导航按钮，点击时展开或折叠次级菜单
        document.querySelectorAll('.toggle-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const target = e.target;  // 获取点击的目标元素

                const content = button.parentNode.nextElementSibling; // .section-content
                if (content) {
                    // Toggle display
                    content.style.display = content.style.display === 'none' ? 'block' : 'none';
                    // Toggle icon
                    const icon = button.querySelector('.toggle-icon');  // 在点击的按钮上查找图标
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
            });
        });


        // 点击关闭按钮时恢复原内容
        document.querySelector('.close-overlay-btn').addEventListener('click', () => {
            const overlayContent = document.querySelector('.overlay-content'); // 覆盖层
            const originalContent = document.querySelector('.origin-content'); // 原内容
            overlayContent.style.display = 'none'; // 隐藏覆盖层
            originalContent.style.display = 'block'; // 显示原内容
        });
    }

    // 切换子菜单显示
    toggleSubmenu(id) {
        const submenu = document.getElementById(id);
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
                const itemType = button.querySelector('.button-text').textContent.trim().toLowerCase();
                if (className) {
                    // 创建新的菜单子项，这里的button是add加号创建的， className是输入框文字
                    // 如果className 合法
                    this.createSubMenuLi(button, itemType, className);
                } else {
                    console.log('用户未输入名称或取消了操作');
                }
            });
    }

    createSubMenuLi(button, itemType, className){
        if(window.app.componentManager.instances.get(itemType).has(className)){
            alert("创建新项失败，请勿输入重名名称");
            return;
        }
        const submenu = document.getElementById(button.getAttribute('data-submenu'));

        // 创建新项
        const newItem = document.createElement('li');
        newItem.textContent = className;  // 使用用户输入的名称, 这是可拖拽项的名称，就是二级菜单的名称, 不是实例对象的名称

        // 使新项可拖拽
        newItem.draggable = true;

        // 获取项的类名
        newItem.setAttribute('data-type', itemType);  // 可以根据需求调整data-type的值

        // 根据当前地图上所有相同className的对象来确定当前拖拽时间需要新建的对象名称
        // 这里创建实例对象名称比较简陋，就直接获取当前list.length + 1作为当前对象的名称;

        // 创建删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        const deleteImg = document.createElement('img');
        deleteImg.src = "images/remove.png";  // 图片路径

        deleteBtn.appendChild(deleteImg);
        deleteBtn.addEventListener('click', function() {
            // 删除当前的 li 元素
            newItem.remove();
            // 删除当前按钮还应该删除当前componentManager里面的className 和 className 对应的所有实例
            window.app.componentManager.deleteClassAndInstances(itemType, className);
        });

        // 将删除按钮添加到 li 元素中
        newItem.appendChild(deleteBtn);

        // 绑定拖拽监听事件
        newItem.addEventListener('dragstart', (e) => {
            // 连接数据项，使用'|'作为分隔符
            const dragData = `${itemType}|${className}`;
            e.dataTransfer.setData('text/plain', dragData);  // 设置拖拽数据
        });

        // 将新项添加到 submenu 中
        submenu.appendChild(newItem);
        window.app.componentManager.addClassName(itemType, className);
    }


    clearAllItems() {
        document.querySelectorAll('.nav-button').forEach(button => {
            const submenu = document.getElementById(button.getAttribute('data-submenu'));

            // 使用 querySelectorAll 获取所有的 li 元素
            submenu.querySelectorAll('li').forEach(li => {
                li.querySelector('button').click(); // 点击每个 button
            });
        });
    }

    // 初始化处理拖拽事件，设置拖拽数据类型
    handleDragStart(event) {
        event.dataTransfer.setData("text/plain", event.target.getAttribute("data-type"));
    }

    showFlightInfo(selectComponent){
        document.getElementById('flight-number').textContent = 'id: ' + selectComponent.getId().substring(0, 8);
        document.getElementById('airline-name').textContent = 'name: ' + selectComponent.getName();
        document.getElementById('altitude').textContent = selectComponent.getAlt();
        document.getElementById('latitude').textContent = selectComponent.getLat();
        document.getElementById('longitude').textContent = selectComponent.getLng();
        document.getElementById('speed').textContent = selectComponent.getSpeed();
        document.getElementById('direction').textContent = '0';

        // 显示图表
        PaintChart();
        const overlayContent = document.querySelector('.overlay-content'); // 覆盖层
        const originalContent = document.querySelector('.origin-content'); // 原内容
        // 显示覆盖层
        originalContent.style.display = 'none';
        overlayContent.style.display = 'flex';
    }
}
