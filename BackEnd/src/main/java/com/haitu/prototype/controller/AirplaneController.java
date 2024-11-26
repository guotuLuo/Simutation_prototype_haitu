package com.haitu.prototype.controller;

import com.haitu.prototype.common.convention.result.Result;
import com.haitu.prototype.common.convention.result.Results;
import com.haitu.prototype.dto.request.AirplaneReqDTO;
import com.haitu.prototype.service.AirPlaneService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
@RestController
@Slf4j
@RequiredArgsConstructor




@RequestMapping("/airplanes")
public class AirplaneController {
    private final AirPlaneService airPlaneService;

    /**
     * 实时接收前端飞机上传的经纬度坐标
     * @param airplaneReqDTO 飞机请求实体
     * @return Result<String>
     * */
    @PostMapping("/uploadCoordinates")
    public Result<Void> uploadAirplaneCoordinates(@RequestBody AirplaneReqDTO airplaneReqDTO) {
        airPlaneService.uploadAirplaneCoordinates(airplaneReqDTO);
        return Results.success();
    }
    /**
     * 删除传入id对应的飞机对象
     * @param uuid 唯一标识符
     * */
    @PostMapping("/delete")
    public Result<Void> delete(@RequestParam String uuid){
        airPlaneService.remove(uuid);
        return Results.success();
    }
    /**
     * 设置飞机速度
     * @param airplaneReqDTO 飞机请求实体
     * */
    @PostMapping("setSpeed")
    public Result<Void> setSpeed(@RequestBody AirplaneReqDTO airplaneReqDTO){
        airPlaneService.setSpeed(airplaneReqDTO);
        return Results.success();
    }
    /**
     * 根据uuid修改名称
     * @param airplaneReqDTO, 飞机请求实体
     * */
    @PostMapping("/editName")
    public  Result<Void> editName(AirplaneReqDTO airplaneReqDTO){
        airPlaneService.editName(airplaneReqDTO);
        return Results.success();
    }
    /**
     * 删除点迹
     * */
    @PostMapping("/deleteTrackPoint")
    public Result<Void> deleteTrackPoint(String uuid){
        airPlaneService.deleteTrackPoint(uuid);
        return Results.success();
    }

    /**
     * 删除所有点迹
     * */
    @PostMapping("/deleteAllTrackPoints")
    public Result<Void> deleteALLTrackPoints(){
        airPlaneService.deleteAllTrackPoint();
        return Results.success();
    }
}
