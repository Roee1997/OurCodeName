using Server_codenames.DAL;

namespace server_codenames.BL
{
    public class Game
    {
        private int gameID;             // נוצר אוטומטית ע"י SQL
        private string createdBy;        // UserID - NVARCHAR
        private DateTime creationDate;   // תאריך יצירת המשחק
        private string status;        // "Waiting", "In Progress", "Finished"
        private string winningTeam;     // יכול להיות null

        public Game(int gameID, string createdBy, DateTime creationDate, string status, string winningTeam)
        {
            GameID = gameID;
            CreatedBy = createdBy;
            CreationDate = creationDate;
            Status = status;
            WinningTeam = winningTeam;
        }

        public int GameID { get => gameID; set => gameID = value; }
        public string CreatedBy { get => createdBy; set => createdBy = value; }
        public DateTime CreationDate { get => creationDate; set => creationDate = value; }
        public string Status { get => status; set => status = value; }
        public string WinningTeam { get => winningTeam; set => winningTeam = value; }


        public int CreateGame() {
            DBservices dbs = new DBservices();
            return dbs.CreateGame(this);
        }
    }
}
