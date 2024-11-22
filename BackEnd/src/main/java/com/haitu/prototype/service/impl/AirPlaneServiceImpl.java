package com.haitu.prototype.service.impl;

import com.haitu.prototype.dao.entity.Point;
import com.haitu.prototype.dto.request.PointReqDTO;
import com.haitu.prototype.service.AirPlaneService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class AirPlaneServiceImpl implements AirPlaneService {
    private final HashMap<String, List<Point>> pointList;

    @Override
    public void uploadCoordinates(PointReqDTO pointRequest) {
        Point point = new Point(pointRequest.getLat(), pointRequest.getLon());
        String id = pointRequest.getId();
        if(!pointList.containsKey(id)){
            pointList.put(id, new ArrayList<>());
        }
        pointList.get(id).add(point);
        log.info("接收到飞机 " + id + " 的坐标: "
                + "纬度 = " + point.getLat() + ", 经度 = " + point.getLon());
    }

    @Override
    public void remove(String uuid) {
        System.out.println("删除飞机： " + uuid);
        pointList.remove(uuid);
    }
}
