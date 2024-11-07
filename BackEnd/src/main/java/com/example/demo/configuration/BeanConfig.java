package com.example.demo.configuration;

import com.example.demo.domain.Airplane;
import org.springframework.cglib.beans.BeanMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;

@Configuration
public class BeanConfig {
    @Bean
    public HashMap<String, Airplane> airplaneHashMap() {
        return new HashMap<>();
    }
}
