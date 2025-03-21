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
                player.GameID = gameId;
                bool success = player.JoinGame();
                if (success)
                    return Ok();
                else
                    return BadRequest("Failed to join the game.");
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // PUT api/<PlayerInGamesController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<PlayerInGamesController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
