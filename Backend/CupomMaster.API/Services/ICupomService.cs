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
        Task<RegistrarUsoCupomResponse> RegistrarUsoCupomAsync(int cupomId, int lojaId, decimal valorPedido);
    }

    public class RegistrarUsoCupomResponse
    {
        public bool Sucesso { get; set; }
        public string Mensagem { get; set; } = string.Empty;
        public decimal? ValorDesconto { get; set; }
    }
}
