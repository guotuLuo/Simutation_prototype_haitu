package com.haitu.prototype.controller;

import com.haitu.prototype.common.convention.result.Result;
import com.haitu.prototype.common.convention.result.Results;
import com.haitu.prototype.dao.entity.Point;
import com.haitu.prototype.dto.request.PointRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.*;
@RestController
@Slf4j
@RequiredArgsConstructor



/**
 * 实时接收前端飞机上传的经纬度坐标
 * @param pointRequest
 * @return Result<String>
 * */
@RequestMapping("/airplanes")
public class AirplaneController {

    /**
     * */
    private final HashMap<String, List<Point>> pointList;
    @PostMapping("/upload")
    public Result<String> uploadCoordinates(@RequestBody PointRequest pointRequest) {
        // 存储或更新飞机的坐标信息
        Point point = new Point(pointRequest.getLat(), pointRequest.getLon());
        String id = pointRequest.getId();
        if(!pointList.containsKey(id)){
            pointList.put(id, new ArrayList<>());
        }
        pointList.get(id).add(point);
        log.info("接收到飞机 " + id + " 的坐标: "
                + "纬度 = " + point.getLat() + ", 经度 = " + point.getLon());
        return Results.success("已接收到飞机坐标");
    }


    /**
     * 删除传入id对应的飞机对象
     * @param uuid
     * */
    @PostMapping("/delete")
    public void delete(@RequestParam String uuid){
        System.out.println("删除飞机： " + uuid);
        pointList.remove(uuid);
    }

    /**
     * 根据uuid修改名称
     * @param uuid, name
     * */
    @PostMapping("/editName")
    public void editName(String uuid, String name){

    }

    /**
     * 增加点迹
     * */
    @PostMapping("/addTrackPoint")
    public void addTrackPoint(@RequestBody PointRequest pointRequest){

    }
    /**
     * 删除点迹
     * */
    @DeleteMapping("/deleteTrackPoint")
    public void deleteTrackPoint(String uuid, String name){

    }

    /**
     * 删除所有点迹
     * */
    @DeleteMapping("/deleteAllTrackPoints")
    public void deleteALLTrackPoints(String uuid, String name){

    }


}
