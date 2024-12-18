//格式化xml代码
function formatXml(xmlStr) {
    let text = xmlStr;
    //使用replace去空格
    text = '\n' + text.replace(/(<\w+)(\s.*?>)/g, function ($0, name, props) {
        return name + ' ' + props.replace(/\s+(\w+=)/g, " $1");
    }).replace(/>\s*?</g, ">\n<");
    //处理注释
    text = text.replace(/\n/g, '\r').replace(/<!--(.+?)-->/g, function ($0, text) {
        return '<!--' + escape(text) + '-->';
    }).replace(/\r/g, '\n');
    //调整格式	以压栈方式递归调整缩进
    var rgx = /\n(<(([^?]).+?)(?:\s|\s*?>|\s*?(\/)>)(?:.*?(?:(?:(\/)>)|(?:<(\/)\2>)))?)/mg;
    var nodeStack = [];
    var output = text.replace(rgx, function ($0, all, name, isBegin, isCloseFull1, isCloseFull2, isFull1, isFull2) {
        var isClosed = (isCloseFull1 === '/') || (isCloseFull2 === '/') || (isFull1 === '/') || (isFull2 === '/');
        var prefix = '';
        if (isBegin === '!') {//!开头
            prefix = setPrefix(nodeStack.length);
        } else {
            if (isBegin !== '/') {///开头
                prefix = setPrefix(nodeStack.length);
                if (!isClosed) {//非关闭标签
                    nodeStack.push(name);
                }
            } else {
                nodeStack.pop();//弹栈
                prefix = setPrefix(nodeStack.length);
            }
        }
        return '\n' + prefix + all;
    });
    let prefixSpace = -1;
    let outputText = output.substring(1);
    //还原注释内容
    outputText = outputText.replace(/\n/g, '\r').replace(/(\s*)<!--(.+?)-->/g, function ($0, prefix, text) {
        if (prefix.charAt(0) === '\r')
            prefix = prefix.substring(1);
        text = unescape(text).replace(/\r/g, '\n');
        return '\n' + prefix + '<!--' + text.replace(/^\s*/mg, prefix) + '-->';
    });
    outputText = outputText.replace(/\s+$/g, '').replace(/\r/g, '\r\n');
    return outputText;
}

//计算头函数	用来缩进
function setPrefix(prefixIndex) {
    let result = '';
    const span = '    ';//缩进长度
    const output = [];
    for (let i = 0; i < prefixIndex; ++i) {
        output.push(span);
    }
    result = output.join('');
    return result;
}


