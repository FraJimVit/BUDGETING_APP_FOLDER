using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

[ApiController]
[Route("[controller]")]
public class ExpenseController : ControllerBase
{
    private readonly MongoDBService _mongoDBService;
    private readonly ILogger<ExpenseController> _logger;

    public ExpenseController(MongoDBService mongoDBService, ILogger<ExpenseController> logger)
    {
        _mongoDBService = mongoDBService;
        _logger = logger;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateExpense([FromBody] Expense expense)
    {
        try
        {
            await _mongoDBService.CreateExpenseAsync(expense);
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error al crear el gasto: {ex.Message}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("{userId}/{budgetId}/{date}")]
    public async Task<IActionResult> GetExpensesByDate(string userId, string budgetId, DateTime date)
    {
        try
        {
            var expenses = await _mongoDBService.GetExpensesByDateAsync(userId, budgetId, date);
            return Ok(expenses);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error al obtener los gastos: {ex.Message}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}
