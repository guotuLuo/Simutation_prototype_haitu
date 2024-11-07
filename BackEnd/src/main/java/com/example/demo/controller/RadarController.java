package com.example.demo.controller;

import com.example.demo.domain.Airplane;
import com.example.demo.domain.Radar;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/radars")
public class RadarController {

    @Autowired
    private HashMap<String, Airplane> airplaneHashMap;

    @Autowired
    private HashMap<String, Radar> radarHashMap;

    @GetMapping ("/scan")
    public ResponseEntity<HashMap<String, Airplane>> coordinatesForRadar() {
        // 返回整个 HashMap，Spring 会自动将其序列化为 JSON 格式
        for (String s : airplaneHashMap.keySet()) {
            System.out.println(s);
        }
        return ResponseEntity.ok(airplaneHashMap);
    }

    @DeleteMapping("/delete")
    public void delete(String uuid){
        radarHashMap.remove(uuid);
    }
}
