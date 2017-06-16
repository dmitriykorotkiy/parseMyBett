import login.FirstSiteLogin;
import login.SecondSiteLogin;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
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


    }
}


