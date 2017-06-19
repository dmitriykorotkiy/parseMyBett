package login;

import java.awt.*;
import java.awt.datatransfer.StringSelection;
import java.awt.event.KeyEvent;

public class SourceSiteLogin {


    private final String USERSOURCE = "***";
    private final String PASSWORDSOURCE = "***";
    private String SOURCE_SITE_URL = "http://****.ru/";

    public String getSourceSiteUrl() {
        return SOURCE_SITE_URL;
    }

    public String getUserSource() {
        return USERSOURCE;
    }

    public String getPasswordSource() {
        return PASSWORDSOURCE;
    }


    public void login(final String USERSOURCE,final String PASSWORDSOURCE) throws AWTException, InterruptedException {

        Robot rb = new Robot();

        //Enter user name by ctrl-v
        StringSelection username = new StringSelection(USERSOURCE);
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
        StringSelection pwd = new StringSelection(PASSWORDSOURCE);
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
