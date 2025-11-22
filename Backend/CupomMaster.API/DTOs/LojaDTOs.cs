namespace CupomMaster.API.DTOs
{
    public class LojaDto
    {
        public int? Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string CNPJ { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Telefone { get; set; }
        public string? Endereco { get; set; }
        public bool Ativo { get; set; }
        public DateTime? CreatedAt { get; set; }
    }

    public class CreateLojaRequest
    {
        public string Nome { get; set; } = string.Empty;
        public string CNPJ { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Telefone { get; set; }
        public string? Endereco { get; set; }
        public bool Ativo { get; set; } = true;
    }

    public class UpdateLojaRequest
    {
        public string Nome { get; set; } = string.Empty;
        public string CNPJ { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Telefone { get; set; }
        public string? Endereco { get; set; }
        public bool Ativo { get; set; }
    }
}
