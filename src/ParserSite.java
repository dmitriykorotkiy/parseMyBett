import javafx.geometry.Pos;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

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


    public void placeBet( WebDriver driver) throws InterruptedException {
        String[] arrayName = {"Darcis", "Verdasco"};
        String stavka = "Ф1(-2)";
        WebElement betToday = driver.findElement(By.xpath(".//*[@id='menuEventFilter_33_344']"));
        betToday.click();
        Thread.sleep(500);
        List<WebElement> teamIdName = driver.findElements(By.className("teamId"));
        for (WebElement player : teamIdName) {
            if (player.getText().contains(arrayName[0]) || player.getText().contains(arrayName[1])) {
                WebElement home = player.findElement(By.className("Home"));
                System.out.println(home.getText());
                System.out.println(player.getText());
                WebElement alt = player.findElement(By.xpath("../*[@class='alt']/a"));
                System.out.println(alt.getText());
                alt.click();
                Thread.sleep(5000);

                if (stavka.contains("Ф1")){
                    WebElement spreadtotal = driver.findElement(By.xpath(".//*[@class='spreadTotal']/table/tbody"));
                    System.out.println(spreadtotal.getText());
                    List<WebElement> price = spreadtotal.findElements(By.xpath(".//a[contains(@href,'2.5')]"));
                    for (WebElement td: price) {
                        System.out.println(td.getText());
                        td.click();
                        Thread.sleep(2000);
                    }
                }

            }

        }
    }


}

