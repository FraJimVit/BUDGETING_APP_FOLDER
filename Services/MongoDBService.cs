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

    public async Task<User> AuthenticateAsync(string username, string password)
    {
        var filter = Builders<User>.Filter.Eq(u => u.Username, username) & Builders<User>.Filter.Eq(u => u.Password, password);
        return await _usersCollection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<User> GetUserByUsernameAsync(string username)
    {
        var filter = Builders<User>.Filter.Eq(u => u.Username, username);
        return await _usersCollection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<bool> UpdateUserAsync(string id, User user)
    {
        var filter = Builders<User>.Filter.Eq(u => u.Id, id);
        var updateResult = await _usersCollection.ReplaceOneAsync(filter, user);

        return updateResult.IsAcknowledged && updateResult.ModifiedCount > 0;
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
        return result["seq"].ToInt64();
    }

    public async Task CreateUserAsync(User user)
    {
        user.Id = (await GetNextSequenceValue("userId")).ToString();
        await _usersCollection.InsertOneAsync(user);
    }
}
