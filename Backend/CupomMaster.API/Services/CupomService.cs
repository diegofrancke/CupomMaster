using Microsoft.EntityFrameworkCore;
using CupomMaster.API.Data;
using CupomMaster.API.DTOs;
using CupomMaster.API.Models;

namespace CupomMaster.API.Services
{
    public class CupomService : ICupomService
    {
        private readonly ApplicationDbContext _context;

        public CupomService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CupomDto>> GetAllAsync()
        {
            var cupons = await _context.Cupons
                .Include(c => c.Loja)
                .ToListAsync();

            return cupons.Select(MapToDto);
        }

        public async Task<CupomDto?> GetByIdAsync(int id)
        {
            var cupom = await _context.Cupons
                .Include(c => c.Loja)
                .FirstOrDefaultAsync(c => c.Id == id);

            return cupom != null ? MapToDto(cupom) : null;
        }

        public async Task<CupomDto?> GetByCodigoAsync(string codigo)
        {
            var cupom = await _context.Cupons
                .Include(c => c.Loja)
                .FirstOrDefaultAsync(c => c.Codigo == codigo);

            return cupom != null ? MapToDto(cupom) : null;
        }

        public async Task<CupomDto> CreateAsync(CreateCupomRequest request)
        {
            // Check if code already exists
            if (await _context.Cupons.AnyAsync(c => c.Codigo == request.Codigo))
            {
                throw new InvalidOperationException("Código de cupom já existe");
            }

            var cupom = new Cupom
            {
                Codigo = request.Codigo,
                ValorDesconto = request.ValorDesconto,
                TipoDesconto = request.TipoDesconto,
                DataValidade = request.DataValidade,
                QuantidadeDisponivel = request.QuantidadeDisponivel,
                QuantidadeUtilizada = 0,
                Ativo = request.Ativo,
                RegrasUso = request.RegrasUso,
                LojaId = request.LojaId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Cupons.Add(cupom);
            await _context.SaveChangesAsync();

            // Reload with Loja navigation property
            await _context.Entry(cupom).Reference(c => c.Loja).LoadAsync();

            return MapToDto(cupom);
        }

        public async Task<CupomDto?> UpdateAsync(int id, UpdateCupomRequest request)
        {
            var cupom = await _context.Cupons.FindAsync(id);
            if (cupom == null) return null;

            // Check if new code conflicts with another cupom
            if (cupom.Codigo != request.Codigo && 
                await _context.Cupons.AnyAsync(c => c.Codigo == request.Codigo && c.Id != id))
            {
                throw new InvalidOperationException("Código de cupom já existe");
            }

            cupom.Codigo = request.Codigo;
            cupom.ValorDesconto = request.ValorDesconto;
            cupom.TipoDesconto = request.TipoDesconto;
            cupom.DataValidade = request.DataValidade;
            cupom.QuantidadeDisponivel = request.QuantidadeDisponivel;
            cupom.Ativo = request.Ativo;
            cupom.RegrasUso = request.RegrasUso;
            cupom.LojaId = request.LojaId;
            cupom.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Reload with Loja navigation property
            await _context.Entry(cupom).Reference(c => c.Loja).LoadAsync();

            return MapToDto(cupom);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var cupom = await _context.Cupons.FindAsync(id);
            if (cupom == null) return false;

            _context.Cupons.Remove(cupom);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<ValidacaoCupomResponse> ValidarCupomAsync(ValidacaoCupomRequest request)
        {
            var cupom = await _context.Cupons
                .Include(c => c.Loja)
                .FirstOrDefaultAsync(c => c.Codigo == request.Codigo);

            if (cupom == null)
            {
                return new ValidacaoCupomResponse
                {
                    Valido = false,
                    Mensagem = "Cupom não encontrado"
                };
            }

            if (!cupom.Ativo)
            {
                return new ValidacaoCupomResponse
                {
                    Valido = false,
                    Mensagem = "Cupom inativo"
                };
            }

            if (cupom.DataValidade < DateTime.UtcNow)
            {
                return new ValidacaoCupomResponse
                {
                    Valido = false,
                    Mensagem = "Cupom expirado"
                };
            }

            if (cupom.QuantidadeUtilizada >= cupom.QuantidadeDisponivel)
            {
                return new ValidacaoCupomResponse
                {
                    Valido = false,
                    Mensagem = "Cupom esgotado"
                };
            }

            if (cupom.LojaId.HasValue && request.LojaId.HasValue && cupom.LojaId != request.LojaId)
            {
                return new ValidacaoCupomResponse
                {
                    Valido = false,
                    Mensagem = "Cupom não válido para esta loja"
                };
            }

            decimal valorDesconto;
            if (cupom.TipoDesconto == TipoDesconto.PERCENTUAL)
            {
                valorDesconto = request.ValorPedido * (cupom.ValorDesconto / 100);
            }
            else
            {
                valorDesconto = cupom.ValorDesconto;
            }

            return new ValidacaoCupomResponse
            {
                Valido = true,
                Mensagem = "Cupom válido",
                Cupom = MapToDto(cupom),
                ValorDesconto = valorDesconto
            };
        }

        public async Task<bool> UsarCupomAsync(int cupomId, int? lojaId, decimal valorPedido)
        {
            var cupom = await _context.Cupons.FindAsync(cupomId);
            if (cupom == null) return false;

            // Create history record
            decimal valorDesconto;
            if (cupom.TipoDesconto == TipoDesconto.PERCENTUAL)
            {
                valorDesconto = valorPedido * (cupom.ValorDesconto / 100);
            }
            else
            {
                valorDesconto = cupom.ValorDesconto;
            }

            var historico = new HistoricoUso
            {
                CupomId = cupomId,
                DataUso = DateTime.UtcNow,
                ValorPedido = valorPedido,
                ValorDesconto = valorDesconto,
                LojaId = lojaId
            };

            _context.HistoricoUsos.Add(historico);

            // Increment usage count
            cupom.QuantidadeUtilizada++;
            cupom.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<RegistrarUsoCupomResponse> RegistrarUsoCupomAsync(int cupomId, int lojaId, decimal valorPedido)
        {
            // Validar cupom
            var cupom = await _context.Cupons
                .Include(c => c.Loja)
                .FirstOrDefaultAsync(c => c.Id == cupomId);

            if (cupom == null)
            {
                return new RegistrarUsoCupomResponse
                {
                    Sucesso = false,
                    Mensagem = "Cupom não encontrado"
                };
            }

            if (!cupom.Ativo)
            {
                return new RegistrarUsoCupomResponse
                {
                    Sucesso = false,
                    Mensagem = "Cupom está inativo"
                };
            }

            if (cupom.DataValidade < DateTime.UtcNow)
            {
                return new RegistrarUsoCupomResponse
                {
                    Sucesso = false,
                    Mensagem = "Cupom expirado"
                };
            }

            if (cupom.QuantidadeUtilizada >= cupom.QuantidadeDisponivel)
            {
                return new RegistrarUsoCupomResponse
                {
                    Sucesso = false,
                    Mensagem = "Cupom esgotado - todas as quantidades já foram utilizadas"
                };
            }

            // Validar loja
            var loja = await _context.Lojas.FindAsync(lojaId);
            if (loja == null)
            {
                return new RegistrarUsoCupomResponse
                {
                    Sucesso = false,
                    Mensagem = "Loja não encontrada"
                };
            }

            if (!loja.Ativo)
            {
                return new RegistrarUsoCupomResponse
                {
                    Sucesso = false,
                    Mensagem = "Loja está inativa"
                };
            }

            // Validar se cupom é específico para uma loja
            if (cupom.LojaId.HasValue && cupom.LojaId != lojaId)
            {
                return new RegistrarUsoCupomResponse
                {
                    Sucesso = false,
                    Mensagem = $"Este cupom é exclusivo para a loja: {cupom.Loja?.Nome}"
                };
            }

            // Calcular valor do desconto
            decimal valorDesconto;
            if (cupom.TipoDesconto == TipoDesconto.PERCENTUAL)
            {
                valorDesconto = valorPedido * (cupom.ValorDesconto / 100);
            }
            else
            {
                valorDesconto = cupom.ValorDesconto;
            }

            // Registrar uso no histórico
            var historico = new HistoricoUso
            {
                CupomId = cupomId,
                DataUso = DateTime.UtcNow,
                ValorPedido = valorPedido,
                ValorDesconto = valorDesconto,
                LojaId = lojaId
            };

            _context.HistoricoUsos.Add(historico);

            // Incrementar quantidade utilizada
            cupom.QuantidadeUtilizada++;
            cupom.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new RegistrarUsoCupomResponse
            {
                Sucesso = true,
                Mensagem = $"Cupom utilizado com sucesso na loja {loja.Nome}",
                ValorDesconto = valorDesconto
            };
        }

        private static CupomDto MapToDto(Cupom cupom)
        {
            return new CupomDto
            {
                Id = cupom.Id,
                Codigo = cupom.Codigo,
                ValorDesconto = cupom.ValorDesconto,
                TipoDesconto = cupom.TipoDesconto,
                DataValidade = cupom.DataValidade,
                QuantidadeDisponivel = cupom.QuantidadeDisponivel,
                QuantidadeUtilizada = cupom.QuantidadeUtilizada,
                Ativo = cupom.Ativo,
                RegrasUso = cupom.RegrasUso,
                LojaId = cupom.LojaId,
                Loja = cupom.Loja != null ? new LojaDto
                {
                    Id = cupom.Loja.Id,
                    Nome = cupom.Loja.Nome,
                    CNPJ = cupom.Loja.CNPJ,
                    Email = cupom.Loja.Email,
                    Telefone = cupom.Loja.Telefone,
                    Endereco = cupom.Loja.Endereco,
                    Ativo = cupom.Loja.Ativo,
                    CreatedAt = cupom.Loja.CreatedAt
                } : null,
                CreatedAt = cupom.CreatedAt,
                UpdatedAt = cupom.UpdatedAt
            };
        }
    }
}
