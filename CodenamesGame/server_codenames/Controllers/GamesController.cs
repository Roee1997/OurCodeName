﻿using Microsoft.AspNetCore.Mvc;
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

        // GET api/<GamesController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
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
