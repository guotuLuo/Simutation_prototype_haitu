package com.haitu.prototype.dto.request;

import lombok.Getter;

@Getter
public class PointReqDTO {
    /**
     * 点击id
     * */
    public String id;
    /**
     * 点迹维度
     * */
    public String lat;
    /**
     * 点迹经度
     * */
    public String lon;
}
