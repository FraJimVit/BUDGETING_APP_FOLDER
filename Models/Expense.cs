using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Expense
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; } = null;  // Permitir que Id sea opcional

    [BsonElement("userId")]
    public string UserId { get; set; } = string.Empty;

    [BsonElement("budgetId")]
    public string BudgetId { get; set; } = string.Empty;

    [BsonElement("date")]
    public DateTime Date { get; set; }

    [BsonElement("category")]
    public string Category { get; set; } = string.Empty;

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("amount")]
    public double Amount { get; set; }
}
