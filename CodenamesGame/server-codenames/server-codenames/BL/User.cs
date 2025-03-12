namespace server_codenames.BL
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class User
    {
        public int UserID { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public DateTime RegistrationDate { get; set; }
        public List<int> Friends { get; set; } = new List<int>();

        public User() { }

        public User(string username, string email, string passwordHash)
        {
            Username = username;
            Email = email;
            PasswordHash = passwordHash;
            RegistrationDate = DateTime.Now;
        }

        public void AddFriend(int friendId)
        {
            if (!Friends.Contains(friendId))
                Friends.Add(friendId);
        }

        public void RemoveFriend(int friendId)
        {
            Friends.Remove(friendId);
        }
    }
}
