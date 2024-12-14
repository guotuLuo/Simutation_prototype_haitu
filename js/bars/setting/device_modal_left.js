const objectList = document.getElementById('objectList');
let selectedLi = null; // Store the currently selected li

// 统一的事件处理器
function saveHandler() {
    if (!selectedLi) return;

    let selectedComponent = componentManager.getInstance(
        selectedLi.getAttribute('data-itemType'),
        selectedLi.getAttribute('data-className'),
        selectedLi.getAttribute('data-name')
    );

    const identity = document.querySelector('#objectIdentity input:checked').value;
    const model = document.getElementById('objectModel').value;
    const speed = document.getElementById('objectSpeed').value;
    const rcs = document.getElementById('objectRCS').value;
    const status = document.getElementById('dropDownDevice').value;
    const track = document.getElementById('objectTrack').textContent.split(';').map(point => {
        const [lat, lng] = point.trim().slice(1, -1).split(',').map(Number);
        return [parseFloat(lat.toFixed(5)), parseFloat(lng.toFixed(5))];
    });
    // 获取选中的频段并更新 selected-values
    const selectedBands = Array.from(document.querySelectorAll('.dropdown .options input[type="checkbox"]'))
        .filter(checkbox => checkbox.checked)
        .map(checkbox => {
            return checkbox.closest('label').textContent.trim();
        });

    // 更新 selected-values 内容
    const selectedValuesContainer = document.querySelector('.selected .selected-values');
    selectedValuesContainer.textContent = selectedBands.join(' ');

    const band1 = Array.from(document.querySelectorAll('.dropdown .options input[type="checkbox"]'))
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value)  // 显式返回 checkbox.value
        .join(' ');
    console.log(band1);



    // 更新 component 实例
    selectedComponent.setIdentity(identity);
    selectedComponent.setModel(model);
    selectedComponent.setRcs(rcs);
    selectedComponent.setStatus(status);
    selectedComponent.setTrack(track);
    selectedComponent.setBand1(band1);

    selectedComponent.setSpeed(speed); // Reset the speed for these types

    // 更新 li 的 data 属性
    selectedLi.setAttribute('data-identity', identity);
    selectedLi.setAttribute('data-model', model);
    selectedLi.setAttribute('data-speed', speed);
    selectedLi.setAttribute('data-rcs', rcs);
    selectedLi.setAttribute('data-status', status);
    selectedLi.setAttribute('data-track', track.map(coord => `(${coord[0]}, ${coord[1]})`).join(';'));
    selectedLi.setAttribute('data-band1', band1);
}

function resetHandler() {
    if (!selectedLi) return;

    let selectedComponent = componentManager.getInstance(
        selectedLi.getAttribute('data-itemType'),
        selectedLi.getAttribute('data-className'),
        selectedLi.getAttribute('data-name')
    );

    // 重置 component 实例的属性
    selectedComponent.setIdentity(2);
    selectedComponent.setModel('dgn');
    selectedComponent.setRcs(1000);
    selectedComponent.setStatus(0);
    selectedComponent.setTrack([[parseFloat(selectedComponent.getLat().toFixed(5)), parseFloat(selectedComponent.getLng().toFixed(5))]]);
    selectedComponent.setBand1('');

    // 对于 object 和 reconnoissance，重置速度和轨迹
    if (selectedComponent.getItemType() === 'object' || selectedComponent.getItemType() === 'reconnoissance') {
        selectedComponent.setSpeed(0); // Reset speed for these types
        selectedComponent.deleteRoute();
    }

    // 更新表单内容
    document.querySelector('#objectIdentity input[value="2"]').checked = true;
    document.getElementById('objectModel').value = 'dgn';
    document.getElementById('objectSpeed').value = 0;
    document.getElementById('objectRCS').value = 1000;
    document.getElementById('dropDownDevice').value = 0;
    document.getElementById('objectKeyPointNumber').textContent = 1;
    document.getElementById('objectTrack').textContent = `(${selectedComponent.getLat().toFixed(5)}, ${selectedComponent.getLng().toFixed(5)})`;
    // 取消所有频段选择
    document.querySelectorAll('.dropdown .options input[type="checkbox"]').forEach((checkbox) => {
        checkbox.checked = false; // 取消所有频段选择
    });
    document.querySelector('.selected .selected-values').textContent = ''; // 清空显示的频段

    // 更新 li 的 data 属性
    selectedLi.setAttribute('data-identity', selectedComponent.getIdentity());
    selectedLi.setAttribute('data-model', selectedComponent.getModel());
    selectedLi.setAttribute('data-speed', selectedComponent.getSpeed());
    selectedLi.setAttribute('data-rcs', selectedComponent.getRcs());
    selectedLi.setAttribute('data-status', selectedComponent.getStatus());
    selectedLi.setAttribute('data-track', `(${selectedComponent.getLat().toFixed(5)}, ${selectedComponent.getLng().toFixed(5)})`);
    selectedLi.setAttribute('data-band1', '');
}



