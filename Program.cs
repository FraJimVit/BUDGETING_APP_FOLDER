using Microsoft.EntityFrameworkCore;
using MinimalApi;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ShopContext>(opts => opts.UseInMemoryDatabase("Shop"));
builder.Services.AddCors(opts => opts.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

app.MapGet("/", (ShopContext db) =>
{
    db.Database.EnsureCreated();
    return db.Product.ToList();
});

app.MapGet("/{id}", (int id, ShopContext db) => db.Product.Find(id));

app.MapPost("/", (Product body, ShopContext db) =>
{
    db.Product.Add(body);
    db.SaveChanges();

    return body.Id;
});

app.MapPut("/", (Product body, ShopContext db) =>
{
    var product = db.Product.Find(body.Id);
    if (product is null) Results.NotFound();

    product.Name = body.Name;
    product.Price = body.Price;

    db.SaveChanges();

    return Results.NoContent();
});

app.MapDelete("/{id}", (int id, ShopContext db) =>
{
    var product = db.Product.Find(id);
    if (product is null) Results.NotFound();

    db.Remove(product);
    db.SaveChanges();

    return Results.NoContent();
});

app.UseCors();

app.Run();
