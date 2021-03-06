
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.awt.*;
import java.awt.event.KeyEvent;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ParserSite {


    public List<String> getContentFromSourceSite(WebDriver driver) {

        List<WebElement> allPositions = driver.findElements(By.className("style4"));
        ArrayList<String> listBet = new ArrayList<>();
        for (int i = 0; i < allPositions.size(); i++) {
            String element = String.valueOf(allPositions.get(i).getText());
            if (element.contains("(П)")) {
                listBet.add(element);
            }
        }
        return listBet;
    }

    public List<Position> createPositionsList(List<String> listBet) {
        List<Position> positionsList = new ArrayList<>();
        for (int i = 0; i < listBet.size(); i++) {
            String element = listBet.get(i);
            String[] parts = element.split(" ");
            ArrayUtils.reverse(parts);
            Position position = new Position();
            position.setBookmaker(parts[0]);
            position.setPrice(parts[1]);
            position.setBet(parts[2]);


            for (int j = 0; j < parts.length; j++) {
                if (parts[j].contains(":") || parts[j].contains("/")) {
                    position.setBeginMatch(parts[j]);
                    String[] namePlayer = Arrays.copyOfRange(parts, 3, j);
                    ArrayUtils.reverse(namePlayer);
                    String name = StringUtils.join(namePlayer);
                    position.setPlayerName(name);
                }
            }
            positionsList.add(i, position);
        }
        return positionsList;
    }


    public void showPositionList(List<Position> positionList) {
        for (Position element : positionList) {
            System.out.println(element);
        }
    }



    public boolean checkLogin(WebDriver driver){
        WebElement checkBalance = driver.findElement(By.xpath(".//*[@id='AvailableBalance']/tbody/tr/td[1]"));
        String balance = checkBalance.getText();
        if (balance != null){
            return true;
        }
        return false;
    }


    public WebElement findAndGetAlternateLines(WebDriver driver , String[] arrayName) throws InterruptedException {
        WebElement alternateLines = null;
        WebElement betToday = driver.findElement(By.xpath(".//*[@id='menuEventFilter_33_343']"));
        betToday.click();
        Thread.sleep(500);
        List<WebElement> teamIdName = driver.findElements(By.className("teamId"));
        for (WebElement player : teamIdName) {
            if (player.getText().contains(arrayName[0]) || player.getText().contains(arrayName[1])) {
                System.out.println(player.getText());
                alternateLines = player.findElement(By.xpath("../*[@class='alt']"));
                System.out.println(alternateLines.getText());
            }
        }
        return alternateLines;
    }


    public void findBetAndPlaceBet(WebDriver driver , String whichBet , String[] arrayName , WebElement alternateLines , String myBet) throws InterruptedException, AWTException {

        Thread.sleep(1000);
        alternateLines.click();
        List<WebElement> listTr = driver.findElements(By.xpath(".//*[@class='spreadTotal']/table/tbody/tr"));
        for (WebElement tr: listTr) {
            if (tr.getText().contains(whichBet)) {
                System.out.println(whichBet + " <--------------------------------------------------");
                System.out.println("есть ставка");
                List<WebElement> betPrice = tr.findElements(By.className("price"));
                for (WebElement price : betPrice) {
                    System.out.println(price.getText());
                    price.click();
                    Thread.sleep(300);
                    WebElement odds = driver.findElement(By.className("odds"));
                    System.out.println(odds.getText());
                    if (checkOdds(odds, arrayName, myBet)) {
                        WebElement pendingTicket = driver.findElement(By.xpath(".//*[@id='PendingTicket_TicketItem_StakeAmount']"));
                        pendingTicket.sendKeys("2");
                        Thread.sleep(3000);
                        System.out.println(" Ok , I`m ready to place a bet !");
                        WebElement registerBet = driver.findElement(By.id("BetTicketSubmitLink"));
                        registerBet.click();
                        Robot rb = new Robot();
                        rb.keyPress(KeyEvent.VK_ENTER);
                        Thread.sleep(2000);
                        rb.keyPress(KeyEvent.VK_ENTER);
                        break;

                    }

                }

            }
        }
    }


     private boolean checkOdds(WebElement odds,String[] arrayName,String reallyBet){
         if((odds.getText().contains(arrayName[0]) || odds.getText().contains(arrayName[1])) && odds.getText().contains(reallyBet)){
             return true;
         }
         return false;
     }

}

