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

    const enviElement = xmlDoc.createElement('envi');
    paramElement.appendChild(enviElement);

    const protoElement = xmlDoc.createElement('proto');
    paramElement.appendChild(protoElement);


    // 使用 XMLSerializer 将 XML 文档转换为字符串
    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(xmlDoc);
    return xmlDoc;
}
