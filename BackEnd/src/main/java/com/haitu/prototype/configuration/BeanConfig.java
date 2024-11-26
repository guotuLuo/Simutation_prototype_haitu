package com.haitu.prototype.configuration;

import com.haitu.prototype.dao.entity.Airplane;
import com.haitu.prototype.dao.entity.Radar;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;

@Configuration
public class BeanConfig {
    /**
     * 利用id索引类对象，管理飞机和雷达对象
     * 管理依赖注入Bean
     * */
    @Bean
    public HashMap<String, Airplane> airplaneHashMap(){
        return new HashMap<>();
    }

    @Bean
    public HashMap<String, Radar> radarHashMap(){
        return new HashMap<>();
    };
}
