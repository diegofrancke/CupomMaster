using CupomMaster.API.DTOs;

namespace CupomMaster.API.Services
{
    public interface ILojaService
    {
        Task<IEnumerable<LojaDto>> GetAllAsync();
        Task<LojaDto?> GetByIdAsync(int id);
        Task<LojaDto> CreateAsync(CreateLojaRequest request);
        Task<LojaDto?> UpdateAsync(int id, UpdateLojaRequest request);
        Task<bool> DeleteAsync(int id);
    }
}
