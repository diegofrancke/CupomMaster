using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CupomMaster.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Lojas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    CNPJ = table.Column<string>(type: "nvarchar(18)", maxLength: 18, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Telefone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Endereco = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Ativo = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lojas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Telefone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    PasswordHash = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Role = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Cupons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Codigo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ValorDesconto = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    TipoDesconto = table.Column<int>(type: "int", nullable: false),
                    DataValidade = table.Column<DateTime>(type: "datetime2", nullable: false),
                    QuantidadeDisponivel = table.Column<int>(type: "int", nullable: false),
                    QuantidadeUtilizada = table.Column<int>(type: "int", nullable: false),
                    Ativo = table.Column<bool>(type: "bit", nullable: false),
                    RegrasUso = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    LojaId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cupons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Cupons_Lojas_LojaId",
                        column: x => x.LojaId,
                        principalTable: "Lojas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "HistoricoUsos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CupomId = table.Column<int>(type: "int", nullable: false),
                    DataUso = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ValorPedido = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    ValorDesconto = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    LojaId = table.Column<int>(type: "int", nullable: true),
                    Observacao = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HistoricoUsos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HistoricoUsos_Cupons_CupomId",
                        column: x => x.CupomId,
                        principalTable: "Cupons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HistoricoUsos_Lojas_LojaId",
                        column: x => x.LojaId,
                        principalTable: "Lojas",
                        principalColumn: "Id");
                });

            migrationBuilder.InsertData(
                table: "Cupons",
                columns: new[] { "Id", "Ativo", "Codigo", "CreatedAt", "DataValidade", "LojaId", "QuantidadeDisponivel", "QuantidadeUtilizada", "RegrasUso", "TipoDesconto", "UpdatedAt", "ValorDesconto" },
                values: new object[] { 1, true, "BEMVINDO10", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2024, 7, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, 100, 15, "Válido para primeira compra", 0, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 10m });

            migrationBuilder.InsertData(
                table: "Lojas",
                columns: new[] { "Id", "Ativo", "CNPJ", "CreatedAt", "Email", "Endereco", "Nome", "Telefone", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, true, "12.345.678/0001-90", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "centro@lojas.com", "Rua das Flores, 123 - Centro", "Loja Centro", "(11) 3000-0001", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, true, "23.456.789/0001-91", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "shopping@lojas.com", "Av. Paulista, 1000 - Shopping Center", "Loja Shopping", "(11) 3000-0002", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, true, "34.567.890/0001-92", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "online@lojas.com", "E-commerce", "Loja Online", "(11) 3000-0003", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Cupons",
                columns: new[] { "Id", "Ativo", "Codigo", "CreatedAt", "DataValidade", "LojaId", "QuantidadeDisponivel", "QuantidadeUtilizada", "RegrasUso", "TipoDesconto", "UpdatedAt", "ValorDesconto" },
                values: new object[,]
                {
                    { 2, true, "NATAL2024", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2024, 2, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, 50, 23, "Válido para compras acima de R$ 200", 1, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 50m },
                    { 3, true, "FRETEGRATIS", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2024, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), 2, 200, 87, "Desconto no valor do frete", 1, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 15m }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Cupons_Codigo",
                table: "Cupons",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Cupons_LojaId",
                table: "Cupons",
                column: "LojaId");

            migrationBuilder.CreateIndex(
                name: "IX_HistoricoUsos_CupomId",
                table: "HistoricoUsos",
                column: "CupomId");

            migrationBuilder.CreateIndex(
                name: "IX_HistoricoUsos_LojaId",
                table: "HistoricoUsos",
                column: "LojaId");

            migrationBuilder.CreateIndex(
                name: "IX_Lojas_CNPJ",
                table: "Lojas",
                column: "CNPJ",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HistoricoUsos");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Cupons");

            migrationBuilder.DropTable(
                name: "Lojas");
        }
    }
}
