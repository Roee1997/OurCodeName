//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using System.Data.SqlClient;


//namespace server_codenames.Controllers
//{
//    private readonly string connectionString = "Server=Media.ruppin.ac.il;Database=igroup181_test1;User ID=igroup181;Password=YOUR_PASSWORD";

//    [HttpGet("search")]
//    public IActionResult SearchUser([FromQuery] string query)
//    {
//        using (SqlConnection con = new SqlConnection(connectionString))
//        {
//            string sql = "SELECT UserID, Username, Email FROM Users WHERE Username LIKE @Query OR UserID = @Query";
//            SqlCommand cmd = new SqlCommand(sql, con);
//            cmd.Parameters.AddWithValue("@Query", $"%{query}%");

//            con.Open();
//            SqlDataReader reader = cmd.ExecuteReader();
//            if (!reader.HasRows) return NotFound("User not found.");

//            reader.Read();
//            var user = new
//            {
//                UserID = reader.GetInt32(0),
//                Username = reader.GetString(1),
//                Email = reader.GetString(2)
//            };
//            return Ok(user);
//        }
//    }

//    [HttpPost("add")]
//    public IActionResult AddFriend([FromBody] dynamic request)
//    {
//        int userID1 = 1; // המשתמש המחובר (צריך לשנות בהמשך לפי מערכת ההזדהות)
//        int userID2 = request.friendId;

//        using (SqlConnection con = new SqlConnection(connectionString))
//        {
//            string sql = "INSERT INTO Friends (UserID1, UserID2) VALUES (@UserID1, @UserID2), (@UserID2, @UserID1)";
//            SqlCommand cmd = new SqlCommand(sql, con);
//            cmd.Parameters.AddWithValue("@UserID1", userID1);
//            cmd.Parameters.AddWithValue("@UserID2", userID2);

//            con.Open();
//            int rowsAffected = cmd.ExecuteNonQuery();
//            if (rowsAffected > 0) return Ok("Friend added successfully.");
//            return BadRequest("Failed to add friend.");
//        }
//    }

//    [HttpGet("all")]
//    public IActionResult GetFriends()
//    {
//        int userID = 1; // המשתמש המחובר (להחליף לפי הזדהות)

//        using (SqlConnection con = new SqlConnection(connectionString))
//        {
//            string sql = "SELECT U.UserID, U.Username, U.Email FROM Users U JOIN Friends F ON U.UserID = F.UserID2 WHERE F.UserID1 = @UserID";
//            SqlCommand cmd = new SqlCommand(sql, con);
//            cmd.Parameters.AddWithValue("@UserID", userID);

//            con.Open();
//            SqlDataReader reader = cmd.ExecuteReader();

//            List<object> friends = new List<object>();
//            while (reader.Read())
//            {
//                friends.Add(new
//                {
//                    UserID = reader.GetInt32(0),
//                    Username = reader.GetString(1),
//                    Email = reader.GetString(2)
//                });
//            }
//            return Ok(friends);
//        }
//    }

//    [HttpDelete("remove/{friendId}")]
//    public IActionResult RemoveFriend(int friendId)
//    {
//        int userID = 1; // המשתמש המחובר (לשנות לפי מערכת ההזדהות)

//        using (SqlConnection con = new SqlConnection(connectionString))
//        {
//            string sql = "DELETE FROM Friends WHERE (UserID1 = @UserID AND UserID2 = @FriendID) OR (UserID1 = @FriendID AND UserID2 = @UserID)";
//            SqlCommand cmd = new SqlCommand(sql, con);
//            cmd.Parameters.AddWithValue("@UserID", userID);
//            cmd.Parameters.AddWithValue("@FriendID", friendId);

//            con.Open();
//            int rowsAffected = cmd.ExecuteNonQuery();
//            if (rowsAffected > 0) return Ok("Friend removed successfully.");
//            return BadRequest("Failed to remove friend.");
//        }
//    }
//}
