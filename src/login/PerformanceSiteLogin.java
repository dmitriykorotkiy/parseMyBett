package login;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.Map;

public class PerformanceSiteLogin {

    MyProperty property = new MyProperty();
    Map<String,String > mapPerformanceSite = property.getProperty(MyProperty.getPathToProperties());

    private String USER_PERFORMANCE = mapPerformanceSite.get("loginPerformanceSite");
    private String PASSWORD_PERFORMANCE = mapPerformanceSite.get("passwordPerformanceSite");
    private String PERFORMANCE_SITE_URL = mapPerformanceSite.get("performanceSite");

    public String getUserPerformance() {
        return USER_PERFORMANCE;
    }

    public String getPasswordPerformance() {
        return PASSWORD_PERFORMANCE;
    }

    public String getPerformanceSiteUrl() {
        return PERFORMANCE_SITE_URL;
    }

    public void login(String USER_PERFORMANCE, String PASSWORD_PERFORMANCE, WebDriver driver) throws InterruptedException {

        WebElement element = driver.findElement(By.id("loginButton"));
        element.click();
        Thread.sleep(1500);
        WebElement login = driver.findElement(By.xpath(".//*[@id='loginMvc']/form/div/div[1]/div[1]/div[2]/div[2]/input"));
        login.sendKeys(USER_PERFORMANCE);
        WebElement password = driver.findElement(By.xpath(".//*[@id='loginMvc']/form/div/div[1]/div[1]/div[3]/div[2]/input"));
        password.sendKeys(PASSWORD_PERFORMANCE);
        WebElement enter = driver.findElement(By.id("loginButtonContainer"));
        Thread.sleep(2000);
        enter.click();
        WebElement tennis = driver.findElement(By.xpath(".//*[@id='menuSport_33']/a"));
        tennis.click();
        Thread.sleep(2000);

    }
}
