using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Budget
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; } = null;  // Permitir que Id sea opcional

    [BsonElement("userId")]
    public string UserId { get; set; } = string.Empty;

    [BsonElement("year")]
    public int Year { get; set; }

    [BsonElement("month")]
    public int Month { get; set; }

    [BsonElement("amount")]
    public double Amount { get; set; }
}
