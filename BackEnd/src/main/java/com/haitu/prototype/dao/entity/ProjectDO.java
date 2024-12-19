package com.haitu.prototype.dao.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Builder;
import lombok.Data;

@TableName("projectXML")
@Data
@Builder
public class ProjectDO {

    private String id;

    private String name;

    private String xmlString;

    // Getter 和 Setter 方法
}
