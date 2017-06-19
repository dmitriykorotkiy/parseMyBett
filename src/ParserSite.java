import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.openqa.selenium.By;
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


    public void makeBet(List<Position> listPosition, WebDriver driver) throws InterruptedException {
        for (Position bet : listPosition) {
//           String[] arrayName =  bet.createArrayName(bet);
            String[] arrayName = {"Lindell", "Banes"};
            WebElement betToday = driver.findElement(By.xpath(".//*[@id='menuEventFilter_33_343']"));
            betToday.click();
            Thread.sleep(500);
            List<WebElement> tbodyList = betToday.findElements(By.xpath("//*[@id='Today_33']/table/tbody"));
            for (WebElement tBodyElement : tbodyList) {
                Thread.sleep(1000);
                List<WebElement> trList = tBodyElement.findElements(By.xpath("//*[@id='Today_33']/table/tbody/tr"));
                for (WebElement trElement : trList) {
                    System.out.println("trList.size()   ---------------->" + trList.size());
                    List<WebElement> listTeamId = trElement.findElements(By.className("teamId"));
                    for (WebElement teamIdElement : listTeamId) {
                        System.out.println(teamIdElement.getText());
                        if (teamIdElement.getText().contains(arrayName[0]) || teamIdElement.getText().contains(arrayName[1])) {
                            List<WebElement> btn = trElement.findElements(By.className("alt"));
                            for (WebElement btnText : btn) {
                                System.out.println("I PLACE bet!");
                                btnText.click();

                            }
                        }
                    }
                }
            }
        }
    }
}
