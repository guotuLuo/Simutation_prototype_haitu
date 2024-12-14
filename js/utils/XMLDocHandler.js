//格式化xml代码
function formatXml(xmlStr) {
    text = xmlStr;
    //使用replace去空格
    text = '\n' + text.replace(/(<\w+)(\s.*?>)/g, function ($0, name, props) {
        return name + ' ' + props.replace(/\s+(\w+=)/g, " $1");
    }).replace(/>\s*?</g, ">\n<");
    //处理注释
    text = text.replace(/\n/g, '\r').replace(/<!--(.+?)-->/g, function ($0, text) {
        var ret = '<!--' + escape(text) + '-->';
        return ret;
    }).replace(/\r/g, '\n');
    //调整格式	以压栈方式递归调整缩进
    var rgx = /\n(<(([^\?]).+?)(?:\s|\s*?>|\s*?(\/)>)(?:.*?(?:(?:(\/)>)|(?:<(\/)\2>)))?)/mg;
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
        var ret = '\n' + prefix + all;
        return ret;
    });
    var prefixSpace = -1;
    var outputText = output.substring(1);
    //还原注释内容
    outputText = outputText.replace(/\n/g, '\r').replace(/(\s*)<!--(.+?)-->/g, function ($0, prefix, text) {
        if (prefix.charAt(0) == '\r')
            prefix = prefix.substring(1);
        text = unescape(text).replace(/\r/g, '\n');
        var ret = '\n' + prefix + '<!--' + text.replace(/^\s*/mg, prefix) + '-->';
        return ret;
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
    return xmlDoc;
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
    link.download = 'project.xml'; // 文件名，可以自定义

    // 模拟点击下载链接
    link.click();
}
