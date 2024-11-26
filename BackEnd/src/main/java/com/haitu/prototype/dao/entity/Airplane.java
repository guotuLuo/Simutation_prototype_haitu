package com.haitu.prototype.dao.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Airplane {
    /**
     * 飞机id
     * */
    private String id;
    /**
     * 飞机维度
     * */
    private String lat;
    /**
     * 飞机经度
     * */
    private String lon;
    /**
     * 飞机名称
     * */
    private String name;
    /**
     * 飞机速度
     * */
    private int speed;
    /**
     * 飞机点迹
     * */
    private List<Point> track;
}
