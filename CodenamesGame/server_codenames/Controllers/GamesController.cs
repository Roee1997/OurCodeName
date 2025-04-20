using Microsoft.AspNetCore.Mvc;
using server_codenames.BL;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace server_codenames.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GamesController : ControllerBase
    {
        // GET: api/<GamesController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/games/{gameId}/is-joinable
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


        // POST api/<GamesController>
        [HttpPost]
        public IActionResult CreateGame([FromBody] Game game)
        {
            try
            {
                int gameId = game.CreateGame(); // BL קורא ל־DAL
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

        // PUT api/<GamesController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<GamesController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
