import javax.xml.crypto.Data;
import java.util.List;

public class Rate {

    Data nextDateRate;
    List<Position> positions;



    public Data getNextDateRate() {
        return nextDateRate;
    }

    public void setNextDateRate(Data nextDateRate) {
        this.nextDateRate = nextDateRate;
    }

    public void setPositions(List<Position> positions) {
        this.positions = positions;
    }

    public List<Position> getPositions() {
        return positions;

    }
}
