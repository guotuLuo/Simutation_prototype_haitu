package com.haitu.prototype.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RadarScanRespDTO {
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
}
