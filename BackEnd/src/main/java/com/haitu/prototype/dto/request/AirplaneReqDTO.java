package com.haitu.prototype.dto.request;


import lombok.Data;

@Data
public class AirplaneReqDTO {
    /**
     * 飞机id
     * */
    public String id;
    /**
     * 飞机纬度
     * */
    public String lat;
    /**
     * 飞机经度
     * */
    public String lon;
    /**
     * 飞机名称
     * */
    public String name;
    /**
     * 飞机速度
     * */
    public Integer speed;
}
