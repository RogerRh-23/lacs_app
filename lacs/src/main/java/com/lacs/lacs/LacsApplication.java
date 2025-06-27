package com.lacs.lacs;

import com.lacs.lacs.config.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({ JwtProperties.class })
public class LacsApplication {

	public static void main(String[] args) {
		SpringApplication.run(LacsApplication.class, args);
	}
}
