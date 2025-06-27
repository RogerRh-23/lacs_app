package com.lacs.lacs.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Data
@Configuration
@ConfigurationProperties(prefix = "jwt.secret")
public class JwtProperties {
    private int activeKeyIndex;
    private List<String> keys;
}
