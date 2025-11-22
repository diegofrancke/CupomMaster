using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CupomMaster.API.Models
{
    public class HistoricoUso
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CupomId { get; set; }

        [ForeignKey("CupomId")]
        public Cupom Cupom { get; set; } = null!;

        [Required]
        public DateTime DataUso { get; set; } = DateTime.UtcNow;

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal ValorPedido { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal ValorDesconto { get; set; }

        public int? LojaId { get; set; }

        [ForeignKey("LojaId")]
        public Loja? Loja { get; set; }

        [MaxLength(500)]
        public string? Observacao { get; set; }
    }
}
