document.addEventListener('DOMContentLoaded', function() {
    const fileMenu = document.querySelector('.menu-bar li:first-child'); // 选择第一个li元素
    const subMenu = fileMenu.querySelector('.sub-menu');

    fileMenu.addEventListener('click', function(event) {
        event.preventDefault();
        if (subMenu.style.display === 'block') {
            subMenu.style.display = 'none';
        } else {
            subMenu.style.display = 'block';
        }
    });

    document.addEventListener('click', function(event) {
        if (!fileMenu.contains(event.target)) {
            subMenu.style.display = 'none';
        }
    });

    const subMenuLinks = document.querySelectorAll('.sub-menu a');
    subMenuLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // 阻止默认链接行为
            document.getElementById('saveButton').addEventListener('click', function () {
                // 获取XML模板
                const xmlDoc = createXMLFile();

                // 获取information的tag
                const informationElement = xmlDoc.getElementsByTagName("information")[0];
                // 设置文件名和文件id
                const title = document.getElementsByClassName('title')[0].textContent;
                informationElement.getElementsByTagName("name")[0].setAttribute(title);
                informationElement.getElementsByTagName("id")[0].setAttribute(generateUUID());

                const componentElement = xmlDoc.getElementsByTagName("components")[0];
                const sceneElement = xmlDoc.getElementsByTagName("scene")[0];
                const enviElement = xmlDoc.getElementsByTagName("envi")[0];

                componentManager.instances.forEach((classNameMap, itemType) => {
                    classNameMap.forEach((instanceMap, className) => {
                            // 创建并添加 <object> 元素 这里的添加元素组件列表的所有元素
                            const tempElement = xmlDoc.createElement(itemType);
                            tempElement.setAttribute("name", className);
                            componentElement.appendChild(tempElement);
                            instanceMap.forEach((instance, instanceName) => {
                                const itemElement= xmlDoc.createElement('item');
                                itemElement.setAttribute('posx', instance.position.getLat());
                                itemElement.setAttribute('posy', instance.position.getLng());
                                itemElement.setAttribute('type', itemType);
                                itemElement.setAttribute('id', className);
                                sceneElement.appendChild(itemElement);
                            })
                        }
                    )
                });
            });
        });
    });
});