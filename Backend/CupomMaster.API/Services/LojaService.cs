using Microsoft.EntityFrameworkCore;
using CupomMaster.API.Data;
using CupomMaster.API.DTOs;
using CupomMaster.API.Models;

namespace CupomMaster.API.Services
{
    public class LojaService : ILojaService
    {
        private readonly ApplicationDbContext _context;

        public LojaService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<LojaDto>> GetAllAsync()
        {
            var lojas = await _context.Lojas.ToListAsync();
            return lojas.Select(MapToDto);
        }

        public async Task<LojaDto?> GetByIdAsync(int id)
        {
            var loja = await _context.Lojas.FindAsync(id);
            return loja != null ? MapToDto(loja) : null;
        }

        public async Task<LojaDto> CreateAsync(CreateLojaRequest request)
        {
            // Check if CNPJ already exists
            if (await _context.Lojas.AnyAsync(l => l.CNPJ == request.CNPJ))
            {
                throw new InvalidOperationException("CNPJ já cadastrado");
            }

            var loja = new Loja
            {
                Nome = request.Nome,
                CNPJ = request.CNPJ,
                Email = request.Email,
                Telefone = request.Telefone,
                Endereco = request.Endereco,
                Ativo = request.Ativo,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Lojas.Add(loja);
            await _context.SaveChangesAsync();

            return MapToDto(loja);
        }

        public async Task<LojaDto?> UpdateAsync(int id, UpdateLojaRequest request)
        {
            var loja = await _context.Lojas.FindAsync(id);
            if (loja == null) return null;

            // Check if new CNPJ conflicts with another loja
            if (loja.CNPJ != request.CNPJ && 
                await _context.Lojas.AnyAsync(l => l.CNPJ == request.CNPJ && l.Id != id))
            {
                throw new InvalidOperationException("CNPJ já cadastrado");
            }

            loja.Nome = request.Nome;
            loja.CNPJ = request.CNPJ;
            loja.Email = request.Email;
            loja.Telefone = request.Telefone;
            loja.Endereco = request.Endereco;
            loja.Ativo = request.Ativo;
            loja.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToDto(loja);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var loja = await _context.Lojas.FindAsync(id);
            if (loja == null) return false;

            _context.Lojas.Remove(loja);
            await _context.SaveChangesAsync();
            return true;
        }

        private static LojaDto MapToDto(Loja loja)
        {
            return new LojaDto
            {
                Id = loja.Id,
                Nome = loja.Nome,
                CNPJ = loja.CNPJ,
                Email = loja.Email,
                Telefone = loja.Telefone,
                Endereco = loja.Endereco,
                Ativo = loja.Ativo,
                CreatedAt = loja.CreatedAt
            };
        }
    }
}
