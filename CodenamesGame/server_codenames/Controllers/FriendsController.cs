using Microsoft.AspNetCore.Mvc;
using server_codenames.BL;
using System.Diagnostics;


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
        // Payload model for friend request
        public class FriendRequestPayload
        {
            public string SenderID { get; set; }
            public string ReceiverQuery { get; set; } // Username or Email
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
        // Payload model for cancel request
        public class CancelRequestPayload
        {
            public string SenderID { get; set; }
            public string ReceiverID { get; set; }
            public string Action { get; set; } // "cancel" or "decline"
        }


        [HttpPut("accept")]
        public IActionResult AcceptFriendRequest([FromBody] AcceptRequestPayload payload)
        {
            Debug.WriteLine("==> Controller: AcceptFriendRequest");
            Debug.WriteLine("SenderID: " + payload.SenderID);
            Debug.WriteLine("ReceiverID: " + payload.ReceiverID);

            try
            {
                string result = server_codenames.BL.Friend.AcceptFriendRequestAndInsertFriendship(payload.SenderID, payload.ReceiverID);
                Debug.WriteLine("==> Controller Result: " + result);

                if (result == "FriendshipCreated")
                    return Ok(new { message = "Friendship created successfully." });

                else if (result == "AlreadyFriends")
                    return Ok(new { message = "Users are already friends." });

                else if (result == "RequestNotFound")
                    return BadRequest(new { message = "No matching pending request found." });

                else
                    return BadRequest(new { message = result });
            }
            catch (Exception ex)
            {
                Debug.WriteLine("==> Controller EXCEPTION: " + ex.Message);
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // Payload class for accepting friend requests – contains SenderID and ReceiverID
        public class AcceptRequestPayload
        {
            public string SenderID { get; set; }
            public string ReceiverID { get; set; }
        }


        [HttpGet("{userId}")]
        public IActionResult GetFriends(string userId)
        {
            Debug.WriteLine("==> Controller: GetFriends called for userId = " + userId);

            try
            {
                var friends = server_codenames.BL.Friend.GetFriends(userId);
                return Ok(friends);
            }
            catch (Exception ex)
            {
                Debug.WriteLine("==> Controller ERROR: " + ex.Message);
                return StatusCode(500, new { message = ex.Message });
            }
        }


        [HttpPut("remove")]
        public IActionResult RemoveFriend([FromBody] RemoveFriendPayload payload)
        {
            Debug.WriteLine("==> Controller: RemoveFriend");
            Debug.WriteLine("UserID: " + payload.UserID);
            Debug.WriteLine("FriendID: " + payload.FriendID);

            try
            {
                string result = server_codenames.BL.Friend.RemoveFriend(payload.UserID, payload.FriendID);

                if (result == "FriendRemoved")
                    return Ok(new { message = "Friend removed successfully." });

                else
                    return BadRequest(new { message = result });
            }
            catch (Exception ex)
            {
                Debug.WriteLine("==> Controller EXCEPTION: " + ex.Message);
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // Payload class for removing friend
        public class RemoveFriendPayload
        {
            public string UserID { get; set; }
            public string FriendID { get; set; }
        }

    }








}
