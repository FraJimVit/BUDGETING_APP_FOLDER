using MongoDB.Driver;
using MongoDB.Bson;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using System.Collections.Generic;

public class MongoDBService
{
    private readonly IMongoCollection<Expense> _expensesCollection;
    private readonly IMongoCollection<Budget> _budgetsCollection;
    private readonly IMongoCollection<User> _usersCollection;
    private readonly IMongoCollection<BsonDocument> _countersCollection;

    public MongoDBService(IOptions<MongoDBSettings> mongoDBSettings)
    {
        var mongoClient = new MongoClient(mongoDBSettings.Value.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase(mongoDBSettings.Value.DatabaseName);
        _expensesCollection = mongoDatabase.GetCollection<Expense>("Expenses");
        _budgetsCollection = mongoDatabase.GetCollection<Budget>("Budgets");
        _usersCollection = mongoDatabase.GetCollection<User>(mongoDBSettings.Value.UsersCollectionName);
        _countersCollection = mongoDatabase.GetCollection<BsonDocument>("counters");
    }

    public async Task CreateExpenseAsync(Expense expense)
    {
        await _expensesCollection.InsertOneAsync(expense);
    }

    public async Task<List<Expense>> GetExpensesByDateAsync(string userId, string budgetId, DateTime date)
    {
        var filter = Builders<Expense>.Filter.Eq(e => e.UserId, userId) &
                     Builders<Expense>.Filter.Eq(e => e.BudgetId, budgetId) &
                     Builders<Expense>.Filter.Eq(e => e.Date, date);
        return await _expensesCollection.Find(filter).ToListAsync();
    }

    public async Task SaveBudgetAsync(Budget budget)
    {
        var filter = Builders<Budget>.Filter.Eq(b => b.UserId, budget.UserId) &
                    Builders<Budget>.Filter.Eq(b => b.Year, budget.Year) &
                    Builders<Budget>.Filter.Eq(b => b.Month, budget.Month);

        var update = Builders<Budget>.Update
                    .Set(b => b.Amount, budget.Amount);

        await _budgetsCollection.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true });
    }




    public async Task<Budget> GetBudgetForMonthAsync(string userId, int year, int month)
    {
        var filter = Builders<Budget>.Filter.Eq(b => b.UserId, userId) &
                     Builders<Budget>.Filter.Eq(b => b.Year, year) &
                     Builders<Budget>.Filter.Eq(b => b.Month, month);
        return await _budgetsCollection.Find(filter).FirstOrDefaultAsync();
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
