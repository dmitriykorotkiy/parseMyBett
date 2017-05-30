import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.Set;
import java.util.logging.Logger;

public class Main {
    public static void main(String[] args) throws Exception {
        List<String> listBET = new ArrayList<>();

//       File input = new File("C:\\1.html");
//       Document document = Jsoup.parse(input,"UTF-8");
//
//        FileWriter writer = new FileWriter("C:\\bets.txt",false);
//
//        Elements positionElements = document.getElementsByAttributeValue("class","style4");
//
//        for (Element betElement : positionElements) {            // кладу текст в коллекцию
//             listBET.add(betElement.text());
//      }
//
//       for (int i = 0; i < positionElements.size(); i++) {
//           String lineSeparator = System.getProperty("line.separator");
//           String text = listBET.get(i) + lineSeparator;
//           writer.write(text);
//           writer.flush();
//       }


        System.setProperty("webdriver.chrome.driver", "C:\\projects\\chromedriver.exe");
        WebDriver driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.get("C:\\1.html");


        List<WebElement> allPositions = driver.findElements(By.className("style4"));
        FileWriter writer = new FileWriter("C:\\bets.txt",false);

        for (WebElement element : allPositions) {
            String lineSeparator = System.getProperty("line.separator");
            String x = element.getText() + lineSeparator;
            writer.write(x);
            writer.flush();
        }

        driver.quit();

    }

}

