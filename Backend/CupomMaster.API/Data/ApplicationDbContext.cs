using Microsoft.EntityFrameworkCore;
using CupomMaster.API.Models;

namespace CupomMaster.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Loja> Lojas { get; set; }
        public DbSet<Cupom> Cupons { get; set; }
        public DbSet<HistoricoUso> HistoricoUsos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User Configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Telefone).HasMaxLength(20);
                entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(500);
            });

            // Loja Configuration
            modelBuilder.Entity<Loja>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.CNPJ).IsUnique();
                entity.Property(e => e.Nome).IsRequired().HasMaxLength(200);
                entity.Property(e => e.CNPJ).IsRequired().HasMaxLength(18);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Telefone).HasMaxLength(20);
                entity.Property(e => e.Endereco).HasMaxLength(500);
            });

            // Cupom Configuration
            modelBuilder.Entity<Cupom>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Codigo).IsUnique();
                entity.Property(e => e.Codigo).IsRequired().HasMaxLength(50);
                entity.Property(e => e.ValorDesconto).HasPrecision(10, 2);
                entity.Property(e => e.RegrasUso).HasMaxLength(1000);

                // Relationship with Loja
                entity.HasOne(e => e.Loja)
                    .WithMany(l => l.Cupons)
                    .HasForeignKey(e => e.LojaId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // HistoricoUso Configuration
            modelBuilder.Entity<HistoricoUso>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ValorPedido).HasPrecision(10, 2);
                entity.Property(e => e.ValorDesconto).HasPrecision(10, 2);
                entity.Property(e => e.Observacao).HasMaxLength(500);

                // Relationship with Cupom
                entity.HasOne(e => e.Cupom)
                    .WithMany(c => c.HistoricoUsos)
                    .HasForeignKey(e => e.CupomId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Seed initial data with fixed dates and hashes
            var seedDate = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            var validadeDate6Meses = new DateTime(2024, 7, 1, 0, 0, 0, DateTimeKind.Utc);
            var validadeDate1Mes = new DateTime(2024, 2, 1, 0, 0, 0, DateTimeKind.Utc);
            var validadeDate3Meses = new DateTime(2024, 4, 1, 0, 0, 0, DateTimeKind.Utc);

            // Seed de usuários será feito via registro no primeiro acesso
            // Os hashes BCrypt não podem ser hardcoded pois mudam a cada build

            modelBuilder.Entity<Loja>().HasData(
                new Loja
                {
                    Id = 1,
                    Nome = "Loja Centro",
                    CNPJ = "12.345.678/0001-90",
                    Email = "centro@lojas.com",
                    Telefone = "(11) 3000-0001",
                    Endereco = "Rua das Flores, 123 - Centro",
                    Ativo = true,
                    CreatedAt = seedDate,
                    UpdatedAt = seedDate
                },
                new Loja
                {
                    Id = 2,
                    Nome = "Loja Shopping",
                    CNPJ = "23.456.789/0001-91",
                    Email = "shopping@lojas.com",
                    Telefone = "(11) 3000-0002",
                    Endereco = "Av. Paulista, 1000 - Shopping Center",
                    Ativo = true,
                    CreatedAt = seedDate,
                    UpdatedAt = seedDate
                },
                new Loja
                {
                    Id = 3,
                    Nome = "Loja Online",
                    CNPJ = "34.567.890/0001-92",
                    Email = "online@lojas.com",
                    Telefone = "(11) 3000-0003",
                    Endereco = "E-commerce",
                    Ativo = true,
                    CreatedAt = seedDate,
                    UpdatedAt = seedDate
                }
            );

            modelBuilder.Entity<Cupom>().HasData(
                new Cupom
                {
                    Id = 1,
                    Codigo = "BEMVINDO10",
                    ValorDesconto = 10,
                    TipoDesconto = TipoDesconto.PERCENTUAL,
                    DataValidade = validadeDate6Meses,
                    QuantidadeDisponivel = 100,
                    QuantidadeUtilizada = 15,
                    Ativo = true,
                    RegrasUso = "Válido para primeira compra",
                    LojaId = null,
                    CreatedAt = seedDate,
                    UpdatedAt = seedDate
                },
                new Cupom
                {
                    Id = 2,
                    Codigo = "NATAL2024",
                    ValorDesconto = 50,
                    TipoDesconto = TipoDesconto.VALOR_FIXO,
                    DataValidade = validadeDate1Mes,
                    QuantidadeDisponivel = 50,
                    QuantidadeUtilizada = 23,
                    Ativo = true,
                    RegrasUso = "Válido para compras acima de R$ 200",
                    LojaId = 1,
                    CreatedAt = seedDate,
                    UpdatedAt = seedDate
                },
                new Cupom
                {
                    Id = 3,
                    Codigo = "FRETEGRATIS",
                    ValorDesconto = 15,
                    TipoDesconto = TipoDesconto.VALOR_FIXO,
                    DataValidade = validadeDate3Meses,
                    QuantidadeDisponivel = 200,
                    QuantidadeUtilizada = 87,
                    Ativo = true,
                    RegrasUso = "Desconto no valor do frete",
                    LojaId = 2,
                    CreatedAt = seedDate,
                    UpdatedAt = seedDate
                }
            );
        }
    }
}
