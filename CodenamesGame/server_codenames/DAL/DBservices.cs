using server_codenames.BL;
using System.Data.SqlClient;
using System.Data;
using server_codenames.Controllers;
using System.Diagnostics;

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
                    GameID = gameId, 
                    UserID = reader["UserID"].ToString(),
                    Team = reader["Team"].ToString(),
                    IsSpymaster = Convert.ToBoolean(reader["IsSpymaster"]),
                    Username = reader["Username"].ToString() // ✅ נוספה שליפת שם משתמש
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
                // ✅ בדיקה אם משתמש הוא לוחש
        public bool IsUserSpymaster(int gameId, string userId)
        {
            SqlConnection con = null;
            try
            {
                con = connect("myProjDB");
                SqlCommand cmd = new SqlCommand("SELECT IsSpymaster FROM PlayersInGame WHERE GameID = @GameID AND UserID = @UserID", con);
                cmd.Parameters.AddWithValue("@GameID", gameId);
                cmd.Parameters.AddWithValue("@UserID", userId);
                object result = cmd.ExecuteScalar();
                return result != null && Convert.ToBoolean(result);
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
            // ✅ Get Board For Player (Spymaster sees teams, Agent only revealed)
            public List<Card> GetBoardForPlayer(int gameId, string userId)
        {
            List<Card> cards = new List<Card>();
            SqlConnection con = null;

            try
            {
                con = connect("myProjDB");

                SqlCommand cmd = new SqlCommand("sp_GetBoardForPlayer", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@GameID", gameId);
                cmd.Parameters.AddWithValue("@UserID", userId);

                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    Card card = new Card
                    {
                        CardID = Convert.ToInt32(reader["CardID"]),
                        GameID = Convert.ToInt32(reader["GameID"]),
                        Word = reader["Word"].ToString(),
                        IsRevealed = Convert.ToBoolean(reader["IsRevealed"]),
                        Team = reader["Team"] == DBNull.Value ? null : reader["Team"].ToString()
                    };
                    cards.Add(card);
                }

                return cards;
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

    public bool InsertCards(List<Card> cards)
        {
            SqlConnection con = connect("myProjDB");

            try
            {
                foreach (var card in cards)
                {
                    SqlCommand cmd = CreateCommandWithStoredProcedure("sp_InsertCard", con, new Dictionary<string, object>
                    {            
                        { "@GameID", card.GameID },
                        { "@Word", card.Word },
                        { "@Team", card.Team },
                        { "@IsRevealed", card.IsRevealed }
                    });

                    cmd.ExecuteNonQuery();
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ שגיאה בהוספת קלפים: " + ex.Message);  // <--- הוספה כאן
                return false;
            }
            finally
            {
                con.Close();
            }

    }
    public List<Card> GetCardsForGame(int gameId)
{
    List<Card> cards = new List<Card>();
    SqlConnection con = null;

    try
    {
        con = connect("myProjDB");

        SqlCommand cmd = new SqlCommand("sp_GetCardsForGame", con);
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.AddWithValue("@GameID", gameId);

        SqlDataReader reader = cmd.ExecuteReader();
        while (reader.Read())
        {
            Card card = new Card
            {
                CardID = Convert.ToInt32(reader["CardID"]),
                GameID = Convert.ToInt32(reader["GameID"]),
                Word = reader["Word"].ToString(),
                Team = reader["Team"].ToString(),
                IsRevealed = Convert.ToBoolean(reader["IsRevealed"])
            };

            cards.Add(card);
        }

        return cards;
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

    public bool RevealCard(int cardId)
    {
        SqlConnection con = connect("myProjDB");

        SqlCommand cmd = new SqlCommand("UPDATE Cards SET IsRevealed = 1 WHERE CardID = @CardID", con);
        cmd.Parameters.AddWithValue("@CardID", cardId);

        int affected = cmd.ExecuteNonQuery();
        con.Close();

        return affected > 0;
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
            { "@Username", player.Username }, // ✅ הוספת שם משתמש להצטרפות
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
        { "@Username", player.Username }, // ✅ הוספת שם משתמש לעדכון
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

        //--------------------------------------------------------------------------------------------------
        // FRIENDS
        //--------------------------------------------------------------------------------------------------
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

        public string AcceptFriendRequestAndInsertFriendship(string senderID, string receiverID)
        {
            Debug.WriteLine("==> DB Start: AcceptFriendRequestAndInsertFriendship");
            Debug.WriteLine("SenderID: " + senderID);
            Debug.WriteLine("ReceiverID: " + receiverID);

            SqlConnection con = connect("myProjDB"); // already opened here

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            paramDic.Add("@SenderID", senderID);
            paramDic.Add("@ReceiverID", receiverID);

            SqlCommand cmd = CreateCommandWithStoredProcedure("AcceptFriendRequestAndInsertFriendship", con, paramDic);

            try
            {
                string result = "Error";

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        result = reader["Result"].ToString();
                        Debug.WriteLine("==> DB RESULT: " + result);
                    }
                    else
                    {
                        Debug.WriteLine("==> DB RESULT: NO ROWS RETURNED");
                    }
                }

                Debug.WriteLine("==> DB FINAL RESULT TO RETURN: " + result);
                return result;
            }
            catch (Exception ex)
            {
                Debug.WriteLine("==> DB ERROR: " + ex.Message);
                return "Error";
            }
            finally
            {
                con.Close();
            }
        }

        // Gets list of friends for a given user UID
        public List<Dictionary<string, object>> GetFriendsByUserID(string userId)
        {
            Debug.WriteLine("==> DB Start: GetFriendsByUserID for userId = " + userId);

            SqlConnection con = connect("myProjDB");
            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            paramDic.Add("@UserID", userId);

            SqlCommand cmd = CreateCommandWithStoredProcedure("GetFriendsByUserID", con, paramDic);

            try
            {
                List<Dictionary<string, object>> results = new List<Dictionary<string, object>>();

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        Dictionary<string, object> row = new Dictionary<string, object>();
                        row["UserID"] = reader["UserID"].ToString();
                        row["Username"] = reader["Username"].ToString();
                        row["Email"] = reader["Email"].ToString();
                        row["FriendshipDate"] = Convert.ToDateTime(reader["FriendshipDate"]).ToString("yyyy-MM-dd");

                        results.Add(row);
                    }
                }

                Debug.WriteLine("==> DB GetFriendsByUserID: Found " + results.Count + " friends.");
                return results;
            }
            catch (Exception ex)
            {
                Debug.WriteLine("==> DB ERROR GetFriendsByUserID: " + ex.Message);
                return new List<Dictionary<string, object>>();
            }
            finally
            {
                con.Close();
            }
        }

        // Removes a friend and updates last FriendRequest to 'Unfriended'
        public string RemoveFriendshipAndUpdateStatus(string userId, string friendId)
        {
            Debug.WriteLine("==> DB Start: RemoveFriendshipAndUpdateStatus");
            Debug.WriteLine("UserID: " + userId);
            Debug.WriteLine("FriendID: " + friendId);

            SqlConnection con = connect("myProjDB");
            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            paramDic.Add("@UserID", userId);
            paramDic.Add("@FriendID", friendId);

            SqlCommand cmd = CreateCommandWithStoredProcedure("RemoveFriendshipAndUpdateStatus", con, paramDic);

            try
            {
                string result = "Error";

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        result = reader["Result"].ToString();
                        Debug.WriteLine("==> DB RESULT: " + result);
                    }
                    else
                    {
                        Debug.WriteLine("==> DB RESULT: NO ROWS RETURNED");
                    }
                }

                Debug.WriteLine("==> DB FINAL RESULT TO RETURN: " + result);
                return result;
            }
            catch (Exception ex)
            {
                Debug.WriteLine("==> DB ERROR: " + ex.Message);
                return "Error";
            }
            finally
            {
                con.Close();
            }
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
