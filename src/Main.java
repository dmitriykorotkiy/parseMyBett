import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) throws IOException {
        List<String> listBET = new ArrayList<>();

        File input = new File("C:\\1.html");
        Document document = Jsoup.parse(input,"UTF-8");

        FileWriter writer = new FileWriter("C:\\bets.txt",false);

        Elements positionElements = document.getElementsByAttributeValue("class","style4");

         for (Element betElement : positionElements) {            // кладу текст в коллекцию
             listBET.add(betElement.text());
       }

        for (int i = 0; i < positionElements.size(); i++) {
            String lineSeparator = System.getProperty("line.separator");
            String text = listBET.get(i) + lineSeparator;
            writer.write(text);
            writer.flush();
        }

    }

}

