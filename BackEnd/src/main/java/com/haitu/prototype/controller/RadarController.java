package com.haitu.prototype.controller;

import com.haitu.prototype.common.convention.result.Result;
import com.haitu.prototype.common.convention.result.Results;
import com.haitu.prototype.dao.entity.Airplane;
import com.haitu.prototype.dao.entity.Point;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

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
}
