using Microsoft.AspNetCore.Mvc;
using server_codenames.BL;

namespace server_codenames.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendsController : ControllerBase
    {
        // POST: api/friends/request
        [HttpPost("request")]
        public IActionResult SendFriendRequest([FromBody] FriendRequestPayload payload)
        {
            try
            {
                string result = Friend.SendFriendRequest(payload.SenderID, payload.ReceiverQuery);

                return result switch
                {
                    "FriendRequestSent" => Ok(new { message = "Friend request sent successfully." }),
                    "AlreadyPending" => Conflict(new { message = "A friend request is already pending." }),
                    "AlreadyFriends" => BadRequest(new { message = "You are already friends." }),
                    "UserNotFound" => NotFound(new { message = "User not found." }),
                    _ => BadRequest(new { message = result }) // החזרת שגיאה כללית
                };
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error: " + ex.Message });
            }
        }





    }

    // Payload model for friend request
    public class FriendRequestPayload
    {
        public string SenderID { get; set; }
        public string ReceiverQuery { get; set; } // Username or Email
    }
}
