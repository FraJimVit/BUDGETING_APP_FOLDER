using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.SwaggerGen;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Configura los servicios
builder.Services.Configure<MongoDBSettings>(
    builder.Configuration.GetSection("MongoDBSettings"));

builder.Services.AddSingleton<MongoDBService>();

builder.Services.AddControllers();

// Configura CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        builder =>
        {
            builder.WithOrigins("http://localhost:4200")
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

// Configura Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
});

var app = builder.Build();

// Configura el middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API v1"));
}

app.UseHttpsRedirection();
app.UseAuthorization();

// Usar CORS
app.UseCors("AllowAngularApp");

app.MapControllers();
app.Run();






// using Microsoft.EntityFrameworkCore;
// using MinimalApi;

// var builder = WebApplication.CreateBuilder(args);

// builder.Services.AddDbContext<ShopContext>(opts => opts.UseInMemoryDatabase("Shop"));
// builder.Services.AddCors(opts => opts.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

// var app = builder.Build();

// app.MapGet("/", (ShopContext db) =>
// {
//     db.Database.EnsureCreated();
//     return db.Product.ToList();
// });

// app.MapGet("/{id}", (int id, ShopContext db) => db.Product.Find(id));

// app.MapPost("/", (Product body, ShopContext db) =>
// {
//     db.Product.Add(body);
//     db.SaveChanges();

//     return body.Id;
// });

// app.MapPut("/", (Product body, ShopContext db) =>
// {
//     var product = db.Product.Find(body.Id);
//     if (product is null) Results.NotFound();

//     product.Name = body.Name;
//     product.Price = body.Price;

//     db.SaveChanges();

//     return Results.NoContent();
// });

// app.MapDelete("/{id}", (int id, ShopContext db) =>
// {
//     var product = db.Product.Find(id);
//     if (product is null) Results.NotFound();

//     db.Remove(product);
//     db.SaveChanges();

//     return Results.NoContent();
// });

// app.UseCors();

// app.Run();
