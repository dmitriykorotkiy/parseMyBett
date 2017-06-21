
import login.PerformanceSiteLogin;
import login.SourceSiteLogin;
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
        SourceSiteLogin sourceSiteLogin = new SourceSiteLogin();
        driver.get(sourceSiteLogin.getSourceSiteUrl());
        sourceSiteLogin.login(sourceSiteLogin.getUserSource(), sourceSiteLogin.getPasswordSource());
        Thread.sleep(2000);


        ParserSite parserSite = new ParserSite();
        List<String> listTextBet = parserSite.getContentFromSourceSite(driver);
        List<Position> positionsList = parserSite.createPositionsList(listTextBet);
        parserSite.showPositionList(positionsList);

        PerformanceSiteLogin performanceSiteLogin = new PerformanceSiteLogin();
        driver.get(performanceSiteLogin.getPerformanceSiteUrl());
        performanceSiteLogin.login(performanceSiteLogin.getUserPerformance(),performanceSiteLogin.getPasswordPerformance(),driver);
        System.out.println(parserSite.checkLogin(driver));

        parserSite.makeBet(positionsList,driver);


    }
}


