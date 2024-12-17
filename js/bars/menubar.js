class Menubar {
    constructor() {
        document.getElementById('file-input').addEventListener('change', handleFileInputChange);
    }

    initializeMenubar() {
        const fileMenu = document.querySelector('.menu-bar li:first-child'); // 选择第一个li元素
        const subMenu = fileMenu.querySelector('.sub-menu');

        fileMenu.addEventListener('click', function (event) {
            event.preventDefault();
            if (subMenu.style.display === 'block') {
                subMenu.style.display = 'none';
            } else {
                subMenu.style.display = 'block';
            }
        });

        document.addEventListener('click', function (event) {
            if (!fileMenu.contains(event.target)) {
                subMenu.style.display = 'none';
            }
        });

        const subMenuLinks = document.querySelectorAll('.sub-menu a');
        subMenuLinks.forEach(function (link) {
            link.addEventListener('click', function (event) {
                event.preventDefault(); // 阻止默认链接行为

                if (link.textContent.trim() === "保存文件") {
                    let xmlDoc = createXMLFile();
                    saveXMLToFile(xmlDoc);
                } else if (link.textContent.trim() === "打开文件") {
                    // 阻止点击行为，展开子菜单
                    const parentLi = link.closest('li'); // 获取“打开文件”的父 <li>
                    const subMenu = parentLi.querySelector('.sub-menu'); // 找到“本地打开”和“云端打开”子菜单

                    if (subMenu) {
                        // 切换子菜单显示状态
                        const isSubMenuVisible = subMenu.style.display === "block";
                        document.querySelectorAll('.menu-bar .sub-menu').forEach(menu => {
                            menu.style.display = "none"; // 隐藏其他子菜单
                        });
                        if (!isSubMenuVisible) {
                            subMenu.style.display = "block"; // 显示当前子菜单
                        }
                    }
                } else if (link.textContent.trim() === "本地打开") {
                    // 触发文件上传输入框的点击事件
                    document.getElementById('file-input').click();
                }
            });
        });
    }
}



