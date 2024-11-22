package com.haitu.prototype.toolkit;

import com.haitu.prototype.dao.entity.XMLParam;
import com.haitu.prototype.dto.response.FormDataRespDTO;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class XmlMessageHandler {


    public static void main(String[] args) {
        // 定义参数，按 XML 顺序组织
        List<XMLParam> params = XmlParamGenerator.generateParamsFromClass(FormDataRespDTO.class);

        // 实际值
        long[] actualValues = {12121221L, 100, 25, 5000, 180, 75, 42, -12, 1234567890123456789L};

        // 生成二进制消息
        byte[] message = generateMessage(params, actualValues);
        System.out.println("Generated Message (Hex): " + bytesToHex(message));

        // 解析消息
        System.out.println("Parsed Fields:");
        Map<String, Object> stringObjectMap = parseSingleStructToMap(params, message, 0);
        for (String s : stringObjectMap.keySet()) {
            System.out.println(s);
        }
    }

    // 生成消息
    public static byte[] generateMessage(List<XMLParam> params, long[] actualValues) {
        // 计算消息总长度
        int messageLength = 0;
        for (XMLParam param : params) {
            int fieldEnd = param.getOffset() + getFieldSize(param.getType());
            if (fieldEnd > messageLength) {
                messageLength = fieldEnd;
            }
        }

        // 创建字节缓冲区
        ByteBuffer buffer = ByteBuffer.allocate(messageLength);
        buffer.order(ByteOrder.LITTLE_ENDIAN); // 小端存储

        // 填充字段数据
        for (int i = 0; i < params.size(); i++) {
            XMLParam param = params.get(i);
            long storedValue = actualValues[i] / param.getResolution(); // 存储的值需除以 resolution
            switch (param.getType()) {
                case "unsigned short", "short":
                    buffer.putShort(param.getOffset(), (short) storedValue);
                    break;
                case "unsigned int":
                    buffer.putInt(param.getOffset(), (int) storedValue);
                    break;
                case "unsigned long long":
                    buffer.putLong(param.getOffset(), storedValue);
                    break;
                default:
                    throw new IllegalArgumentException("Unsupported field type: " + param.getType());
            }
        }

        return buffer.array();
    }

    // 解析消息
    public static Map<String, Object> parseSingleStructToMap(List<XMLParam> params, byte[] message, int offset) {
        Map<String, Object> parsedData = new LinkedHashMap<>(); // 保证字段顺序

        ByteBuffer buffer = ByteBuffer.wrap(message);
        buffer.order(ByteOrder.LITTLE_ENDIAN); // 按小端解析

        for (XMLParam param : params) {
            long storedValue = switch (param.getType()) {
                case "unsigned short" -> Short.toUnsignedInt(buffer.getShort(offset + param.getOffset()));
                case "short" -> buffer.getShort(offset + param.getOffset());
                case "unsigned int" -> Integer.toUnsignedLong(buffer.getInt(offset + param.getOffset()));
                case "unsigned long long" -> buffer.getLong(offset + param.getOffset());
                default -> throw new IllegalArgumentException("Unsupported field type: " + param.getType());
            };

            // 解析实际值：storedValue * resolution
            long actualValue = storedValue * param.getResolution();
            parsedData.put(param.getName(), actualValue);
        }

        return parsedData;
    }

    public static List<Map<String, Object>> parseMessageToList(List<XMLParam> params, byte[] message, int headSize, int structSize) {
        List<Map<String, Object>> parsedDataList = new ArrayList<>();

        int offset = headSize; // 跳过包头
        while (offset + structSize <= message.length) { // 确保剩余字节足够解析一个结构体
            Map<String, Object> structData = parseSingleStructToMap(params, message, offset);
            parsedDataList.add(structData);
            offset += structSize; // 移动到下一个结构体起始位置
        }

        return parsedDataList;
    }



    // 获取字段类型的大小
    public static int getFieldSize(String type) {
        return switch (type) {
            case "unsigned short", "short" -> 2; // 占用 2 字节
            case "unsigned int" -> 4; // 占用 4 字节
            case "unsigned long long" -> 8; // 占用 8 字节
            default -> throw new IllegalArgumentException("Unsupported field type: " + type);
        };
    }

    // 将字节数组转为十六进制字符串
    public static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}