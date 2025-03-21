using Server_codenames.DAL;

namespace server_codenames.BL
{
    public class Friend
    {
        public string UserID { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }

        public Friend() { }

        // Static method to send a friend request
        public static string SendFriendRequest(string senderId, string receiverQuery)
        {
            DBservices dbs = new DBservices();
            return dbs.SendFriendRequestDB(senderId, receiverQuery);
        }



    }
}
