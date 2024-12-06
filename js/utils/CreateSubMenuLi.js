function  createSubMenuLi(button, itemType, className){
    if(componentManager.instances.get(itemType).has(className)){
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
    const instanceName = componentManager.get(itemType) + 1;
    console.log(instanceName);

    // 创建删除按钮
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    const deleteImg = document.createElement('img');
    deleteImg.src = "images/remove.png";  // 图片路径

    deleteBtn.appendChild(deleteImg);
    deleteBtn.addEventListener('click', function() {
        console.log("删除按钮被点击");
        newItem.remove();  // 删除当前的 li 元素
    });

    // 将删除按钮添加到 li 元素中
    newItem.appendChild(deleteBtn);

    // 绑定拖拽监听事件
    newItem.addEventListener('dragstart', (e) => {
        // 连接数据项，使用'|'作为分隔符
        const dragData = `${itemType}|${className}|${instanceName}`;
        e.dataTransfer.setData('text/plain', dragData);  // 设置拖拽数据

    });

    // 将新项添加到 submenu 中
    submenu.appendChild(newItem);
    componentManager.addClassName(itemType, className);
}