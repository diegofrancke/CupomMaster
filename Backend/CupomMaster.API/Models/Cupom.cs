using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CupomMaster.API.Models
{
    public class Cupom
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Codigo { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal ValorDesconto { get; set; }

        [Required]
        public TipoDesconto TipoDesconto { get; set; }

        [Required]
        public DateTime DataValidade { get; set; }

        [Required]
        public int QuantidadeDisponivel { get; set; }

        public int QuantidadeUtilizada { get; set; } = 0;

        public bool Ativo { get; set; } = true;

        [MaxLength(500)]
        public string? RegrasUso { get; set; }

        public int? LojaId { get; set; }

        [ForeignKey("LojaId")]
        public Loja? Loja { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation
        public ICollection<HistoricoUso> HistoricoUsos { get; set; } = new List<HistoricoUso>();
    }

    public enum TipoDesconto
    {
        PERCENTUAL,
        VALOR_FIXO
    }
}
