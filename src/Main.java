import login.SourceSiteLogin;
import login.PerformanceSiteLogin;
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
        SourceSiteLogin site1 = new SourceSiteLogin();
//        driver.get("C:\\PARSER\\parseMyBett\\src\\resources\\htmlExample\\site1.html");
        driver.get(site1.getSourceSiteUrl());
        site1.login(site1.getUserSource(), site1.getPasswordSource());
        Thread.sleep(2000);

        ParserSite parserSite = new ParserSite();
        List<String> listTextBet = parserSite.getContentFromSourceSite(driver);
        List<Position> positionsList = parserSite.createPositionsList(listTextBet);
        parserSite.showPositionList(positionsList);

        PerformanceSiteLogin site2 = new PerformanceSiteLogin();
        driver.get(site2.getPerformanceSiteUrl());
        site2.login(site2.getUserPerformance(),site2.getPasswordPerformance(),driver);
        System.out.println(parserSite.checkLogin(driver));

        parserSite.makeBet(positionsList,driver);


    }
}


