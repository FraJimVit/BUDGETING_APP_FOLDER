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
            // Establecer la sesión del usuario
            HttpContext.Session.SetString("Username", user.Username);
            _logger.LogInformation($"Usuario {loginUser.Username} autenticado exitosamente.");
            return Ok(user);
        }

        _logger.LogWarning($"Fallo de autenticación para el usuario {loginUser.Username}");
        return Unauthorized();
    }

    [HttpGet("session")]
    public async Task<IActionResult> GetUserBySession()
    {
        var username = HttpContext.Session.GetString("Username");
        if (string.IsNullOrEmpty(username))
        {
            return Unauthorized("No hay sesión activa");
        }

        _logger.LogInformation($"Obteniendo datos del usuario para la sesión: {username}");
        var user = await _mongoDBService.GetUserByUsernameAsync(username);
        if (user != null)
        {
            return Ok(user);
        }
        return NotFound();
    }

    [HttpGet("username/{username}")]
    public async Task<IActionResult> GetUserByUsername(string username)
    {
        _logger.LogInformation($"Obteniendo datos del usuario para: {username}");
        var user = await _mongoDBService.GetUserByUsernameAsync(username);
        if (user != null)
        {
            return Ok(user);
        }
        return NotFound();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] User user)
    {
        _logger.LogInformation($"Actualizando datos del usuario con ID: {id}");

        if (user == null || string.IsNullOrWhiteSpace(id))
        {
            _logger.LogWarning("Datos del usuario inválidos para la actualización.");
            return BadRequest("Invalid user data");
        }

        var result = await _mongoDBService.UpdateUserAsync(id, user);
        if (result)
        {
            _logger.LogInformation($"Usuario con ID: {id} actualizado exitosamente.");
            return NoContent();
        }

        _logger.LogWarning($"Fallo al actualizar el usuario con ID: {id}");
        return NotFound();
    }
}
