package com.haitu.prototype.controller;

import com.haitu.prototype.common.convention.result.Result;
import com.haitu.prototype.common.convention.result.Results;
import com.haitu.prototype.dao.entity.Airplane;
import com.haitu.prototype.dao.entity.Point;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/radars")
public class RadarController {
    private final HashMap<String, List<Point>> pointList;

    @GetMapping ("/scan")
    public Result<List<Airplane>> coordinatesForRadar() {
        // 返回整个 HashMap，Spring 会自动将其序列化为 JSON 格式
        List<Airplane> list = new ArrayList<>();
        for (String s : pointList.keySet()) {
            List<Point> points = pointList.get(s);
            if(!points.isEmpty()){
                Airplane airplane = new Airplane(s, points.get(points.size() - 1).lat, points.get(points.size() - 1).lon);
                list.add(airplane);
            }
        }
        return Results.success(list);
    }

    @PostMapping("/delete")
    public void delete(@RequestParam String uuid){
        System.out.println("删除雷达： " + uuid);
        pointList.remove(uuid);
    }

    @PostMapping("/uploadData")
    public Result<String> receiveData(@RequestParam("file") MultipartFile file) {
        try {
            // 检查是否上传了文件
            if (file.isEmpty()) {
                return Results.success("未上传文件");
            }

            // 读取文件内容为字符串
            StringBuilder content = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    content.append(line).append("\n");
                }
            }

            // 打印读取到的 XML 内容，确认是否正常
            System.out.println("接收到的 XML 内容:\n" + content);

            // 解析 XML 文件内容
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();

            // 创建 ByteArrayInputStream，将字符串内容转换为 InputStream
            InputStream inputStream = new ByteArrayInputStream(content.toString().getBytes(StandardCharsets.UTF_8));

            // 打印 inputStream 内容
            if (inputStream.available() > 0) {
                System.out.println("InputStream 长度: " + inputStream.available());
            } else {
                System.out.println("InputStream 为空或内容不正确！");
            }

            // 使用 DocumentBuilder 解析 XML 内容
            Document doc = builder.parse(inputStream);

            // 打印解析后的 Document 对象
            if (doc != null) {
                System.out.println("XML 解析成功!");
            } else {
                System.out.println("XML 解析失败，doc 为空！");
            }

            // 获取根元素
            assert doc != null;
            Element rootElement = doc.getDocumentElement();

            // 获取<Parameter>节点并解析每个子节点
            NodeList paramList = rootElement.getElementsByTagName("Parameter").item(0).getChildNodes();

            // 生成Java类代码
            StringBuilder classContent = new StringBuilder();
            classContent.append("package com.haitu.prototype.dao.entity;\n");
            classContent.append("import lombok.Data;\n" +
                    "\n" +
                    "@Data\n");
            classContent.append("public class xmlParser {\n");

            for (int i = 0; i < paramList.getLength(); i++) {
                Node node = paramList.item(i);

                // 确保节点是一个元素
                if (node.getNodeType() == Node.ELEMENT_NODE) {
                    Element param = (Element) node;

                    // 获取name和type属性
                    String paramName = param.getAttribute("name");
                    String paramType = param.getAttribute("type");

                    // 打印调试信息
                    System.out.println("节点名称: " + param.getNodeName());
                    System.out.println("参数名称: " + paramName);
                    System.out.println("参数类型: " + paramType);

                    // 根据类型生成对应的Java类型
                    String javaType = getJavaType(paramType);

                    // 生成成员变量
                    classContent.append("    private ").append(javaType).append(" ").append(paramName).append(";\n");
                }
            }

            // 结束类定义
            classContent.append("}\n");

            // 目标路径
            String currentPath = Objects.requireNonNull(this.getClass().getResource("/")).getPath();
            String javaFileName = currentPath + "../../src/main/java/com/haitu/prototype/dao/entity/xmlParser.java";;


            // 保存为Java文件
            try (FileWriter writer = new FileWriter(javaFileName)) {
                writer.write(classContent.toString());
                System.out.println("Java类文件已生成: " + javaFileName);
            }

            return Results.success("文件上传并成功生成 Java 类: xmlParser");

        } catch (Exception e) {
            return Results.success("文件上传失败：" + e.getMessage());
        }
    }

    // 根据XML中的类型转换为Java类型
    private static String getJavaType(String xmlType) {
        switch (xmlType) {
            case "unsigned short":
                return "short";
            case "unsigned int":
                return "int";
            case "unsigned long long":
                return "long";
            case "short":
                return "short";
            default:
                return "String";
        }
    }
}
