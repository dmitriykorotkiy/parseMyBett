import login.FirstSiteLogin;
import login.SecondSiteLogin;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import java.util.*;
import java.util.List;
import java.util.concurrent.TimeUnit;


public class Main {
    public static void main(String[] args) throws Exception {

        System.setProperty("webdriver.chrome.driver", "C:\\PARSER\\parseMyBett\\src\\resources\\chromeDriver\\chromedriver.exe");
        WebDriver driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(50, TimeUnit.SECONDS);
        FirstSiteLogin site1 = new FirstSiteLogin();
        driver.get("C:\\PARSER\\parseMyBett\\src\\resources\\htmlExample\\site1.html");
//        driver.get(site1.getFIRST_SITE_URL());                         // захожу на сайт , логинюсь
//        site1.login(site1.getUSER(), site1.getPASSWORD());
//        Thread.sleep(2000);

        ParserSite parserSite = new ParserSite();
        List<String> listTextBet = parserSite.getTextFromSite1(driver);
        List<Position> positionsList = parserSite.createPositionsList(listTextBet);
        parserSite.showPositionList(positionsList);

        SecondSiteLogin site2 = new SecondSiteLogin();
//        driver.get("C:\\PARSER\\parseMyBett\\src\\resources\\htmlExample\\site2.html");
        driver.get(site2.getSECOND_SITE_URL());
        site2.login(site2.getUSER_PIN(),site2.getPASSWORD_PIN(),driver);



        parserSite.makeBet(positionsList,driver);

        //достаю bet из листа и ищу ее на сайте
        for (Position bet : positionsList) {
//            String[] name = bet.getPlayerName().split("-");

            String name = "Fabbiano";
//          System.out.println(name[0] + " второе " + name[1]);
            WebElement betToday = driver.findElement(By.xpath(".//*[@id='menuEventFilter_33_344']"));
//            System.out.println("betToday.getText(): " + betToday.getText());

            Thread.sleep(2000);
            betToday.click();

            // СЕГОДНЯ
            List<WebElement> tbodyList = betToday.findElements(By.xpath("//*[@id='Early_33']/table/tbody/tr"));
//            System.out.println("tbodyList.count: " + tbodyList.size());



            for (WebElement tBodyElement : tbodyList) {
//                     System.out.println("tBodyElement.getText(): " + tBodyElement.getText());

//                List<WebElement> listID = tBodyElement.findElements(By.className("teamId"));
                Thread.sleep(2000);
                List<WebElement> trS = tBodyElement.findElements(By.xpath("//*[@id='Early_33']/table/tbody/tr"));

                for (WebElement tr: trS) {

                    System.out.println("TR!!!");
                    List<WebElement> listID = tr.findElements(By.className("teamId"));
                    System.out.println("listID.size" + listID.size());
                    for (WebElement teamIdToday : listID) {
                        System.out.println("teamIdToday " + teamIdToday.getText());
                        if (teamIdToday.getText().contains(name)) {

                            System.out.println(" Я НАШЕЛ !!!! ---------------- >  ВОТ ТВОЯ СТАВКА : " + teamIdToday.getText());
//                            System.out.println("tr.getText(): " + tr.getText());
//                            System.out.println("alt: " + tr.findElement(By.className("alt")));
//                            System.out.println("id: " + tr.findElement(By.className("id")));
                            List<WebElement> btn = tr.findElements(By.className("alt"));
                            for (WebElement btnText : btn) {
                                System.out.println(btnText.getText());
                                btnText.click();
                            }


                        }
                    }
                }

//                for (WebElement teamIdToday : listID) {
//                    System.out.println("teamIdToday.getText(): " + teamIdToday.getText());
////                    if (teamIdToday.getText().contains(name[0]) || teamIdToday.getText().contains(name[1])) {
//                        if (teamIdToday.getText().contains(name)) {
//
//                            String team = tBodyElement.findElement(By.className(teamIdToday.));
//
//                            System.out.println(" Я НАШЕЛ !!!! ---------------- >  ВОТ ТВОЯ СТАВКА : " + teamIdToday.getText());
//                            List<WebElement> btn = tBodyElement.findElements(By.className("alt"));
//                           for (WebElement btnText : btn) {
//                               System.out.println(btnText.getText());
//                               btnText.click();
//                           }
//
//
//                        }
////
////                        WebElement alt = teamIdToday.findElement(By.xpath(".//*tr/td[2]/a"));
////                        alt.click();
////                        Thread.sleep(3000);
//
//                        //ЗАВТРА
////                    } else if (!(teamIdToday.getText().contains(name[0]) || teamIdToday.getText().contains(name[1]))) {
//                    if (!(teamIdToday.getText().equals(name))) {
//
//                        WebElement betTomorrow = driver.findElement(By.xpath(".//*[@id='menuEventFilter_33_344']"));
//                        betTomorrow.click();
//
//                        List<WebElement> TotalRowCountTomorrow = betTomorrow.findElements(By.xpath("//*[@id='Early_33']/table/tbody"));
//
//                        for (WebElement colElementTomorrow : TotalRowCountTomorrow) {
////                                System.out.println("colElementTomorrow.getText(): " + colElementTomorrow.getText());
//
//                            // пробный
//                            List<WebElement> teamID = colElementTomorrow.findElements(By.className("teamId"));
//                            for (WebElement team : teamID) {
////                                System.out.println("team.getText(): " + team.getText());
//
//                                if (team.getText().equals(name) || team.getText().equals(name)) {
//
////                                    System.out.println(" Я НАШЕЛ !!!! ---------------- >  ВОТ ТВОЯ СТАВКА : " + team.getText());
//
//
//                                }
//
//                            }
//
//                        }
//
//                    }
//
//                    }

                }
            }
        }
    }


