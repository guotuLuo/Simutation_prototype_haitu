package com.haitu.prototype.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.haitu.prototype.dao.entity.Airplane;
import com.haitu.prototype.dao.entity.Point;
import com.haitu.prototype.dao.entity.Radar;
import com.haitu.prototype.dto.request.FormSettingReqDTO;
import com.haitu.prototype.dto.request.RadarReqDTO;
import com.haitu.prototype.dto.response.FormDataRespDTO;
import com.haitu.prototype.dto.response.RadarScanRespDTO;
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
    private final HashMap<String, Airplane> airplaneHashMap;
    private final HashMap<String, Radar> radarHashMap;
    private final KafkaConsumerService kafkaConsumerService;
    /**
     * 上传雷达坐标
     * */
    @Override
    public void uploadRadarCoordinates(RadarReqDTO radarReqDTO) {
        String id = radarReqDTO.getId();
        if(!radarHashMap.containsKey(id)){
            radarHashMap.put(id, BeanUtil.toBean(radarReqDTO, Radar.class));
        }
    }

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

    /**
     * 获取当前内存中所有飞机对象
     * */

    @Override
    public List<RadarScanRespDTO> coordinatesForRadar() {
        List<RadarScanRespDTO> list = new ArrayList<>();
        for (String s : airplaneHashMap.keySet()) {
            Airplane bean = BeanUtil.toBean(airplaneHashMap.get(s), Airplane.class);
            List<Point> track = bean.getTrack();
            if(track != null && !track.isEmpty()){
                list.add(new RadarScanRespDTO(s, track.get(track.size() - 1).getLat(), track.get(track.size() - 1).getLon()));
            }
        }
        return list;
    }

    /**
     * 删除雷达
     * */
    @Override
    public void remove(String uuid) {
        System.out.println("删除雷达： " + uuid);
        radarHashMap.remove(uuid);
    }

    /**
     * 连接websocket, 将kafka数据传输到前端
     * */
    @Override
    public FormDataRespDTO receiveData(FormSettingReqDTO formSettingParam) {
        // 模拟传输数据
        kafkaConsumerService.startConsuming(formSettingParam);
        return null;
    }


    /**
     * 断开websocket传输数据
     * */
    @Override
    public void refuseData() {
        kafkaConsumerService.stopConsuming();
    }
}
