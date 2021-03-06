package com.github.philipsonfhir.fhircast.server;

import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;

@ServletComponentScan
@SpringBootApplication
public class FhirCastServerApplication {

    public static void main(String[] args) {
        SpringApplication sa = new SpringApplication( FhirCastServerApplication.class );
        sa.setLogStartupInfo(false);
        sa.setBannerMode(Banner.Mode.OFF);
        sa.run(args);
    }
}