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


        public static List<server_codenames.BL.Users> GetPendingSent(string senderId)
        {
            DBservices dbs = new DBservices();
            return dbs.GetPendingFriendRequestsSent(senderId);
        }


        public static List<server_codenames.BL.Users> GetPendingReceived(string receiverId)
        {
            DBservices dbs = new DBservices();
            return dbs.GetPendingFriendRequestsReceived_DB(receiverId);
        }


        public static string CancelFriendRequest(string senderId, string receiverId, string action)
        {
            DBservices dbs = new DBservices();
            return dbs.CancelFriendRequestDB(senderId, receiverId, action);
        }

    }
}
