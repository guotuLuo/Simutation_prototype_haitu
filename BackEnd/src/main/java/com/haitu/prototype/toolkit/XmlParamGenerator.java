package com.haitu.prototype.toolkit;

import com.haitu.prototype.dao.entity.XMLParam;
import com.haitu.prototype.dto.response.FormDataRespDTO;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

public class XmlParamGenerator {

    public static void main(String[] args) {
        // 使用 FormDataRespDTO 自动生成 XMLParam 列表
        List<XMLParam> params = generateParamsFromClass(FormDataRespDTO.class);

        // 输出生成的 XMLParam
        params.forEach(param -> System.out.printf("Name: %s, Type: %s, Offset: %d, Resolution: %d%n",
                param.getName(), param.getType(), param.getOffset(), param.getResolution()));
    }

    public static List<XMLParam> generateParamsFromClass(Class<?> clazz) {
        List<XMLParam> params = new ArrayList<>();
        Field[] fields = clazz.getDeclaredFields();

        int offset = 0; // 初始偏移量为 0

        for (Field field : fields) {
            String name = field.getName();
            String type = mapJavaTypeToXmlType(field.getType());
            if (type == null) {
                throw new IllegalArgumentException("Unsupported field type: " + field.getType().getSimpleName());
            }
            int size = getFieldSize(type);
            params.add(new XMLParam(name, type, offset, 1)); // 假设分辨率为 1
            offset += size; // 累计偏移量
        }

        return params;
    }

    // 映射 Java 类型到 XML 类型
    private static String mapJavaTypeToXmlType(Class<?> javaType) {
        if (javaType == short.class) {
            return "unsigned short";
        } else if (javaType == int.class) {
            return "unsigned int";
        } else if (javaType == long.class) {
            return "unsigned long long";
        } else {
            return null; // 不支持的类型
        }
    }

    // 获取字段类型的大小（字节数）
    private static int getFieldSize(String type) {
        return switch (type) {
            case "unsigned short" -> 2; // short 占 2 字节
            case "unsigned int" -> 4; // int 占 4 字节
            case "unsigned long long" -> 8; // long 占 8 字节
            default -> throw new IllegalArgumentException("Unsupported field type: " + type);
        };
    }
}