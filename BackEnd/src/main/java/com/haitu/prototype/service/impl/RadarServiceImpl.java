package com.haitu.prototype.service.impl;

import com.haitu.prototype.dao.entity.Airplane;
import com.haitu.prototype.dao.entity.Point;
import com.haitu.prototype.dto.request.FormSettingReqDTO;
import com.haitu.prototype.dto.response.FormDataRespDTO;
import com.haitu.prototype.service.KafkaConsumerService;
import com.haitu.prototype.service.RadarService;
import com.haitu.prototype.toolkit.XMLParser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.FileWriter;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class RadarServiceImpl implements RadarService {
    private final HashMap<String, List<Point>> pointList;
    private final KafkaConsumerService kafkaConsumerService;
    @Override
    public String uploadData(MultipartFile file) {
        try {
            // 检查是否上传了文件
            if (file.isEmpty()) {
                return "未上传文件";
            }

            // 读取文件内容为字符串
            StringBuilder content = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    content.append(line).append("\n");
                }
            }
            // 解析获得xml文件内容
            String classContent = XMLParser.parseDoc2Class(content);
            // 目标路径
            String currentPath = Objects.requireNonNull(this.getClass().getResource("/")).getPath();
            String javaFileName = currentPath + "../../src/main/java/com/haitu/prototype/dto/response/FormDataRespDTO.java";;
            // 保存为Java文件
            try (FileWriter writer = new FileWriter(javaFileName)) {
                writer.write(classContent);
                System.out.println("Java类文件已生成: " + javaFileName);
            }
            return "文件上传并成功生成 Java 类: FormDataRespDTO";
        } catch (Exception e) {
            return "文件上传失败：" + e.getMessage();
        }
    }


    @Override
    public List<Airplane> coordinatesForRadar() {
        List<Airplane> list = new ArrayList<>();
        for (String s : pointList.keySet()) {
            List<Point> points = pointList.get(s);
            if(!points.isEmpty()){
                Airplane airplane = new Airplane(s, points.get(points.size() - 1).lat, points.get(points.size() - 1).lon);
                list.add(airplane);
            }
        }
        return list;
    }

    @Override
    public void remove(String uuid) {
        System.out.println("删除雷达： " + uuid);
        pointList.remove(uuid);
    }

    /**
     * 消费者是否永远不会退出?
     * */
    @Override
    public FormDataRespDTO receiveData(FormSettingReqDTO formSettingParam) {
        // 模拟传输数据
        kafkaConsumerService.startConsuming(formSettingParam);
        return null;
    }

    @Override
    public void refuseData() {
        kafkaConsumerService.stopConsuming();
    }
}
