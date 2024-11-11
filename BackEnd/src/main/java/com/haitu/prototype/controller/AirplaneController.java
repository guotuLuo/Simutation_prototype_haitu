package com.haitu.prototype.controller;

import com.haitu.prototype.dao.entity.Airplane;
import com.haitu.prototype.dto.request.PointRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;

@RestController
@RequestMapping("/airplanes")
public class AirplaneController {

    /**
     * 使用 ConcurrentHashMap 来存储每个飞机的坐标信息
     * */
    @Autowired
    private HashMap<String, Airplane> airplaneHashMap;

    /**
     * 实时接收前端飞机上传的经纬度坐标
     * @param pointRequest
     * @return ResponseEntity<String>
     * */
    @PostMapping("/upload")
    public ResponseEntity<String> uploadCoordinates(@RequestBody PointRequest pointRequest) {
        // 存储或更新飞机的坐标信息
        Airplane airplane = new Airplane(pointRequest.getId(), pointRequest.getLat(), pointRequest.getLon());
        airplaneHashMap.put(airplane.getId(), airplane);

        System.out.println("接收到飞机 " + airplane.getId() + " 的坐标: "
                + "纬度 = " + airplane.getLat() + ", 经度 = " + airplane.getLon());

        return ResponseEntity.ok("飞机坐标已接收");
    }


    /**
     * 删除传入id对应的飞机对象
     * @param uuid
     * */
    @PostMapping("/delete")
    public void delete(@RequestParam String uuid){
        System.out.println("删除飞机： " + uuid);
        airplaneHashMap.remove(uuid);
    }

    /**
     * 根据uuid修改名称
     * @param uuid, name
     * */
    @PostMapping("/editName")
    public void editName(String uuid, String name){

    }

    /**
     * 删除点迹的点迹
     * */
    @PostMapping("/addTrackPoint")
    public void addTrackPoint(@RequestBody PointRequest pointRequest){

    }



    @DeleteMapping("/deleteTrackPoint")
    public void deleteTrackPoint(String uuid, String name){

    }

    @DeleteMapping("/deleteALLTrackPoint")
    public void deleteALLTrackPoints(String uuid, String name){

    }
}
