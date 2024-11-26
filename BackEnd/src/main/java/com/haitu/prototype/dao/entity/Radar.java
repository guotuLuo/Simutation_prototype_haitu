package com.haitu.prototype.dao.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Radar {
    public String id;
    public String lat;
    public String lon;
}
