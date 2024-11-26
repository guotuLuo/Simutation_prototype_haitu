package com.haitu.prototype.dao.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Radar {
    /**
     * 雷达id
     * */
    private String id;
    /**
     * 雷达纬度
     * */
    private String lat;
    /**
     * 雷达经度
     * */
    private String lon;
    /**
     * 雷罚名称
     * */
    private String name;
}
