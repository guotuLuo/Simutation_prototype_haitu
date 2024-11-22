package com.haitu.prototype.toolkit;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

public class XMLParser {
    // 根据XML中的类型转换为Java类型
    public static String getJavaType(String xmlType) {
        return switch (xmlType) {
            case "unsigned short", "short" -> "short";
            case "unsigned int" -> "int";
            case "unsigned long long" -> "long";
            default -> "String";
        };
    }

    public static String parseDoc2Class(StringBuilder content) throws ParserConfigurationException, IOException, SAXException {
        // 解析 XML 文件内容
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();

        // 创建 ByteArrayInputStream，将字符串内容转换为 InputStream
        InputStream inputStream = new ByteArrayInputStream(content.toString().getBytes(StandardCharsets.UTF_8));

        Document doc = builder.parse(inputStream);
        // 打印解析后的 Document 对象
        if (doc != null) {
            System.out.println("XML 解析成功!");
        } else {
            System.out.println("XML 解析失败，doc 为空！");
        }
        assert doc != null;
        Element rootElement = doc.getDocumentElement();
        // 获取<Parameter>节点并解析每个子节点
        NodeList paramList = rootElement.getElementsByTagName("Parameter").item(0).getChildNodes();

        // 生成Java类代码
        StringBuilder classContent = new StringBuilder();
        classContent.append("package com.haitu.prototype.dto.response;\n");
        classContent.append("import lombok.Data;\n" +
                "\n" +
                "@Data\n");
        classContent.append("public class FormDataRespDTO {\n");
        classContent.append("    private long batchId; \n");

        for (int i = 0; i < paramList.getLength(); i++) {
            Node node = paramList.item(i);

            // 确保节点是一个元素
            if (node.getNodeType() == Node.ELEMENT_NODE) {
                Element param = (Element) node;

                // 获取name和type属性
                String paramName = param.getAttribute("name");
                String paramType = param.getAttribute("type");

                // 根据类型生成对应的Java类型
                String javaType = getJavaType(paramType);

                // 生成成员变量
                classContent.append("    private ").append(javaType).append(" ").append(paramName).append(";\n");
            }
        }

        // 结束类定义
        classContent.append("}\n");
        return classContent.toString();
    }
}
