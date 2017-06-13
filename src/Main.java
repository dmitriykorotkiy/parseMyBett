import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import java.awt.*;
import java.awt.datatransfer.StringSelection;
import java.awt.event.KeyEvent;
import java.util.*;
import java.util.List;
import java.util.concurrent.TimeUnit;


public class Main {
    public static void main(String[] args) throws Exception {

        String USER = "***";
        String PASSWORD = "***";

        System.setProperty("webdriver.chrome.driver", "C:\\PARSER\\parseMyBett\\chromeDriver\\chromedriver.exe");
        WebDriver driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
        driver.get("http://user.*****.ru/");
        login(USER, PASSWORD);



        List<WebElement> allPositions = driver.findElements(By.className("style4"));

        // Делаю масив строк , который состоит из текста
        ArrayList<String> listBet = new ArrayList<>();
        for (int i = 0; i < allPositions.size(); i++) {
            String element = String.valueOf(allPositions.get(i).getText());
            if (element.contains("(П)")){
                listBet.add(element);
            }
        }

        //создаю лист позиций
        List<Position> positionsList = new ArrayList<>();

        for (int i = 0 ; i < listBet.size() ; i++ ) {
            String element = listBet.get(i);
            String[] parts = element.split(" ");
            ArrayUtils.reverse(parts);
            Position position = new Position();
            position.setBookmaker(parts[0]);
            position.setPrice(parts[1]);
            position.setBet(parts[2]);


            for (int j = 0; j < parts.length; j++) {
                if (parts[j].contains(":") || parts[j].contains("/")){
                    position.setBeginMatch(parts[j]);
                    String[] namePlayer = Arrays.copyOfRange(parts,3,j);
                    ArrayUtils.reverse(namePlayer);
                    String name = StringUtils.join(namePlayer);
                    position.setPlayerName(name);
                }
            }

            positionsList.add(i, position);
        }

        for (Position element : positionsList) {
            System.out.println(element);
        }

        driver.get("https://www.*****.com/ru/");
        WebElement element = driver.findElement(By.id("loginButton"));
        element.click();
        Thread.sleep(2000);
        WebElement login = driver.findElement(By.xpath(".//*[@id='loginMvc']/form/div/div[1]/div[1]/div[2]/div[2]/input"));
        login.sendKeys("****");
        WebElement password = driver.findElement(By.xpath(".//*[@id='loginMvc']/form/div/div[1]/div[1]/div[3]/div[2]/input"));
        password.sendKeys("****");
        WebElement enter = driver.findElement(By.id("loginButtonContainer"));
        Thread.sleep(2000);
        enter.click();
        WebElement tennis = driver.findElement(By.xpath(".//*[@id='menuSport_33']/a"));
        tennis.click();
        Thread.sleep(2000);


        Rate rate = new Rate();
        rate.setPositions(positionsList);

        for (Position bet: positionsList) {
            String begin = bet.getBeginMatch();
            if (begin.contains(":")){
                WebElement moneyToday = driver.findElement(By.xpath(".//*[@id='menuEventFilter_33_343']"));
                Thread.sleep(2000);
                moneyToday.click();
//                WebElement openMore = driver.findElement(By.id("loadMoreGamesLink"));
//                Thread.sleep(2000);
//                openMore.click();
                Thread.sleep(2000);

               WebElement webTable = driver.findElement(By.id("Today_33"));
               List<WebElement> TotalRowCount = webTable.findElements(By.xpath("//*[@id='Today_33']/table/tbody/tr"));


                String[] name = bet.getPlayerName().split("-");
                System.out.println("No. of Rows in the WebTable: " + TotalRowCount.size());
                for (WebElement rowElement : TotalRowCount) {
                    System.out.println(rowElement.getText());

                    List<WebElement> TotalColumnCount = rowElement.findElements(By.tagName("td"));
                    for (WebElement colElement : TotalColumnCount) {
                        System.out.println(colElement.getText());

                        if (colElement.getText().contains(name[0]) || colElement.getText().contains(name[1])) {
                            System.out.println("ПИЗДЕЦ , Я НАШЕЛ !!!! ---------------- >  ВОТ ТВОЯ СТАВКА : " + colElement.getText());
//                            WebElement open = colElement.findElement(By.xpath("/a"));
//                            Thread.sleep(2000);
//                            open.click();

                        }
                    }
                }



            } else if (begin.contains("/")){
                WebElement moneyLine = driver.findElement(By.xpath(".//*[@id='menuEventFilter_33_344']"));
                Thread.sleep(1000);
                moneyLine.click();
            }
        }



    }



    private static void login(String user, String password) throws AWTException, InterruptedException {
        Robot rb = new Robot();

        //Enter user name by ctrl-v
        StringSelection username = new StringSelection(user);
        Toolkit.getDefaultToolkit().getSystemClipboard().setContents(username, null);
        rb.keyPress(KeyEvent.VK_CONTROL);
        rb.keyPress(KeyEvent.VK_V);
        rb.keyRelease(KeyEvent.VK_V);
        rb.keyRelease(KeyEvent.VK_CONTROL);

        //tab to password entry field
        rb.keyPress(KeyEvent.VK_TAB);
        rb.keyRelease(KeyEvent.VK_TAB);
        Thread.sleep(2000);

        //Enter password by ctrl-v
        StringSelection pwd = new StringSelection(password);
        Toolkit.getDefaultToolkit().getSystemClipboard().setContents(pwd, null);
        rb.keyPress(KeyEvent.VK_CONTROL);
        rb.keyPress(KeyEvent.VK_V);
        rb.keyRelease(KeyEvent.VK_V);
        rb.keyRelease(KeyEvent.VK_CONTROL);

        //press enter
        rb.keyPress(KeyEvent.VK_ENTER);
        rb.keyRelease(KeyEvent.VK_ENTER);
    }



}

