// 获取列表项和属性表单
const objectList = document.getElementById('objectList');
const objectNameInput = document.getElementById('objectName');
const objectTypeInput = document.getElementById('objectType');

function addObjectToList(component) {
    // 创建新的 li 元素
    const li = document.createElement('li');
    li.classList.add('object-item');
    li.setAttribute(`data-name`, component.getName());
    li.setAttribute(`data-className`, component.getClassName());
    li.setAttribute(`data-itemType`, component.getItemType());

    li.textContent = li.getAttribute("data-name");

    // 添加点击事件监听
    li.addEventListener('click', () => {
        // 更新表单内容
        objectNameInput.value = li.getAttribute("data-name");
        objectTypeInput.value = li.getAttribute("data-itemType");
    });

    // 将新的 li 元素添加到 objectList 中
    objectList.appendChild(li);
}

// 删除一个对象项
function removeObjectFromList(itemType, className, name) {
    // 获取所有的 li 元素
    const items = objectList.querySelectorAll('.object-item');
    // 遍历所有的 li 元素，找到匹配的并删除
    items.forEach(item => {
        console.log("item.getAttribute('data-name'):", item.getAttribute("data-name"));
        console.log("name:", name);

        const isNameEqual = item.getAttribute("data-name").trim() === name;
        console.log("Is name equal:", isNameEqual);

        const isClassEqual = item.getAttribute("data-className").trim() === className;
        console.log("Is className equal:", isClassEqual);

        const isTypeEqual = item.getAttribute("data-itemType").trim() === itemType;
        console.log("Is itemType equal:", isTypeEqual);

        if (isNameEqual && isClassEqual && isTypeEqual) {
            console.log("Match found, removing item");
            objectList.removeChild(item);
        }
    });
}











