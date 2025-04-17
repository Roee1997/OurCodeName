using server_codenames.BL;
using System.Data.SqlClient;
using System.Data;
using server_codenames.Controllers;

namespace Server_codenames.DAL
{
    public class DBservices
    {
        public SqlDataAdapter da;
        public DataTable dt;

        public DBservices()
        {
            //
            // TODO: Add constructor logic here
            //
        }
        //--------------------------------------------------------------------------------------------------
        // This method creates a connection to the database according to the connectionString name in the web.config 
        //--------------------------------------------------------------------------------------------------
        public SqlConnection connect(String conString)
        {

            // read the connection string from the configuration file
            IConfigurationRoot configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json").Build();
            string cStr = configuration.GetConnectionString("myProjDB");
            SqlConnection con = new SqlConnection(cStr);
            con.Open();
            return con;
        }
        //--------------------------------------------------------------------------------------------------
        // PLAYER IN GAME
        //--------------------------------------------------------------------------------------------------
        public List<PlayerInGame> GetPlayersInGame(int gameId)
{
    List<PlayerInGame> players = new List<PlayerInGame>();
    SqlConnection con = null;

    try
    {
        con = connect("myProjDB");

        SqlCommand cmd = new SqlCommand("sp_GetPlayersInGame", con);
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.AddWithValue("@GameID", gameId);

        SqlDataReader reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            PlayerInGame player = new PlayerInGame
            {
                UserID = reader["UserID"].ToString(),
                
                Team = reader["Team"].ToString(),
                IsSpymaster = Convert.ToBoolean(reader["IsSpymaster"])
            };
            players.Add(player);
        }

        return players;
    }
    catch (Exception ex)
    {
        throw ex;
    }
    finally
    {
        if (con != null)
            con.Close();
    }
}
        public bool JoinGame(PlayerInGame player)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB");
            }
            catch (Exception ex)
            {
                throw ex;
            }

            try
            {
                Dictionary<string, object> paramDic = new Dictionary<string, object>
        {
            { "@GameID", player.GameID },
            { "@UserID", player.UserID },
            { "@Team", player.Team },
            { "@IsSpymaster", player.IsSpymaster }
        };

                cmd = CreateCommandWithStoredProcedure("sp_JoinGame", con, paramDic);
                int affected = cmd.ExecuteNonQuery();
                return affected > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (con != null)
                    con.Close();
            }
        }


        public bool UpdatePlayer(PlayerInGame player)
{
    SqlConnection con = connect("myProjDB");

    Dictionary<string, object> paramDic = new Dictionary<string, object>
    {
        { "@GameID", player.GameID },
        { "@UserID", player.UserID },
        { "@Team", player.Team },
        { "@IsSpymaster", player.IsSpymaster }
    };

    SqlCommand cmd = CreateCommandWithStoredProcedure("sp_UpdatePlayer", con, paramDic);
    int affected = cmd.ExecuteNonQuery();
    con.Close();

    return affected > 0;
}
        //--------------------------------------------------------------------------------------------------
        // GAME
        //--------------------------------------------------------------------------------------------------
        
        
        public bool IsGameJoinable(int gameId)
{
    SqlConnection con = connect("myProjDB");

    Dictionary<string, object> paramDic = new Dictionary<string, object>
    {
        { "@GameID", gameId }
    };

    SqlCommand cmd = CreateCommandWithStoredProcedure("sp_IsGameJoinable", con, paramDic);
    SqlDataReader reader = cmd.ExecuteReader();

    if (reader.Read())
    {
        return Convert.ToBoolean(reader["Joinable"]);
    }

    return false;
}
        
        
        public int CreateGame(Game game)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB"); // יצירת החיבור
            }
            catch (Exception ex)
            {
                throw ex;
            }

            try
            {
                cmd = new SqlCommand("sp_CreateGame", con);
                cmd.CommandType = CommandType.StoredProcedure;

                // קלט
                cmd.Parameters.AddWithValue("@CreatedBy", game.CreatedBy);

                // פלט
                SqlParameter outputParam = new SqlParameter("@GameID", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(outputParam);

                cmd.ExecuteNonQuery();

                // החזרת GameID שנוצר
                return (int)outputParam.Value;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        //--------------------------------------------------------------------------------------------------
        // USER
        //--------------------------------------------------------------------------------------------------
        public bool RegisterUserDB(server_codenames.BL.Users user)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB"); // Create the connection
            }
            catch (Exception ex)
            {
                // Log the exception
                throw new Exception("❌ Database connection failed.", ex);
            }

            // Dictionary to store parameters for the stored procedure
            Dictionary<string, object> paramDic = new Dictionary<string, object>
    {
        { "@UserID", user.UserID },
        { "@Username", user.Username },
        { "@Email", user.Email }
    };

            cmd = CreateCommandWithStoredProcedure("RegisterUser", con, paramDic); // Execute the stored procedure

            try
            {
                int numEffected = cmd.ExecuteNonQuery();
                return numEffected > 0; // Return true if the user was successfully inserted
            }
            catch (SqlException ex)
            {
                if (ex.Message.Contains("Username already exists"))
                {
                    throw new Exception("⚠️ הכינוי כבר קיים במערכת. נסה כינוי אחר.");
                }
                else if (ex.Message.Contains("Email already exists"))
                {
                    throw new Exception("⚠️ האימייל כבר קיים במערכת. נסה להתחבר.");
                }
                else
                {
                    throw new Exception("❌ שגיאה בשרת. נסה שוב מאוחר יותר.", ex);
                }
            }
            finally
            {
                if (con != null)
                {
                    con.Close(); // Close the DB connection
                }
            }

        }
        public bool DoesUsernameExistDB(string username)
        {
            using (var connection = connect("myProjDB"))
            {
                Dictionary<string, object> paramUsername = new Dictionary<string, object>
        {
            { "@Username", username }
        };

                SqlCommand cmd = CreateCommandWithStoredProcedure("DoesUsernameExist", connection, paramUsername);
                int exists = (int)cmd.ExecuteScalar();
                return exists == 1; // ✅ Returns true if username exists, false otherwise
            }
        }

        //find user to add to friend list
        public server_codenames.BL.Users GetUserByUsernameOrID_DB(string query)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB");
            }
            catch (Exception ex)
            {
                throw new Exception("Database connection failed.", ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>
    {
        { "@Query", query }
    };

            cmd = CreateCommandWithStoredProcedure("GetUserByUsernameOrID", con, paramDic);

            try
            {
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    server_codenames.BL.Users user = new server_codenames.BL.Users
                    {
                        UserID = reader["UserID"].ToString(),
                        Username = reader["Username"].ToString(),
                        Email = reader["Email"].ToString(),
                        RegistrationDate = Convert.ToDateTime(reader["RegistrationDate"])
                    };
                    return user;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to read user.", ex);
            }
            finally
            {
                if (con != null)
                    con.Close();
            }
        }




        //create a pending friend request
        public string SendFriendRequestDB(string senderId, string receiverQuery)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("❌ Failed to connect: " + ex.Message);
                throw new Exception("Database connection failed.", ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>
    {
        { "@SenderID", senderId },
        { "@ReceiverQuery", receiverQuery }
    };

            cmd = CreateCommandWithStoredProcedure("SendFriendRequest", con, paramDic);

            try
            {
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        string result = reader["Result"].ToString();
                        System.Diagnostics.Debug.WriteLine("📥 Result from SQL: " + result);
                        return result;
                    }
                }

                return "NoResponse";
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("❌ SQL Error: " + ex.Message);
                throw;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                    System.Diagnostics.Debug.WriteLine("🔄 Connection closed.");
                }
            }
        }

        //get pending friend requests to users that I sent them.
        public List<server_codenames.BL.Users> GetPendingFriendRequestsSent(string senderId)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect("myProjDB");
            }
            catch (Exception ex)
            {
                throw new Exception("Database connection failed.", ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>
    {
        { "@SenderID", senderId }
    };

            cmd = CreateCommandWithStoredProcedure("GetPendingFriendRequestsSent", con, paramDic);

            List<server_codenames.BL.Users> pending = new List<server_codenames.BL.Users>();

            try
            {
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    server_codenames.BL.Users u = new server_codenames.BL.Users
                    {
                        UserID = reader["ReceiverID"].ToString(),
                        Username = reader["Username"].ToString(),
                        Email = reader["Email"].ToString()
                    };
                    pending.Add(u);
                }

                return pending;
            }
            catch (Exception ex)
            {
                throw new Exception("Error reading pending friend requests.", ex);
            }
            finally
            {
                if (con != null)
                    con.Close();
            }
        }


        public List<server_codenames.BL.Users> GetPendingFriendRequestsReceived_DB(string receiverId)
        {
            SqlConnection con;
            SqlCommand cmd;
            List<server_codenames.BL.Users> users = new List<server_codenames.BL.Users>();

            try
            {
                con = connect("myProjDB");
            }
            catch (Exception ex)
            {
                throw new Exception("Database connection failed.", ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>
    {
        { "@ReceiverID", receiverId }
    };

            cmd = CreateCommandWithStoredProcedure("GetPendingFriendRequestsReceived", con, paramDic);

            try
            {
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    server_codenames.BL.Users u = new server_codenames.BL.Users
                    {
                        UserID = reader["UserID"].ToString(),
                        Username = reader["Username"].ToString(),
                        Email = reader["Email"].ToString()
                    };
                    users.Add(u);
                }
                return users;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to fetch pending friend requests.", ex);
            }
            finally
            {
                if (con != null)
                    con.Close();
            }
        }

        public string CancelFriendRequestDB(string senderId, string receiverId, string action)
        {
            SqlConnection con;
            SqlCommand cmd;

            try { con = connect("myProjDB"); }
            catch (Exception ex) { throw new Exception("DB connection failed", ex); }

            Dictionary<string, object> paramDic = new Dictionary<string, object>
    {
        { "@SenderID", senderId },
        { "@ReceiverID", receiverId },
        { "@Action", action }
    };

            cmd = CreateCommandWithStoredProcedure("CancelFriendRequest", con, paramDic);

            try
            {
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    return reader["Result"].ToString();
                }
                return "Error";
            }
            catch (Exception ex)
            {
                throw new Exception("❌ Failed to cancel/decline request", ex);
            }
            finally { if (con != null) con.Close(); }
        }


        //---------------------------------------------------------------------------------
        // Create the SqlCommand using a stored procedure
        //---------------------------------------------------------------------------------
        private SqlCommand CreateCommandWithStoredProcedure(String spName, SqlConnection con, Dictionary<string, object> paramDic)
        {

            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

            //check if Dictionary not null and add to cmd
            if (paramDic != null)
                foreach (KeyValuePair<string, object> param in paramDic)
                {
                    cmd.Parameters.AddWithValue(param.Key, param.Value);

                }
            return cmd;
        }
    }
}
