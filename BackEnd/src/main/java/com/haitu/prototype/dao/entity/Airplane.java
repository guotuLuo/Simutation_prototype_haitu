package com.haitu.prototype.dao.entity;

import lombok.Getter;

import java.util.HashSet;

@Getter
public class Airplane {
    public String id;
    public String lat;
    public String lon;

    public HashSet<Point> track;

    public Airplane(String id, String lat, String lon){
        this.id = id;
        this.lat = lat;
        this.lon = lon;
    }
}
