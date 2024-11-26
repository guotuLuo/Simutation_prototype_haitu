package com.haitu.prototype.dao.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Airplane {
    public String id;
    public String lat;
    public String lon;
    public String name;
    public int speed;
    public List<Point> track;
}
