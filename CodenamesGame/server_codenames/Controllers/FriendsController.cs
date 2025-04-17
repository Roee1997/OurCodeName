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

        //find user to add to friend list
        [HttpGet("search")]
        public IActionResult SearchUser([FromQuery(Name = "query")] string query)
        {
            try
            {
                server_codenames.BL.Users user = server_codenames.BL.Users.GetUserByUsernameOrID(query);
                if (user != null)
                {
                    return Ok(user); // 200 + JSON with user details
                }
                return NotFound(new { message = "User not found." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error: " + ex.Message });
            }
        }


        [HttpGet("pending-sent/{senderId}")]
        public IActionResult GetPendingSentRequests(string senderId)
        {
            try
            {
                var list = server_codenames.BL.Friend.GetPendingSent(senderId);
                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("pending-received/{receiverId}")]
        public IActionResult GetPendingReceivedRequests(string receiverId)
        {
            try
            {
                var list = server_codenames.BL.Friend.GetPendingReceived(receiverId);
                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        [HttpPut("cancel")]
        public IActionResult CancelRequest([FromBody] CancelRequestPayload payload)
        {
            try
            {
                string result = Friend.CancelFriendRequest(payload.SenderID, payload.ReceiverID, payload.Action);
                return result == "RequestUpdated"
                    ? Ok(new { message = "Request updated successfully." })
                    : BadRequest(new { message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

    }

    // Payload model for friend request
    public class FriendRequestPayload
    {
        public string SenderID { get; set; }
        public string ReceiverQuery { get; set; } // Username or Email
    }

    // Payload model for cancel request
    public class CancelRequestPayload
    {
        public string SenderID { get; set; }
        public string ReceiverID { get; set; }
        public string Action { get; set; } // "cancel" or "decline"
    }
}
