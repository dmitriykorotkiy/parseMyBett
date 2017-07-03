import java.util.Map;

public class Position {
    private String tournamentName;
    private String beginMatch;
    private String playerName;
    private String bet;
    private String price;
    private String bookmaker;


    public Position() {

    }


    public Position(String tournamentName, String beginMatch, String playerName, String bet, String price, String bookmaker) {
        this.tournamentName = tournamentName;
        this.beginMatch = beginMatch;
        this.playerName = playerName;
        this.bet = bet;
        this.price = price;
        this.bookmaker = bookmaker;
    }

    public String getTournamentName() {
        return tournamentName;
    }

    public String getBeginMatch() {
        return beginMatch;
    }

    public String getPlayerName() {
        return playerName;
    }

    public String getBet() {
        return bet;
    }

    public String getPrice() {
        return price;
    }

    public String getBookmaker() {
        return bookmaker;
    }

    public void setTournamentName(String tournamentName) {
        this.tournamentName = tournamentName;
    }

    public void setBeginMatch(String beginMatch) {
        this.beginMatch = beginMatch;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public void setBet(String bet) {
        this.bet = bet;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public void setBookmaker(String bookmaker) {
        this.bookmaker = bookmaker;
    }

    @Override
    public String toString() {
        return "Position{" +
                "tournamentName='" + tournamentName + '\'' +
                ", beginMatch='" + beginMatch + '\'' +
                ", playerName='" + playerName + '\'' +
                ", bet='" + bet + '\'' +
                ", price='" + price + '\'' +
                ", bookmaker='" + bookmaker + '\'' +
                '}';
    }

    public String[] createName(Position position) {
        String[] playerName = position.getPlayerName().split("-");
        return playerName;
    }

    public String findBetByPosition(Position position) {
        System.out.println(position.getPlayerName() + position.getBet());
        BetMap betMap = new BetMap();
        Map<String, String> mapTypeBets = betMap.createBetMapValue();
        String myBet = mapTypeBets.get(position.getBet());
        System.out.println(myBet);
        return myBet;
    }

}


