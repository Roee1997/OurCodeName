using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using server_codenames.BL;
using server_codenames.DAL;

namespace server_codenames.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserDAL _userDal;

        public UserController(UserDAL userDal)
        {
            _userDal = userDal;
        }

        // 📌 קבלת כל המשתמשים
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetAllUsers()
        {
            var users = _userDal.GetAllUsers();
            if (users.Count == 0)
                return NotFound(new { message = "No users found" });

            return Ok(users);
        }

        // 📌 קבלת משתמש לפי ID
        [HttpGet("{userId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetUserById(int userId)
        {
            var user = _userDal.GetUserById(userId);
            if (user == null)
                return NotFound(new { message = "User not found" });

            return Ok(user);
        }

        // 📌 יצירת משתמש חדש
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult CreateUser([FromBody] User user)
        {
            if (string.IsNullOrWhiteSpace(user.Username) || string.IsNullOrWhiteSpace(user.Email) || string.IsNullOrWhiteSpace(user.PasswordHash))
            {
                return BadRequest(new { message = "Invalid user data" });
            }

            _userDal.CreateUser(user);
            return CreatedAtAction(nameof(GetUserById), new { userId = user.UserID }, user);
        }

        // 📌 מחיקת משתמש
        [HttpDelete("{userId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteUser(int userId)
        {
            bool deleted = _userDal.DeleteUser(userId);
            if (!deleted)
                return NotFound(new { message = "User not found or already deleted" });

            return Ok(new { message = "User deleted successfully" });
        }
    }
}

