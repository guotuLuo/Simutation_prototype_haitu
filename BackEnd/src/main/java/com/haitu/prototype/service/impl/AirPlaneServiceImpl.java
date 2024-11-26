package com.haitu.prototype.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.haitu.prototype.dao.entity.Airplane;
import com.haitu.prototype.dao.entity.Point;
import com.haitu.prototype.dto.request.AirplaneReqDTO;
import com.haitu.prototype.service.AirPlaneService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.NoSuchElementException;


/**
 * 通过uuid管理一组airplane， 并且希望通过uuid直接获取airplane对象
 *
 * */
@Service
@Slf4j
@RequiredArgsConstructor
public class AirPlaneServiceImpl implements AirPlaneService {
    private final HashMap<String, Airplane> airplaneHashMap;

    /**
     * 更新当前飞机点迹
     * @param airplaneReqDTO 飞机请求实体，主要用于更新点迹
     * */
    @Override
    public void uploadAirplaneCoordinates(AirplaneReqDTO airplaneReqDTO) {
        String id = airplaneReqDTO.getId();
        if(!airplaneHashMap.containsKey(id)){
            airplaneHashMap.put(id, BeanUtil.toBean(airplaneReqDTO, Airplane.class));
            airplaneHashMap.get(id).setTrack(new ArrayList<>());
        }else{
            Point point = new Point(airplaneReqDTO.getLat(), airplaneReqDTO.getLon());
            airplaneHashMap.get(id).getTrack().add(point);
        }
        log.info("接收到飞机 " + id + " 的坐标: "
                + "纬度 = " + airplaneReqDTO.getLat() + ", 经度 = " + airplaneReqDTO.getLon());
    }

    @Override
    public void remove(String uuid) {
        System.out.println("删除飞机： " + uuid);
        airplaneHashMap.remove(uuid);
    }

    @Override
    public void setSpeed(AirplaneReqDTO airplaneReqDTO) {
        String id = airplaneReqDTO.getId();
        if(airplaneHashMap.containsKey(id)){
            airplaneHashMap.get(id).setSpeed(airplaneReqDTO.speed);
        }else{
            throw new NoSuchElementException();
        }
    }

    @Override
    public void editName(AirplaneReqDTO airplaneReqDTO) {
        String id = airplaneReqDTO.getId();
        if(airplaneHashMap.containsKey(id)){
            airplaneHashMap.get(id).setName(airplaneReqDTO.name);
        }else{
            throw new NoSuchElementException();
        }
    }

    @Override
    public void deleteTrackPoint(String uuid) {
        if(airplaneHashMap.containsKey(uuid)){
            airplaneHashMap.get(uuid).getTrack().clear();
        }else{
            throw new NoSuchElementException();
        }
    }

    @Override
    public void deleteAllTrackPoint() {
        for (String s : airplaneHashMap.keySet()) {
            airplaneHashMap.get(s).getTrack().clear();
        }
    }
}
