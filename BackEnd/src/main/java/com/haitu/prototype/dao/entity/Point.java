package com.haitu.prototype.dao.entity;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
public class Point {
    public String lat;
    public String lon;

    public Point(String lat, String lon){
        this.lat = lat;
        this.lon = lon;
    }
}