using server_codenames.Controllers;
using Server_codenames.DAL;

namespace server_codenames.BL
{
    public class User
    {

        private string userID;
        private string username;
        private string email;
        private DateTime registrationDate;

        public User(string userID, string username, string email, DateTime registrationDate)
        {
            UserID = userID;
            Username = username;
            Email = email;
            RegistrationDate = registrationDate;
        }

        public string UserID { get => userID; set => userID = value; }
        public string Username { get => username; set => username = value; }
        public string Email { get => email; set => email = value; }
        public DateTime RegistrationDate { get => registrationDate; set => registrationDate = value; }


        public bool RegisterUser()
        {
            DBservices dbs = new DBservices();
            return dbs.RegisterUserDB(this);
        }

         public bool DoesUsernameExist()
{
    DBservices dbs = new DBservices(); // Create DB services instance
    return dbs.DoesUsernameExistDB(this.Username); // Pass the current username
}



    }
}
