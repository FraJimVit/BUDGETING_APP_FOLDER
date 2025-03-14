using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

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

    [HttpGet("{id}")]
    public async Task<IActionResult> GetExpenseById(string id)
    {
        var expense = await _mongoDBService.GetExpenseByIdAsync(id);
        if (expense == null)
        {
            return NotFound();
        }
        return Ok(expense);
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetExpensesByUserId(string userId)
    {
        var expenses = await _mongoDBService.GetExpensesByUserIdAsync(userId);
        return Ok(expenses);
    }

    [HttpGet("budget/{monthlyBudgetId}")]
    public async Task<IActionResult> GetExpensesByMonthlyBudgetId(string monthlyBudgetId)
    {
        var expenses = await _mongoDBService.GetExpensesByMonthlyBudgetIdAsync(monthlyBudgetId);
        return Ok(expenses);
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateExpenses([FromBody] List<Expense> expenses)
    {
        if (expenses == null || expenses.Count == 0)
        {
            return BadRequest(new { success = false, message = "No expenses provided." });
        }

        foreach (var expense in expenses)
        {
            // Llama al método del servicio para verificar si el gasto existe
            if (!await _mongoDBService.ExpenseExistsAsync(expense))
            {
                await _mongoDBService.CreateExpenseAsync(expense);
            }
        }

        return Ok(new { success = true, message = "Expenses saved successfully." });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateExpense(string id, [FromBody] Expense expense)
    {
        if (expense == null || expense.Id != id)
        {
            return BadRequest("Expense ID mismatch");
        }

        var existingExpense = await _mongoDBService.GetExpenseByIdAsync(id);
        if (existingExpense == null)
        {
            return NotFound();
        }

        await _mongoDBService.UpdateExpenseAsync(id, expense);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteExpense(string id)
    {
        var existingExpense = await _mongoDBService.GetExpenseByIdAsync(id);
        if (existingExpense == null)
        {
            return NotFound();
        }

        await _mongoDBService.DeleteExpenseAsync(id);
        return NoContent();
    }
}
