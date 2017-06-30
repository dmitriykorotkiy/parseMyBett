
import login.PerformanceSiteLogin;
import login.SourceSiteLogin;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;


public class Main {
    public static void main(String[] args) throws Exception {

        System.setProperty("webdriver.chrome.driver", "C:\\PARSER\\parseMyBett\\src\\resources\\chromeDriver\\chromedriver.exe");
        WebDriver driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(50, TimeUnit.SECONDS);
        SourceSiteLogin sourceSiteLogin = new SourceSiteLogin();
//        driver.get(sourceSiteLogin.getSourceSiteUrl());
        driver.get("C:\\PARSER\\parseMyBett\\src\\resources\\htmlExample\\site1.html");
//        sourceSiteLogin.login(sourceSiteLogin.getUserSource(), sourceSiteLogin.getPasswordSource());
//        Thread.sleep(2000);


        ParserSite parserSite = new ParserSite();
        List<String> listTextBet = parserSite.getContentFromSourceSite(driver);
        List<Position> positionsList = parserSite.createPositionsList(listTextBet);
        parserSite.showPositionList(positionsList);

        PerformanceSiteLogin performanceSiteLogin = new PerformanceSiteLogin();
        driver.get(performanceSiteLogin.getPerformanceSiteUrl());
        performanceSiteLogin.login(performanceSiteLogin.getUserPerformance(), performanceSiteLogin.getPasswordPerformance(), driver);
        System.out.println(parserSite.checkLogin(driver));


//        String whichBet = "Ф1(-1.5)";
//        BetMap betMap = new BetMap();
//        Map<String,String> mapTypeBets = betMap.createBetMapValue();
//        String myBet = mapTypeBets.get(whichBet);
//        System.out.println(myBet);
//        String[] arrayName = {"Gasquet", "Monfils"};

        for (Position element : positionsList) {
            String[] playerName = element.createArrayName(element);
            for (String x : playerName) {
                System.out.println(x);
            }
            String myBet = element.comparingBetWithBetMap(element);
            WebElement alternateLines = parserSite.findAndGetAlternateLines(driver, playerName);
            System.out.println(alternateLines.getText());
            System.out.println(alternateLines.getTagName());
            Thread.sleep(500);
            parserSite.findBetAndPlaceBet(driver, myBet, playerName, alternateLines);
            Thread.sleep(10000);
            driver.quit();


        }
    }
}


