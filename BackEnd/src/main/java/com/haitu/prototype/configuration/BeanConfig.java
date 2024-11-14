package com.haitu.prototype.configuration;

import com.haitu.prototype.dao.entity.Point;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.List;

@Configuration
public class BeanConfig {
    /**
     * 利用id索引类对象，管理飞机和雷达对象
     * 管理依赖注入Bean
     * */
    @Bean
    public HashMap<String, List<Point>> pointQueue(){
        return new HashMap<>();
    };
}
