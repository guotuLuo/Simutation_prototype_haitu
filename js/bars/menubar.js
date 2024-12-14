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
            // 获取XML模板
            const xmlDoc = createXMLFile();
            let protoNum = 0;
            // 获取information的tag
            const informationElement = xmlDoc.getElementsByTagName("information")[0];
            // 设置文件名和文件id
            informationElement.getElementsByTagName("name")[0].textContent = document.getElementsByClassName('title')[0].textContent;
            informationElement.getElementsByTagName("id")[0].textContent = generateUUID();

            // components标签里面的变量设置
            const componentElement = xmlDoc.getElementsByTagName("components")[0];
            // scene标签里面的变量设置
            const sceneElement = xmlDoc.getElementsByTagName("scene")[0];

            componentManager.instances.forEach((classNameMap, itemType) => {
                classNameMap.forEach((instanceMap, className) => {
                        // 创建并添加 <object> 元素 这里的添加元素组件列表的所有元素
                        const tempElement = xmlDoc.createElement(itemType);
                        tempElement.setAttribute("name", className);
                        tempElement.setAttribute("id", itemType + generateUUID());
                        componentElement.appendChild(tempElement);
                        instanceMap.forEach((instance, instanceName) => {
                            protoNum++;
                            const itemElement= xmlDoc.createElement('item');
                            itemElement.setAttribute('posx', instance.getLat());
                            itemElement.setAttribute('posy', instance.getLng());
                            itemElement.setAttribute('type', instance.getItemType());
                            itemElement.setAttribute('id', instance.getName());
                            sceneElement.appendChild(itemElement);
                        })
                    }
                )
            });


            // envi标签里面的变量设置
            const enviElement = xmlDoc.getElementsByTagName("envi")[0];
            const lat = document.getElementById('map')._leafletMap.getCenter().lat;
            const lng = document.getElementById('map')._leafletMap.getCenter().lng;
            enviElement.setAttribute('proto_num', protoNum);
            enviElement.setAttribute('clutter_type', document.getElementById('dropDownClutterType').value);
            enviElement.setAttribute('thread_num', document.getElementById('threadNum').value);
            enviElement.setAttribute('timer_clkrate', document.getElementById('timeClkRate').value);
            // TODO 态势根目录路径，暂时不知道设置成什么
            enviElement.setAttribute('ssc_root', '');
            enviElement.setAttribute('timer_clkrate', document.getElementById('timeClkRate').value);
            // TODO 海图环境类型，暂时不知道设置成什么
            enviElement.setAttribute('type', 'SDP_RCT_SEA');
            enviElement.setAttribute('ip', document.getElementById('IP').value);
            enviElement.setAttribute('clutter_model', document.getElementById('dropDownClutterModel').value);
            enviElement.setAttribute('time_scalar', document.getElementById('timeScalar').value);
            enviElement.setAttribute('Origin', '(' + lat + ',' + lng + ')');
            enviElement.setAttribute('clutter_grade', document.getElementById('clutterGrade').value);
            enviElement.setAttribute('refresh', document.getElementById('refresh').value);
            // proto标签里面的变量设置
            const protoElement = xmlDoc.getElementsByTagName("proto")[0];
            componentManager.instances.forEach((classNameMap, itemType) => {
                classNameMap.forEach((instanceMap, className) => {
                        // 创建并添加 <object> 元素 这里的添加元素组件列表的所有元素
                        instanceMap.forEach((instance, instanceName) => {
                            protoNum++;
                            const itemElement= xmlDoc.createElement('item');
                            itemElement.setAttribute('type_name', instance.getItemType());
                            itemElement.setAttribute('ipoint', String(instance.getTrack().length));
                            itemElement.setAttribute('rcs', instance.getRcs());
                            itemElement.setAttribute('model', instance.getModel());
                            itemElement.setAttribute('pos', instance.getTrack().map(([lat, lng]) => `(${lat}, ${lng})`).join(';'));
                            // TODO proto_boot_delay 不知道是什么，先设置成0
                            itemElement.setAttribute('proto_boot_delay', '0');
                            itemElement.setAttribute('proto_use', instance.getUse());
                            itemElement.setAttribute('rcs_file', instance.getRCSFile());
                            itemElement.setAttribute('acceleration', instance.getAcceleration());
                            itemElement.setAttribute('speed', instance.getSpeed());
                            let typeString;
                            switch (instance.getItemType()) {
                                case 'object':
                                    typeString = "SYS_PROTO_TARGET";
                                    break;
                                case 'radar':
                                    typeString = "SYS_PROTO_RADAR";
                                    break;
                                case 'reconnoissance':
                                    typeString = "SYS_PROTO_ECM";
                                    break;
                                case 'jamming':
                                    typeString = "SYS_PROTO_JAM";
                                    break;
                                default:
                                    typeString = 'Unknown Type';
                            }
                            itemElement.setAttribute('type', typeString);
                            itemElement.setAttribute('identity', instance.getIdentity());
                            itemElement.setAttribute('nBatch', instance.getBatch());
                            itemElement.setAttribute('name', instance.getName());
                            itemElement.setAttribute('status', instance.getStatus());
                            itemElement.setAttribute('band1', instance.getBand1());
                            protoElement.appendChild(itemElement);
                        })
                    }
                )
            });
            saveXMLToFile(xmlDoc);
        });
    });
});

