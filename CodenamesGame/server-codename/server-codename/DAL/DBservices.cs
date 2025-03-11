using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace server_codename.DAL
{
    public class DBservices
    {
        private readonly string connectionString;

        public DBservices()
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json").Build();
            connectionString = configuration.GetConnectionString("CodenamesDB");
        }

        public SqlConnection Connect()
        {
            SqlConnection con = new SqlConnection(connectionString);
            con.Open();
            return con;
        }
    }
}
