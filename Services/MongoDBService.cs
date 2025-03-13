using MongoDB.Driver;
using MongoDB.Bson;
using Microsoft.Extensions.Options;

public class MongoDBService
{
    private readonly IMongoCollection<User> _usersCollection;
    private readonly IMongoCollection<BsonDocument> _countersCollection;

    public MongoDBService(IOptions<MongoDBSettings> mongoDBSettings)
    {
        var mongoClient = new MongoClient(mongoDBSettings.Value.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase(mongoDBSettings.Value.DatabaseName);
        _usersCollection = mongoDatabase.GetCollection<User>(mongoDBSettings.Value.UsersCollectionName);
        _countersCollection = mongoDatabase.GetCollection<BsonDocument>("counters");
    }

    public async Task<long> GetNextSequenceValue(string sequenceName)
    {
        var filter = Builders<BsonDocument>.Filter.Eq("_id", sequenceName);
        var update = Builders<BsonDocument>.Update.Inc("seq", 1);
        var options = new FindOneAndUpdateOptions<BsonDocument>
        {
            ReturnDocument = ReturnDocument.After,
            IsUpsert = true
        };
        var result = await _countersCollection.FindOneAndUpdateAsync(filter, update, options);
        return result["seq"].ToInt64();  // Asegúrate de convertir el valor a Int64
    }

    public async Task CreateUserAsync(User user)
    {
        user.Id = (await GetNextSequenceValue("userId")).ToString();
        await _usersCollection.InsertOneAsync(user);
    }
}
