using Microsoft.AspNetCore.Mvc;
using server_codenames.BL;

namespace server_codenames.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GamesController : ControllerBase
    {
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        [HttpGet("{gameId}/is-joinable")]
        public IActionResult IsGameJoinable(int gameId)
        {
            try
            {
                Game game = new Game();
                bool isJoinable = game.IsGameJoinable(gameId);

                return Ok(new { joinable = isJoinable });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost]
        public IActionResult CreateGame([FromBody] Game game)
        {
            try
            {
                int gameId = game.CreateGame();
                return Ok(new { GameID = gameId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("{gameId}/start")]
        public IActionResult StartGame(int gameId)
        {
            try
            {
                var board = Card.GenerateBoard(gameId);
                bool success = Card.SaveBoardToDb(board);

                if (!success)
                    return BadRequest(new { message = "שגיאה בשמירת לוח המשחק" });

                return Ok(new { message = "לוח נוצר בהצלחה", board });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("{gameId}/reveal/{cardId}")]
        public IActionResult RevealCard(int gameId, int cardId)
        {
            try
            {
                bool success = Card.RevealCard(cardId);
                if (!success)
                    return BadRequest(new { message = "הקלף לא נחשף" });

                return Ok(new { message = "הקלף נחשף בהצלחה" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }


        [HttpGet("{gameId}/board/{userId}")]
        public IActionResult GetBoardForPlayer(int gameId, string userId)
        {
            try
            {
                var cards = Card.GetBoardForPlayer(gameId, userId);
                return Ok(cards);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }


        [HttpGet("{gameId}/cards")]
        public IActionResult GetCardsForGame(int gameId)
        {
            try
            {
                List<Card> cards = Card.GetCardsForGame(gameId);
                return Ok(cards);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
