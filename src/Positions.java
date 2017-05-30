
public class Positions {
    String tournamentName;
    String beginMatch;
    String playerName;
    String bet;
    String price;
    String bookmaker;

    public Positions(String tournamentName, String beginMatch, String playerName, String bet, String price, String bookmaker) {
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
}


