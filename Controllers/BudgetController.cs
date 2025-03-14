using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

[ApiController]
[Route("[controller]")]
public class BudgetController : ControllerBase
{
    private readonly MongoDBService _mongoDBService;
    private readonly ILogger<BudgetController> _logger;

    public BudgetController(MongoDBService mongoDBService, ILogger<BudgetController> logger)
    {
        _mongoDBService = mongoDBService;
        _logger = logger;
    }

    [HttpGet("check/{userId}/{year}/{month}")]
    public async Task<IActionResult> CheckBudgetForMonth(string userId, int year, int month)
    {
        _logger.LogInformation($"Verificando presupuesto para el usuario {userId}, año {year}, mes {month}");

        if (string.IsNullOrWhiteSpace(userId) || year <= 0 || month <= 0 || month > 12)
        {
            _logger.LogWarning("Parámetros de solicitud inválidos.");
            return BadRequest("Invalid request parameters");
        }

        var budget = await _mongoDBService.GetBudgetForMonthAsync(userId, year, month);
        if (budget != null)
        {
            return Ok(budget);
        }

        _logger.LogWarning($"No se encontró presupuesto para el usuario {userId}, año {year}, mes {month}");
        return NotFound();
    }

    [HttpPost("save")]
    public async Task<IActionResult> SaveBudget([FromBody] Budget budget)
    {
        _logger.LogInformation($"Guardando presupuesto para el usuario {budget.UserId}, año {budget.Year}, mes {budget.Month}");

        if (budget == null || string.IsNullOrWhiteSpace(budget.UserId) || budget.Year <= 0 || budget.Month <= 0 || budget.Month > 12 || budget.Amount <= 0)
        {
            _logger.LogWarning("Datos de presupuesto inválidos.");
            return BadRequest("Invalid budget data");
        }

        await _mongoDBService.SaveBudgetAsync(budget);
        return Ok();
    }
}
