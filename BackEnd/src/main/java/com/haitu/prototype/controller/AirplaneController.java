package com.haitu.prototype.controller;

import com.haitu.prototype.common.convention.result.Result;
import com.haitu.prototype.common.convention.result.Results;
import com.haitu.prototype.dto.request.PointReqDTO;
import com.haitu.prototype.service.AirPlaneService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
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
    private final AirPlaneService airPlaneService;

    /**
     *  存储或更新飞机的坐标信息
     * */
    @PostMapping("/upload")
    public Result<Void> uploadCoordinates(@RequestBody PointReqDTO pointRequest) {
        airPlaneService.uploadCoordinates(pointRequest);
        return Results.success();
    }


    /**
     * 删除传入id对应的飞机对象
     * @param uuid
     * */
    @PostMapping("/delete")
    public Result<Void> delete(@RequestParam String uuid){
        airPlaneService.remove(uuid);
        return Results.success();
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
    public void addTrackPoint(@RequestBody PointReqDTO pointRequest){

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
