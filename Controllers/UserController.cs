using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly MongoDBService _mongoDBService;

    public UserController(MongoDBService mongoDBService)
    {
        _mongoDBService = mongoDBService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser(User user)
    {
        try
        {
            await _mongoDBService.CreateUserAsync(user);
            return Ok();
        }
        catch (Exception ex)
        {
            // Agregar logging de errores para detalles adicionales
            Console.WriteLine($"Error al registrar el usuario: {ex.Message}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}
