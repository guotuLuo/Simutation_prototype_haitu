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
    // TODO 以Airplane类为例，这里新增项是否只是新增了不同名称的Airplane,而不是新增了一个新的AirplaneNew 类，这也太鸡肋了
    addItem(button) {
        // 获取按钮的位置和尺寸
        const rect = button.getBoundingClientRect();
        const mouseX = rect.left + rect.width;  // 将对话框放在按钮右侧
        const mouseY = rect.top + 10;

        // 创建自定义对话框
        const dialog = document.createElement('div');
        dialog.classList.add('custom-prompt');
        dialog.style.position = 'absolute';
        dialog.style.left = `${mouseX}px`;
        dialog.style.top = `${mouseY}px`;
        dialog.style.border = '1px solid #ccc';
        dialog.style.backgroundColor = '#fff';
        dialog.style.zIndex = '9999';
        dialog.style.minWidth = '250px';  // 给对话框设置最小宽度，避免太小

        // 创建一个容器将输入框放在一行
        const formContainer = document.createElement('div');
        formContainer.style.display = 'flex';
        formContainer.style.flexDirection = 'column';  // 纵向排列
        formContainer.style.gap = '8px';  // 设置间距为8px，减少空白
        dialog.appendChild(formContainer);

        // 创建输入框
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '请输入新项名称';
        input.style.width = '96%';  // 输入框宽度充满容器
        input.style.marginBottom = '5px';  // 给输入框底部添加一些间距
        formContainer.appendChild(input);

        // 创建确认按钮和取消按钮的容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';  // 使用 flex 布局将按钮放在同一行
        buttonContainer.style.justifyContent = 'space-around';  // 按钮之间有空间
        buttonContainer.style.gap = '10px';  // 设置按钮之间的间距为10px
        formContainer.appendChild(buttonContainer);

        // 创建确认按钮
        const submitButton = document.createElement('button');
        submitButton.textContent = '确定';
        submitButton.style.marginRight = '5px';  // 为按钮之间添加一些间距
        buttonContainer.appendChild(submitButton);

        // 创建取消按钮
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        buttonContainer.appendChild(cancelButton);

        document.body.appendChild(dialog);

        // 聚焦到输入框
        input.focus();

        // 监听确认按钮点击事件
        submitButton.addEventListener('click', () => {
            const name = input.value.trim();
            if (name) {
                console.log('新增项');
                const submenuId = button.getAttribute('data-submenu');
                const submenu = document.getElementById(submenuId);
                const newItem = document.createElement('li');
                newItem.textContent = name;  // 使用用户输入的名称
                submenu.appendChild(newItem);
            } else {
                console.log('用户未输入名称');
            }

            // 移除自定义对话框
            dialog.remove();
        });

        // 监听取消按钮点击事件
        cancelButton.addEventListener('click', () => {
            // 移除自定义对话框
            dialog.remove();
        });

        // 点击对话框外部时关闭对话框
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.remove();
            }
        });
    }



    // 处理拖拽事件，设置拖拽数据类型
    handleDragStart(event) {
        event.dataTransfer.setData("text/plain", event.target.getAttribute("data-type"));
    }
}
