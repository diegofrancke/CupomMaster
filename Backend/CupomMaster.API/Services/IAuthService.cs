using CupomMaster.API.DTOs;

namespace CupomMaster.API.Services
{
    public interface IAuthService
    {
        Task<LoginResponse?> LoginAsync(LoginRequest request);
        Task<UserDto?> RegisterAsync(RegisterRequest request);
        string GenerateJwtToken(UserDto user);
    }
}
