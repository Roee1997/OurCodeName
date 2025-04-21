using Server_codenames.DAL;

namespace server_codenames.BL
{
    public class Card
    {
        public int CardID { get; set; }
        public int GameID { get; set; }
        public string Word { get; set; }
        public string Team { get; set; }
        public bool IsRevealed { get; set; } = false;

        public Card() { }

        public Card(int cardId, int gameId, string word, string team)
        {
            CardID = cardId;
            GameID = gameId;
            Word = word;
            Team = team;
            IsRevealed = false;
        }

        // מחזיר רשימת 25 קלפים אקראיים עם חלוקה לצוותים (אדום, כחול, ניטרלי ומתנקש)
        public static List<Card> GenerateBoard(int gameId)
        {
            List<string> allWords = new List<string>
    {
        "מחשב", "שמש", "חול", "אוזן", "עכבר", "רימון", "מגדל", "שוקו",
        "אבן", "דג", "עין", "סוס", "תפוח", "שולחן", "מכונית", "טלוויזיה",
        "כובע", "גשר", "רובה", "קיץ", "חורף", "נחל", "בית", "אור", "צל"
    };

            if (allWords.Count < 25)
                throw new Exception("❌ אין מספיק מילים ליצירת לוח");

            var random = new Random();
            var shuffledWords = allWords.OrderBy(w => random.Next()).Take(25).ToList();

            List<string> roles = new List<string>
    {
        "Red", "Red", "Red", "Red", "Red", "Red", "Red", "Red",
        "Blue", "Blue", "Blue", "Blue", "Blue", "Blue", "Blue", "Blue",
        "Neutral", "Neutral", "Neutral", "Neutral", "Neutral", "Neutral", "Neutral", "Neutral",
        "Assassin"
    };

            if (roles.Count != 25)
                throw new Exception("❌ מספר התפקידים (Roles) שגוי – חייבים 25");

            var shuffledRoles = roles.OrderBy(r => random.Next()).ToList();

            List<Card> cards = new List<Card>();

            for (int i = 0; i < 25; i++)
            {
                cards.Add(new Card
                {
                    GameID = gameId,
                    Word = shuffledWords[i],
                    Team = shuffledRoles[i],
                    IsRevealed = false
                });
            }

            return cards;
        }

        public static bool SaveBoardToDb(List<Card> board)
        {
            DBservices dbs = new DBservices();
            return dbs.InsertCards(board);
        }

        public static List<Card> GetCardsForGame(int gameId)
        {
            DBservices dbs = new DBservices();
            return dbs.GetCardsForGame(gameId);
        }

        public static List<Card> GetBoardForPlayer(int gameId, string userId)
        {
            DBservices dbs = new DBservices();
            return dbs.GetBoardForPlayer(gameId, userId);
        }


        public static bool RevealCard(int cardId)
        {
            DBservices dbs = new DBservices();
            return dbs.RevealCard(cardId);
        }
    }
}
