using System;
using System.Data.SqlClient;
using server_codenames.DAL;

var builder = WebApplication.CreateBuilder(args);

// 📌 בדיקת חיבור למסד הנתונים לפני הפעלת השרת
string connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
try
{
    using (SqlConnection conn = new SqlConnection(connectionString))
    {
        conn.Open();
        Console.WriteLine("✅ התחברת בהצלחה למסד הנתונים!");
    }
}
catch (Exception ex)
{
    Console.WriteLine("❌ שגיאה בהתחברות ל-SQL: " + ex.Message);
}

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddScoped<UserDAL>(); // הוספת מחלקת ה-DAL ל-Dependency Injection

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
