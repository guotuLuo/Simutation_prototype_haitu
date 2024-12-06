function settingComponentInsert(){
    // 获取对象列表的父元素
    const objectList = document.getElementById('objectList');

    // 遍历对象数组并动态添加到ul中
    objects.forEach(object => {
        // 创建一个新的li元素
        const li = document.createElement('li');

        // 给li元素添加内容
        li.classList.add('object-item');
        li.textContent = object;

        // 将li元素添加到ul中
        objectList.appendChild(li);
    });
}