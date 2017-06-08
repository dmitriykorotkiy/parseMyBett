import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.openqa.selenium.By;
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

        String USER = "USER";
        String PASSWORD = "PASSWORD";

        System.setProperty("webdriver.chrome.driver", "C:\\PROJECT JAVA(parseMyBet)\\chromeDriver\\chromedriver.exe");
        WebDriver driver = new ChromeDriver();
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
        driver.get("http://user.***.ru");
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


        driver.quit();

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

