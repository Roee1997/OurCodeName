using Server_codenames.DAL;

namespace server_codenames.BL
{
    public class Game
{
    public int? GameID { get; set; }              // נוצר אוטומטית ע"י SQL
    public string CreatedBy { get; set; }         // חובה
    public DateTime? CreationDate { get; set; }   // ברירת מחדל מהשרת
    public string? Status { get; set; }           // נשלח מהקליינט או מוקצה בשרת
    public string? WinningTeam { get; set; }      // null עד לניצחון

    public Game() { }

    public Game(int gameID, string createdBy, DateTime creationDate, string status, string winningTeam)
    {
        GameID = gameID;
        CreatedBy = createdBy;
        CreationDate = creationDate;
        Status = status;
        WinningTeam = winningTeam;
    }

    public int CreateGame()
    {
        DBservices dbs = new DBservices();
        return dbs.CreateGame(this);
    }

      public bool IsGameJoinable(int gameId)
      {
         DBservices dbs = new DBservices();
        return dbs.IsGameJoinable(gameId);

      }
}
}
