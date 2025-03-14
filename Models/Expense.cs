using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Expense
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonElement("userId")]
    public string UserId { get; set; }

    [BsonElement("monthlyBudgetId")]
    public string MonthlyBudgetId { get; set; }

    [BsonElement("date")]
    public DateTime Date { get; set; }

    [BsonElement("name")]
    public string Name { get; set; }

    [BsonElement("amount")]
    public decimal Amount { get; set; }
    
    [BsonElement("categoryName")]
    public string CategoryName { get; set; }
}
