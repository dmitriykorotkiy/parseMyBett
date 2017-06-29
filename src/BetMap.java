import java.util.HashMap;
import java.util.Map;

public class BetMap {

    Map<String,String> betMapValue = new HashMap<>();


    public Map<String,String > createBetMapValue(Map<String,String> betMapValue){

        betMapValue.put("Ф1(-0.5)","0.5");
        betMapValue.put("Ф1(-1.0)","1.0");
        betMapValue.put("Ф1(-1.5)","1.5");
        betMapValue.put("Ф1(-2.0)","2.0");
        betMapValue.put("Ф1(-2.5)","2.5");
        betMapValue.put("Ф1(-3.0)","3.0");
        betMapValue.put("Ф1(-3.5)","3.5");

        return this.betMapValue;
    }
}

