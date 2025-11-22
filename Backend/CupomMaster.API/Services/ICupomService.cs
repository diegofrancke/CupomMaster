using CupomMaster.API.DTOs;

namespace CupomMaster.API.Services
{
    public interface ICupomService
    {
        Task<IEnumerable<CupomDto>> GetAllAsync();
        Task<CupomDto?> GetByIdAsync(int id);
        Task<CupomDto?> GetByCodigoAsync(string codigo);
        Task<CupomDto> CreateAsync(CreateCupomRequest request);
        Task<CupomDto?> UpdateAsync(int id, UpdateCupomRequest request);
        Task<bool> DeleteAsync(int id);
        Task<ValidacaoCupomResponse> ValidarCupomAsync(ValidacaoCupomRequest request);
        Task<bool> UsarCupomAsync(int cupomId, int? lojaId, decimal valorPedido);
    }
}
