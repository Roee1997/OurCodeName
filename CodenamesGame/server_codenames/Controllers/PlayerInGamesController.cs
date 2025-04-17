using Microsoft.AspNetCore.Mvc;
using server_codenames.BL;
using Server_codenames.DAL;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace server_codenames.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlayerInGamesController : ControllerBase
    {
        // GET: api/<PlayerInGamesController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<PlayerInGamesController>/5
        [HttpGet("{gameId}/players")]
        public IActionResult GetPlayersInGame(int gameId)
        {
            try
            {
               
                List<PlayerInGame> players = PlayerInGame.GetPlayersInGame(gameId);
                return Ok(players);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
        // POST api/<PlayerInGamesController>
        
       
[HttpPost("{gameId}/join")]
public IActionResult JoinGame(int gameId, [FromBody] PlayerInGame player)
{
    try
    {
        player.GameID = gameId; // ליתר ביטחון, תעדכן מ־URL

        bool success = player.JoinGame();
        return success ? Ok() : BadRequest("ההצטרפות נכשלה");
    }
    catch (Exception ex)
    {
        return BadRequest(new { error = ex.Message });
    }
}
    [HttpGet("{gameId}/is-ready")]
public IActionResult IsGameReady(int gameId)
{
    try
    {
        List<PlayerInGame> players = PlayerInGame.GetPlayersInGame(gameId);

        if (players.Count != 4)
            return Ok(new { isReady = false });

        var redTeam = players.Where(p => p.Team == "Red").ToList();
        var blueTeam = players.Where(p => p.Team == "Blue").ToList();

        bool redValid = redTeam.Count == 2 &&
                        redTeam.Any(p => p.IsSpymaster) &&
                        redTeam.Any(p => !p.IsSpymaster);

        bool blueValid = blueTeam.Count == 2 &&
                         blueTeam.Any(p => p.IsSpymaster) &&
                         blueTeam.Any(p => !p.IsSpymaster);

        bool isReady = redValid && blueValid;

        return Ok(new { isReady });
    }
    catch (Exception ex)
    {
        return BadRequest(new { error = ex.Message });
    }
}

     [HttpPut("{gameId}/update-player")]
public IActionResult UpdatePlayer(int gameId, [FromBody] PlayerInGame player)
{
    try
    {
        player.GameID = gameId;
        bool success = player.UpdatePlayer();

        // ✅ החזר תשובה תקינה אם הצליח
        if (success)
            return Ok(new { message = "עודכן בהצלחה" });

        // ❗ אם לא עודכן (affected == 0) – עדיין להחזיר תשובה תקינה כדי לא לשבור את React
        return Ok(new { message = "לא בוצע שינוי, אבל אין שגיאה" });
    }
    catch (Exception ex)
    {
        return BadRequest(new { error = ex.Message });
    }
}

        // DELETE api/<PlayerInGamesController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
