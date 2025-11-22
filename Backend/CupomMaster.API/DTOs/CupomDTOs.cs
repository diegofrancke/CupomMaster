using CupomMaster.API.Models;

namespace CupomMaster.API.DTOs
{
    public class CupomDto
    {
        public int? Id { get; set; }
        public string Codigo { get; set; } = string.Empty;
        public decimal ValorDesconto { get; set; }
        public TipoDesconto TipoDesconto { get; set; }
        public DateTime DataValidade { get; set; }
        public int QuantidadeDisponivel { get; set; }
        public int QuantidadeUtilizada { get; set; }
        public bool Ativo { get; set; }
        public string? RegrasUso { get; set; }
        public int? LojaId { get; set; }
        public LojaDto? Loja { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateCupomRequest
    {
        public string Codigo { get; set; } = string.Empty;
        public decimal ValorDesconto { get; set; }
        public TipoDesconto TipoDesconto { get; set; }
        public DateTime DataValidade { get; set; }
        public int QuantidadeDisponivel { get; set; }
        public bool Ativo { get; set; } = true;
        public string? RegrasUso { get; set; }
        public int? LojaId { get; set; }
    }

    public class UpdateCupomRequest
    {
        public string Codigo { get; set; } = string.Empty;
        public decimal ValorDesconto { get; set; }
        public TipoDesconto TipoDesconto { get; set; }
        public DateTime DataValidade { get; set; }
        public int QuantidadeDisponivel { get; set; }
        public bool Ativo { get; set; }
        public string? RegrasUso { get; set; }
        public int? LojaId { get; set; }
    }

    public class ValidacaoCupomRequest
    {
        public string Codigo { get; set; } = string.Empty;
        public decimal ValorPedido { get; set; }
        public int? LojaId { get; set; }
    }

    public class ValidacaoCupomResponse
    {
        public bool Valido { get; set; }
        public string Mensagem { get; set; } = string.Empty;
        public CupomDto? Cupom { get; set; }
        public decimal? ValorDesconto { get; set; }
    }
}
