package com.haitu.prototype.controller;

import com.haitu.prototype.common.convention.result.Result;
import com.haitu.prototype.common.convention.result.Results;
import com.haitu.prototype.dto.request.FormSettingReqDTO;
import com.haitu.prototype.dto.request.RadarReqDTO;
import com.haitu.prototype.dto.response.FormDataRespDTO;
import com.haitu.prototype.dto.response.RadarScanRespDTO;
import com.haitu.prototype.service.RadarService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/radars")
public class RadarController {
    private final RadarService radarService;
    /**
     * 增加雷达
     * */
    @PostMapping("/addRadar")
    public Result<Void> uploadRadarCoordinates(@RequestBody RadarReqDTO radarReqDTO){
        radarService.uploadRadarCoordinates(radarReqDTO);
        return Results.success();
    }
    /**
     * 雷达扫描，返回当前最新捕获点迹
     * */
    @GetMapping ("/scan")
    public Result<List<RadarScanRespDTO>> coordinatesForRadar() {
        return Results.success(radarService.coordinatesForRadar());
    }

    /**
     * 删除雷达
     * */
    @PostMapping("/delete")
    public Result<Void> delete(@RequestParam String uuid){
        radarService.remove(uuid);
        return Results.success();
    }

    /**
     * 解析前端发送的xml文件并生成java类
     * */
    @PostMapping("/uploadData")
    public Result<String> uploadData(@RequestParam("file") MultipartFile file) {
        return Results.success(radarService.uploadData(file));
    }

    /**
     * TODO 怎么实现DDS发送和接收
     * */
    @PostMapping("/receiveData")
    public Result<FormDataRespDTO> receiveData(@RequestBody FormSettingReqDTO formSettingParam){
        return Results.success(radarService.receiveData(formSettingParam));
    }

    /**
     * 关闭接收数据
     * */
    @PostMapping("/refuseData")
    public Result<Void> refuseData(){
        radarService.refuseData();
        return Results.success();
    }
}
