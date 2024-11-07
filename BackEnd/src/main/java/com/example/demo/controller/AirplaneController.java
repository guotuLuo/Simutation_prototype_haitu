package com.example.demo.controller;

import com.example.demo.domain.Airplane;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@RestController
//@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequestMapping("/airplanes")
public class AirplaneController {

    // 使用 ConcurrentHashMap 来存储每个飞机的坐标信息
    @Autowired
    private HashMap<String, Airplane> airplaneHashMap;

    // 处理飞机坐标上传的 POST 请求
    @PostMapping("/upload")
    public ResponseEntity<String> uploadCoordinates(@RequestBody Airplane airplane) {
        // 存储或更新飞机的坐标信息
        airplaneHashMap.put(airplane.getId(), airplane);

        System.out.println("接收到飞机 " + airplane.getId() + " 的坐标: "
                + "纬度 = " + airplane.getLat() + ", 经度 = " + airplane.getLon());

        return ResponseEntity.ok("飞机坐标已接收");
    }

    @PostMapping("/delete")
    public void delete(@RequestParam String uuid){
        System.out.println("删除飞机： " + uuid);
        airplaneHashMap.remove(uuid);
    }


    // 获取所有飞机的坐标数据（可选，用于前端查询）
}
