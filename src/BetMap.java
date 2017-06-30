import java.util.HashMap;
import java.util.Map;

public class BetMap {

    public Map<String,String > createBetMapValue(){
        Map<String,String> betMapValue = new HashMap<>();
        betMapValue.put("Ф1(-0.5)","0.5");
        betMapValue.put("Ф1(-1.0)","1.0");
        betMapValue.put("Ф1(-1.5)","1.5");
        betMapValue.put("Ф1(-2.0)","2.0");
        betMapValue.put("Ф1(-2.5)","2.5");
        betMapValue.put("Ф1(-3.0)","3.0");
        betMapValue.put("Ф1(-3.5)","3.5");
        betMapValue.put("Ф1(-4.0)","4.0");
        betMapValue.put("Ф1(-4.5)","4.5");
        betMapValue.put("Ф1(-5.0)","5.0");
        betMapValue.put("Ф1(-5.5)","5.5");
        betMapValue.put("Ф1(-6.0)","6.0");
        betMapValue.put("Ф1(-6.5)","6.5");

        return betMapValue;
    }
}

