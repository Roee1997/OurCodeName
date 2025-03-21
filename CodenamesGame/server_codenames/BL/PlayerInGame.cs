using Server_codenames.DAL;

namespace server_codenames.BL
{
    public class PlayerInGame
    {
        public int GameID { get; set; }
        public string UserID { get; set; }
        public string Username { get; set; }
        public string Team { get; set; }
        public bool IsSpymaster { get; set; }

        public PlayerInGame() { }

        public PlayerInGame(int gameID, string userID, string username, string team, bool isSpymaster)
        {
            GameID = gameID;
            UserID = userID;
            Username = username;
            Team = team;
            IsSpymaster = isSpymaster;
        }

        public bool JoinGame()
        {
            DBservices dbs = new DBservices();
            return dbs.JoinGame(this);
        }
    }
}