function addObjectToList(component) {
    // 创建新的 li 元素
    const li = document.createElement('li');
    li.classList.add('object-item');
    li.setAttribute('data-name', component.getName());
    li.setAttribute('data-className', component.getClassName());
    li.setAttribute('data-itemType', component.getItemType());
    li.setAttribute('data-nBatch', component.getBatch());
    li.setAttribute('data-identity', component.getIdentity());
    li.setAttribute('data-model', component.getModel());
    li.setAttribute('data-speed', component.getSpeed());
    li.setAttribute('data-rcs', component.getRcs());
    li.setAttribute('data-rcsFile', component.getRCSFile());
    li.setAttribute('data-status', component.getStatus());
    li.setAttribute('data-use', component.getUse());
    li.setAttribute('data-band1', component.getBand1());

    let track = component.getTrack();
    if (track.length > 0) {
        const trackString = track
            .map(([lat, lng]) => `(${lat}, ${lng})`)
            .join(';');
        li.setAttribute('data-track', trackString);
    } else {
        li.setAttribute('data-track', '');
    }

    li.setAttribute('data-keyPointNumber', String(component.getTrack().length));
    li.textContent = li.getAttribute('data-name');

    // 添加点击事件监听
    li.addEventListener('click', () => {
        selectedLi = li; // 记录当前选择的 li

        let selectedComponent = componentManager.getInstance(
            li.getAttribute('data-itemType'),
            li.getAttribute('data-className'),
            li.getAttribute('data-name')
        );

        // 更新表单内容
        document.getElementById('objectName').textContent = selectedComponent.getName();
        document.getElementById('objectType').textContent = selectedComponent.getClassName();
        document.getElementById('objectBatch').textContent = selectedComponent.getBatch();
        document.querySelector(`#objectIdentity input[value="${selectedComponent.getIdentity()}"]`).checked = true;
        document.getElementById('objectModel').value = selectedComponent.getModel();
        document.getElementById('objectSpeed').value = selectedComponent.getSpeed();
        document.getElementById('objectRCS').value = selectedComponent.getRcs();
        document.getElementById('dropDownDevice').value = selectedComponent.getStatus();
        document.getElementById('dropDownPrototype').setAttribute('data-value', selectedComponent.getUse());
        document.getElementById('objectKeyPointNumber').textContent = String(selectedComponent.getTrack().length);
        document.getElementById('objectTrack').innerHTML = selectedComponent.getTrack().map(([lat, lng]) => `(${parseFloat(lat).toFixed(5)}, ${parseFloat(lng).toFixed(5)})`).join('; <br>');
        document.querySelectorAll('.dropdown .options input[type="checkbox"]').forEach((checkbox) => {
            const band1 = selectedComponent.getBand1();
            if (band1 && band1.trim() !== '') {
                const selectedBands = band1.split(' ').map(band => band.trim()).filter(Boolean); // 去除空元素
                checkbox.checked = selectedBands.includes(checkbox.value); // 设置选中状态
            } else {
                checkbox.checked = false; // 如果 band1 为空，则不选中任何复选框
            }
        });

        // 调用函数来控制 speed 输入框
        updateFormFields(selectedComponent);
        updateSelectedValues();

        // 绑定事件监听器
        const saveButton = document.getElementById('protoSaveButton');
        const resetButton = document.getElementById('protoResetButton');

        // 移除之前的事件，确保不会重复绑定
        saveButton.removeEventListener('click', saveHandler);
        resetButton.removeEventListener('click', resetHandler);

        // 绑定新的事件处理器
        saveButton.addEventListener('click', saveHandler);
        resetButton.addEventListener('click', resetHandler);
    });

    // 将新的 li 元素添加到 objectList 中
    objectList.appendChild(li);
}


// 在更新表单时控制 speed 输入框的禁用状态
function updateFormFields(selectedComponent) {
    const speedInput = document.getElementById('objectSpeed');
    if (selectedComponent.getItemType() !== 'object' && selectedComponent.getItemType() !== 'reconnoissance') {
        speedInput.disabled = true; // Disable speed input for other types
    } else {
        speedInput.disabled = false; // Enable speed input for object and reconnoissance
    }
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











