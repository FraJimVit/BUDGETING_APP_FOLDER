using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly MongoDBService _mongoDBService;
    private readonly ILogger<UserController> _logger;

    public UserController(MongoDBService mongoDBService, ILogger<UserController> logger)
    {
        _mongoDBService = mongoDBService;
        _logger = logger;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateUser([FromBody] User user)
    {
        try
        {
            await _mongoDBService.CreateUserAsync(user);
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error al registrar el usuario: {ex.Message}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost("authenticate")]
    public async Task<IActionResult> Authenticate([FromBody] User loginUser)
    {
        _logger.LogInformation($"Solicitud de autenticación recibida para el usuario: {loginUser.Username}");

        if (loginUser == null || string.IsNullOrWhiteSpace(loginUser.Username) || string.IsNullOrWhiteSpace(loginUser.Password))
        {
            _logger.LogWarning("Solicitud de autenticación inválida. Falta el nombre de usuario o la contraseña.");
            return BadRequest("Invalid username or password");
        }

        var user = await _mongoDBService.AuthenticateAsync(loginUser.Username, loginUser.Password);
        if (user != null)
        {
            _logger.LogInformation($"Usuario {loginUser.Username} autenticado exitosamente.");
            return Ok(user);
        }

        _logger.LogWarning($"Fallo de autenticación para el usuario {loginUser.Username}");
        return Unauthorized();
    }
}
