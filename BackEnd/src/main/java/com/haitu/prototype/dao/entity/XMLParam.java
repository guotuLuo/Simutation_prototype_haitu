package com.haitu.prototype.dao.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class XMLParam {
    /**
     * 参数名称
     * */
    private String name;
    /**
     * 参数类型
     * */
    private String type;
    /**
     * 相对偏移量
     * */
    private int offset;
    /**
     * 放大倍数
     * */
    private int resolution;
}
