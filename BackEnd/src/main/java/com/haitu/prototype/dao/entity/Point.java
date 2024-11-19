package com.haitu.prototype.dao.entity;

import lombok.Data;

@Data
public class Point {
    public String lat;
    public String lon;

    public Point(String lat, String lon){
        this.lat = lat;
        this.lon = lon;
    }
}