function createXMLFile(){
    // 创建一个 XML 文档对象
    const xmlDoc = document.implementation.createDocument('', '', null);
    // 创建根元素
    const rootElement = xmlDoc.createElement('project-root');
    xmlDoc.appendChild(rootElement);

    // 创建 <information> 元素
    const informationElement = xmlDoc.createElement('information');
    rootElement.appendChild(informationElement);



    // // 创建并添加 <name> 和 <id> 元素
    const nameElement = xmlDoc.createElement('name');
    informationElement.appendChild(nameElement);

    const idElement = xmlDoc.createElement('id');
    idElement.textContent = ''; // 可以为空，或者填充动态数据
    informationElement.appendChild(idElement);

    // 创建 <components> 元素
    const componentsElement = xmlDoc.createElement('components');
    rootElement.appendChild(componentsElement);



    // 创建 <scene> 元素
    const sceneElement = xmlDoc.createElement('scene');
    rootElement.appendChild(sceneElement);
    const paramElement = xmlDoc.createElement('param');
    rootElement.appendChild(paramElement);

    // 创建envi标签
    const enviElement = xmlDoc.createElement('envi');
    paramElement.appendChild(enviElement);

    // 创建proto标签
    const protoElement = xmlDoc.createElement('proto');
    paramElement.appendChild(protoElement);

    // 获取XML模板
    // 获取information的tag
    // 设置文件名和文件id
    informationElement.getElementsByTagName("name")[0].textContent = document.getElementsByClassName('title')[0].textContent;
    informationElement.getElementsByTagName("id")[0].textContent = generateUUID();

    // components标签里面的变量设置
    const componentElement = xmlDoc.getElementsByTagName("components")[0];

    window.app.componentManager.instances.forEach((classNameMap, itemType) => {
        classNameMap.forEach((instanceMap, className) => {
                // 创建并添加 <object> 元素 这里的添加元素组件列表的所有元素
                const tempElement = xmlDoc.createElement(itemType);
                tempElement.setAttribute("name", className);
                tempElement.setAttribute("id", itemType + generateUUID());
                componentElement.appendChild(tempElement);
                instanceMap.forEach((instance, instanceName) => {
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


    // envi标签里面的变量设置， 保存当前态势所有组件和状态
    const lat = window.app.mapController.map.getCenter().lat;
    const lng = window.app.mapController.map.getCenter().lng;
    enviElement.setAttribute('proto_num', String(window.app.componentManager.instanceNumber));
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
    window.app.componentManager.instances.forEach((classNameMap, itemType) => {
        classNameMap.forEach((instanceMap, className) => {
                // 创建并添加 <object> 元素 这里的添加元素组件列表的所有元素
                instanceMap.forEach((instance, instanceName) => {

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
                    itemElement.setAttribute('band', instance.getBand());
                    itemElement.setAttribute('band1', instance.getBand1());
                    protoElement.appendChild(itemElement);
                })
            }
        )
    });
    return xmlDoc;
}

function parseXML(xmlDoc) {
    window.app.componentManager.reset();
    window.app.sidebar.clearAllItems();
    const rootElement = xmlDoc.getElementsByTagName('project-root')[0];

    // 获取 <information> 中的内容
    const informationElement = rootElement.getElementsByTagName('information')[0];
    const projectName = informationElement.getElementsByTagName('name')[0].textContent;
    // TODO，这里获取id的意义在哪里呢，好像确实没有地方设置
    const projectId = informationElement.getElementsByTagName('id')[0].textContent;

    const titleElement = document.querySelector('.title');
    titleElement.textContent = `${projectName}`;


    // 获取 <components> 中的元素
    processSidebarItems(rootElement, 'nav-radar', 'radar', 'radar');
    processSidebarItems(rootElement, 'nav-reconnoissance', 'reconnoissance', 'reconnoissance');
    processSidebarItems(rootElement, 'nav-object', 'object', 'object');
    processSidebarItems(rootElement, 'nav-jamming', 'jamming', 'jamming');

    // 获取 <scene> 中的元素
    const scene = rootElement.getElementsByTagName('scene')[0];
    const sceneItems = scene.getElementsByTagName('item');
    let array = [];
    Array.from(sceneItems).forEach(item => {
        const posx = parseFloat(item.getAttribute('posx'));
        const posy = parseFloat(item.getAttribute('posy'));
        const itemTye = item.getAttribute('type');
        const instanceName = item.getAttribute('id');


        // 这里是为了还原componentManager的index做准备
        const numberMatch = instanceName.match(/(\d+)$/);
        if (numberMatch && numberMatch[1]) {
            const number = parseInt(numberMatch[1], 10);
            array.push(number);
        }
        const className = instanceName.match(/^\D*/)[0];
        let position = { lat: posx, lng: posy };
        window.app.mapController.addComponent(itemTye, className, instanceName, position);
    });
    window.app.componentManager.resetIndex(array);

    // 获取 <param> 中的 <envi> 和 <proto> 设置
    const param = rootElement.getElementsByTagName('param')[0];
    const enviElement = param.getElementsByTagName('envi')[0];
    const protoElement = param.getElementsByTagName('proto')[0];

    // TODO ssc_root 和 type这两个还没设置

    document.getElementById("simulationCenter").textContent = enviElement.getAttribute("Origin");
    const centre = enviElement.getAttribute("Origin");
    const numbers = centre.match(/\d+/g); // 匹配所有连续的数字
    window.app.toolbar.setCenterWithCentre(numbers[0], numbers[1]);

    document.getElementById("instanceNumber").textContent = enviElement.getAttribute("proto_num");
    document.getElementById("threadNum").value = enviElement.getAttribute("thread_num");
    document.getElementById("dropDownClutterType").value = enviElement.getAttribute("clutter_type");
    document.getElementById("timeScalar").value = enviElement.getAttribute("time_scalar");
    document.getElementById("timeClkRate").value = enviElement.getAttribute("timer_clkrate");
    document.getElementById("dropDownClutterModel").value = enviElement.getAttribute("clutter_model");
    document.getElementById("clutterGrade").value = enviElement.getAttribute("clutter_grade");
    document.getElementById("refresh").value = enviElement.getAttribute("refresh");
    document.getElementById("IP").value = enviElement.getAttribute("ip");



    // TODO protoItem拆包 ipoint可以根据track直接求到, protoBootDelay和type不知道可以用来干嘛
    const protoItems = protoElement.getElementsByTagName('item');
    Array.from(protoItems).forEach(item => {
        const itemType = item.getAttribute('type_name');
        const ipoint = item.getAttribute('ipoint');
        const rcs = item.getAttribute('rcs');
        const model = item.getAttribute('model');
        const posString = item.getAttribute('pos');  // 获取pos属性

        const positions = posString
            .replace(/[()]/g, '') // 去掉括号
            .split(';')           // 按分号分割
            .map(pos => {
                const [lat, lng] = pos.split(',').map(Number); // 分割并转换为数字
                return { lat, lng };
            });

        const protoBootDelay = item.getAttribute('proto_boot_delay');
        const protoUse = item.getAttribute('proto_use');
        const rcsFile = item.getAttribute('rcs_file');
        const acceleration = item.getAttribute('acceleration');
        const speed = item.getAttribute('speed');
        const type = item.getAttribute('type');
        const identity = item.getAttribute('identity');
        const nBatch = item.getAttribute('nBatch');
        const name = item.getAttribute('name');
        const className = name.match(/^\D*/)[0];
        const status = item.getAttribute('status');
        const band = item.getAttribute('band');
        const band1 = item.getAttribute('band1');
        let instance = window.app.componentManager.getInstance(itemType, className, name);
        if(itemType === 'object' || itemType === 'reconnoissance'){
            instance.setTrackAndPaintRoutes(positions);
        }else{
            instance.setBand(band);
        }
        instance.setRcs(rcs);
        instance.setModel(model);
        instance.setUse(protoUse);
        instance.setRCSFile(rcsFile);
        instance.setAcceleration(acceleration);
        instance.setSpeed(speed);
        instance.setIdentity(identity);
        instance.setBatch(nBatch);
        instance.setStatus(status);
        instance.setBand1(band1);
    });
}


function saveXMLToFile(xmlDoc) {
    // 使用 XMLSerializer 将文档序列化为字符串
    const serializer = new XMLSerializer();
    let xmlString = serializer.serializeToString(xmlDoc);
    // 格式化 XML 字符串
    xmlString = formatXml(xmlString);


    // 创建 Blob 对象
    const blob = new Blob([xmlString], { type: 'application/xml' });

    // 创建下载链接
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'project.dpsp'; // 文件名，可以自定义

    // 模拟点击下载链接
    link.click();
}

function handleFileInputChange(event){
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileContent = e.target.result;
            console.log("文件内容:", fileContent);
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(fileContent, "application/xml");

            // 关闭所有子菜单
            const subMenus = document.querySelectorAll('.menu-bar .sub-menu');
            subMenus.forEach(function(menu) {
                menu.style.display = 'none';
            });

            parseXML(xmlDoc);

        };
        reader.readAsText(file);
    }
}


function processSidebarItems(rootElement, buttonId, itemTag, itemType) {
    // 获取 <components> 元素
    const components = rootElement.getElementsByTagName('components')[0];

    // 获取指定标签的子元素
    const items = components.getElementsByTagName(itemTag);

    // 获取对应的按钮
    const button = document.getElementById(buttonId);

    // 遍历子元素，创建子菜单项
    Array.from(items).forEach(item => {
        const name = item.getAttribute('name');
        window.app.sidebar.createSubMenuLi(button, itemType, name);
    });
}

