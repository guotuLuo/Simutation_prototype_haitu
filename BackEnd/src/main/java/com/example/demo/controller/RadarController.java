package com.example.demo.controller;

import com.example.demo.domain.Airplane;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@RequestMapping("/radars")
public class RadarController {
    @Autowired
    private HashMap<String, Airplane> airplaneHashMap;

    @PostMapping("/scan")
    public ResponseEntity<String> coordinatesForRadar(){
        String res = "";
        for (String s : airplaneHashMap.keySet()) {
            res += s;
            res += "\\";
        }
        return ResponseEntity.ok(res);
    }
}
