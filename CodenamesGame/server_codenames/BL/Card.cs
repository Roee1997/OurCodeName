using Server_codenames.DAL;

namespace server_codenames.BL
{
    public class Card
    {
        public int CardID { get; set; }             // ← זה יווצר אוטומטית ב־SQL
        public int GameID { get; set; }
        public string Word { get; set; }
        public string Team { get; set; }
        public bool IsRevealed { get; set; } = false;

        public Card() { }

        public Card(int gameId, string word, string team)
        {
            GameID = gameId;
            Word = word;
            Team = team;
            IsRevealed = false;
        }

        public static List<Card> GenerateBoard(int gameId)
        {
            List<string> allWords = new List<string>
            {
                "מחשב", "שמש", "חול", "אוזן", "עכבר", "רימון", "מגדל", "שוקו",
                "אבן", "דג", "עין", "סוס", "תפוח", "שולחן", "מכונית", "טלוויזיה",
                "כובע", "גשר", "רובה", "קיץ", "חורף", "נחל", "בית", "אור", "צל"
            };

            var random = new Random();
            var shuffled = allWords.OrderBy(w => random.Next()).Take(25).ToList();

            var cards = new List<Card>();

            for (int i = 0; i < 25; i++)
            {
                string team = i switch
                {
                    < 8 => "Red",
                    < 16 => "Blue",
                    24 => "Assassin",
                    _ => "Neutral"
                };

                cards.Add(new Card(gameId, shuffled[i], team));
            }

            return cards;
        }

        public static bool SaveBoardToDb(List<Card> board)
        {
            DBservices dbs = new DBservices();
            return dbs.InsertCards(board);
        }
    }
}