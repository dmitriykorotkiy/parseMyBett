package login;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class SecondSiteLogin {

    private String USER_PIN = "****";
    private String PASSWORD_PIN = "****";
    private String SECOND_SITE_URL = "https://www.****.com/ru/";

    public String getUSER_PIN() {
        return USER_PIN;
    }

    public String getPASSWORD_PIN() {
        return PASSWORD_PIN;
    }

    public String getSECOND_SITE_URL() {
        return SECOND_SITE_URL;
    }

    public void login(String USERPIN, String PASSWORDPIN, WebDriver driver) throws InterruptedException {

        WebElement element = driver.findElement(By.id("loginButton"));
        element.click();
        Thread.sleep(1500);
        WebElement login = driver.findElement(By.xpath(".//*[@id='loginMvc']/form/div/div[1]/div[1]/div[2]/div[2]/input"));
        login.sendKeys(USER_PIN);
        WebElement password = driver.findElement(By.xpath(".//*[@id='loginMvc']/form/div/div[1]/div[1]/div[3]/div[2]/input"));
        password.sendKeys(PASSWORD_PIN);
        WebElement enter = driver.findElement(By.id("loginButtonContainer"));
        Thread.sleep(2000);
        enter.click();
        WebElement tennis = driver.findElement(By.xpath(".//*[@id='menuSport_33']/a"));
        tennis.click();
        Thread.sleep(2000);

    }
}
