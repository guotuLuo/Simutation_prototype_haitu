function customDialog(button) {
    // 禁用页面所有点击事件
    disablePageInteractions();

    // 获取按钮的位置和尺寸
    const rect = button.getBoundingClientRect();
    const mouseX = rect.left + rect.width;  // 将对话框放在按钮右侧
    const mouseY = rect.top;  // 将对话框放在按钮上方，距离按钮上方50px

    // 创建自定义对话框
    const dialog = document.createElement('div');
    dialog.classList.add('custom-dialog');
    dialog.style.left = `${mouseX}px`;
    dialog.style.top = `${mouseY}px`;

    // 创建输入框容器
    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');

    // 创建输入框
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '请输入新项名称';
    inputContainer.appendChild(input);

    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    // 创建确认按钮
    const confirmButton = document.createElement('button');
    confirmButton.textContent = '确认';

    // 创建取消按钮
    const cancelButton = document.createElement('button');
    cancelButton.textContent = '取消';

    // 将按钮添加到容器中
    buttonContainer.appendChild(confirmButton);
    buttonContainer.appendChild(cancelButton);

    // 将输入框容器和按钮容器添加到对话框中
    dialog.appendChild(inputContainer);
    dialog.appendChild(buttonContainer);

    // 将对话框添加到页面中
    document.body.appendChild(dialog);

    // 聚焦到输入框
    input.focus();

    // 创建一个 Promise 来返回用户的输入结果
    return new Promise((resolve, reject) => {
        // 点击确认按钮
        confirmButton.addEventListener('click', () => {
            const name = input.value.trim();
            if (name) {
                resolve(name);  // 返回用户输入的名称
            } else {
                console.log('用户未输入名称');
                resolve("");  // 如果用户没有输入名称，返回空字符串
            }

            // 关闭对话框并恢复点击事件
            dialog.remove();
            enablePageInteractions();
        });

        // 点击取消按钮
        cancelButton.addEventListener('click', () => {
            console.log('用户取消操作');
            resolve("");  // 如果用户点击取消，返回空字符串

            // 关闭对话框并恢复点击事件
            dialog.remove();
            enablePageInteractions();
        });

        window.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {  // 按下 Enter 键
                confirmButton.click();  // 触发确认按钮的点击事件
            } else if (event.key === 'Escape') {  // 按下 Escape 键
                cancelButton.click();  // 触发取消按钮的点击事件
            }
        });
    });
}
