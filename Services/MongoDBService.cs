using MongoDB.Driver;
using MongoDB.Bson;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;

public class MongoDBService
{
    private readonly IMongoCollection<User> _usersCollection;
    private readonly IMongoCollection<BsonDocument> _countersCollection;
    private readonly ILogger<MongoDBService> _logger;

    public MongoDBService(IOptions<MongoDBSettings> mongoDBSettings, ILogger<MongoDBService> logger)
    {
        var mongoClient = new MongoClient(mongoDBSettings.Value.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase(mongoDBSettings.Value.DatabaseName);
        _usersCollection = mongoDatabase.GetCollection<User>(mongoDBSettings.Value.UsersCollectionName);
        _countersCollection = mongoDatabase.GetCollection<BsonDocument>("counters");
        _logger = logger;
    }

    public async Task<User> AuthenticateAsync(string username, string password)
    {
        _logger.LogInformation($"Autenticando usuario: {username}");
        var filter = Builders<User>.Filter.Eq(u => u.Username, username) & Builders<User>.Filter.Eq(u => u.Password, password);
        var user = await _usersCollection.Find(filter).FirstOrDefaultAsync();
        if (user != null)
        {
            _logger.LogInformation($"Usuario autenticado: {username}");
        }
        else
        {
            _logger.LogWarning($"Fallo de autenticación para el usuario: {username}");
        }
        return user;
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
