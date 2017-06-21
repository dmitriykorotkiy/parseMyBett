package login;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;


public class MyProperty {

    public static final String PATH_TO_PROPERTIES = "C:\\projects\\property\\config.properties";


    public static String getPathToProperties() {
        return PATH_TO_PROPERTIES;
    }

    public Map<String,String> getProperty(String PATH_TO_PROPERTIES){

        FileInputStream fileInputStream;
        Properties properties = new Properties();
        Map<String,String> mapProperty = new HashMap<>();

        try {
            fileInputStream = new FileInputStream(PATH_TO_PROPERTIES);
            properties.load(fileInputStream);

            mapProperty.put("loginSourceSite",properties.getProperty("loginSourceSite"));
            mapProperty.put("passwordSourceSite",properties.getProperty("passwordSourceSite"));
            mapProperty.put("sourceSite",properties.getProperty("sourceSite"));
            mapProperty.put("loginPerformanceSite",properties.getProperty("loginPerformanceSite"));
            mapProperty.put("passwordPerformanceSite",properties.getProperty("passwordPerformanceSite"));
            mapProperty.put("performanceSite",properties.getProperty("performanceSite"));

        } catch (IOException e) {
            System.out.println("Ошибка в программе: файл " + PATH_TO_PROPERTIES + " не обнаружено");
            e.printStackTrace();
        }
            return mapProperty;
    }
}
