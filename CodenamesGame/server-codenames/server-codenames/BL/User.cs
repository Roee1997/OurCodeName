using System;
using System.Collections.Generic;
using System.Linq;


//namespace server_codenames.BL
//{
//    public class User
//    {
//        public int UserID { get; set; }
//        public string Username { get; set; }
//        public string Email { get; set; }
//        public string PasswordHash { get; set; }
//        public DateTime RegistrationDate { get; set; }
//        public List<int> Friends { get; set; } = new List<int>();

//        public User() { }

//        public User(string username, string email, string passwordHash)
//        {
//            Username = username;
//            Email = email;
//            PasswordHash = passwordHash;
//            RegistrationDate = DateTime.Now;
//        }

//        public void AddFriend(int friendId)
//        {
//            if (!Friends.Contains(friendId))
//                Friends.Add(friendId);
//        }

//        public void RemoveFriend(int friendId)
//        {
//            Friends.Remove(friendId);
//        }
//    }
//}

namespace server_codenames.BL
{
    public class User
    {
        public int UserID { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public DateTime RegistrationDate { get; set; }


        public User(int userID, string username, string email, string passwordHash, DateTime registrationDate)
        {
            UserID = userID;
            Username = username;
            Email = email;
            PasswordHash = passwordHash;
            RegistrationDate = DateTime.Now;
        }
        public override string ToString()
        {
            return $"UserID: {UserID}, Username: {Username}, Email: {Email}, Registration Date: {RegistrationDate}";
        }

    }
}
