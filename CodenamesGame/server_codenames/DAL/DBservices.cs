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
        //--------------------------------------------------------------------------------------------------
        // GAME
        //--------------------------------------------------------------------------------------------------
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
        public bool RegisterUserDB(User user)
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
                throw ex;
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
            catch (Exception ex)
            {
                // Log the exception
                throw ex;
            }
            finally
            {
                if (con != null)
                {
                    con.Close(); // Close the DB connection
                }
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
