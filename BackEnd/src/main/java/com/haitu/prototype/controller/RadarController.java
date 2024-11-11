package com.haitu.prototype.controller;

import com.haitu.prototype.dao.entity.Airplane;
import com.haitu.prototype.dao.entity.Radar;
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
        return ResponseEntity.ok(airplaneHashMap);
    }

    @PostMapping("/delete")
    public void delete(@RequestParam String uuid){
        radarHashMap.remove(uuid);
    }
}
