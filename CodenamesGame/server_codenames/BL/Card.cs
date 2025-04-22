using Server_codenames.DAL;

namespace server_codenames.BL
{
    public class Card
    {
        public int CardID { get; set; }
        public int GameID { get; set; }
        public int WordID { get; set; } // ✅ חדש
        public string Word { get; set; } // ✅ כדי להעביר ללקוח
        public string Team { get; set; }
        public bool IsRevealed { get; set; } = false;

        public Card() { }

        public static List<Card> GenerateBoard(int gameId)
        {
            DBservices dbs = new DBservices();
            List<(int WordID, string Word)> words = dbs.GetRandomWords(25); // ✅ שליפת מילים מטבלת Words

            if (words.Count < 25)
                throw new Exception("❌ אין מספיק מילים ליצירת לוח");

            var roles = new List<string>
            {
                "Red", "Red", "Red", "Red", "Red", "Red", "Red", "Red",
                "Blue", "Blue", "Blue", "Blue", "Blue", "Blue", "Blue", "Blue",
                "Neutral", "Neutral", "Neutral", "Neutral", "Neutral", "Neutral", "Neutral", "Neutral",
                "Assassin"
            };

            var random = new Random();
            var shuffledRoles = roles.OrderBy(r => random.Next()).ToList();

            List<Card> cards = new List<Card>();

            for (int i = 0; i < 25; i++)
            {
                cards.Add(new Card
                {
                    GameID = gameId,
                    WordID = words[i].WordID,
                    Word = words[i].Word,
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
