# Database - CupomMaster

## 📋 Visão Geral

Este projeto utiliza **Entity Framework Core** com abordagem **Code First**. O banco de dados é criado e gerenciado automaticamente através de **migrations**.

### Tecnologias
- SQL Server LocalDB
- Entity Framework Core 10.0.0
- Migrations automáticas

## 🗂️ Estrutura do Banco

### Tabelas

#### **Users**
Armazena os usuários do sistema com autenticação
- `Id` (PK, Identity)
- `Username` (Unique, Indexed)
- `Email` (Unique, Indexed)
- `Telefone`
- `PasswordHash` (BCrypt)
- `Role` (0=ADMIN, 1=OPERADOR)
- `CreatedAt`, `UpdatedAt`

#### **Lojas**
Cadastro de lojas participantes
- `Id` (PK, Identity)
- `Nome`
- `CNPJ` (Unique, Indexed)
- `Email`
- `Telefone`
- `Endereco`
- `Ativo`
- `CreatedAt`, `UpdatedAt`

#### **Cupons**
Cupons de desconto
- `Id` (PK, Identity)
- `Codigo` (Unique, Indexed)
- `ValorDesconto`
- `TipoDesconto` (0=PERCENTUAL, 1=VALOR_FIXO)
- `DataValidade` (Indexed)
- `QuantidadeDisponivel`
- `QuantidadeUtilizada`
- `Ativo`
- `RegrasUso`
- `LojaId` (FK para Lojas, nullable)
- `CreatedAt`, `UpdatedAt`

#### **HistoricoUsos**
Histórico de uso dos cupons
- `Id` (PK, Identity)
- `CupomId` (FK para Cupons, Cascade Delete)
- `DataUso` (Indexed)
- `ValorPedido`
- `ValorDesconto`
- `LojaId` (FK para Lojas, nullable)
- `Observacao`

## 🚀 Como Usar

### Opção 1: Entity Framework Migrations (Recomendado)

```bash
# Criar migration
dotnet ef migrations add NomeDaMigration

# Aplicar ao banco
dotnet ef database update

# Remover última migration
dotnet ef migrations remove

# Dropar banco
dotnet ef database drop -f
```

### Opção 2: Scripts SQL Manuais

Os scripts SQL estão disponíveis para referência e backup:

1. **01-CreateDatabase.sql** - Cria o banco de dados
2. **02-CreateTables.sql** - Cria todas as tabelas
3. **03-SeedData.sql** - Insere dados iniciais
4. **04-Queries.sql** - Consultas úteis

Execute na ordem usando SQL Server Management Studio ou Azure Data Studio.

## 📊 Connection String

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=CupomMasterDb;Trusted_Connection=true;TrustServerCertificate=true;"
  }
}
```

## 🔐 Seed Data

### Lojas (3)
- Loja Centro
- Loja Shopping  
- Loja Online

### Cupons (3)
- **BEMVINDO10** - 10% desconto para primeira compra
- **NATAL2024** - R$ 50 fixo para compras acima de R$ 200
- **FRETEGRATIS** - R$ 15 fixo no frete

### Usuários
⚠️ Usuários devem ser criados via API (POST /api/Auth/register) pois as senhas são hashadas com BCrypt.

**Usuários padrão:**
- **Admin**: `admin / admin123` (Role: ADMIN)
- **Operador**: `operador / operador123` (Role: OPERADOR)

## 📝 Notas Importantes

1. **Code First**: As migrations são geradas automaticamente a partir dos models C#
2. **Seed Data**: Lojas e cupons são inseridos automaticamente, usuários via API
3. **Constraints**: Índices e foreign keys são criados automaticamente pelo EF Core
4. **Auditoria**: Todas as tabelas têm `CreatedAt` e `UpdatedAt`
5. **Soft Delete**: Campo `Ativo` permite desativação sem exclusão física

## 🔍 Consultas Úteis

Ver arquivo **04-Queries.sql** para consultas prontas:
- Listar cupons válidos
- Cupons mais utilizados
- Histórico de uso
- Relatórios por loja
- Verificação de integridade

## 📚 Documentação EF Core

- [Migrations](https://learn.microsoft.com/ef/core/managing-schemas/migrations/)
- [Data Seeding](https://learn.microsoft.com/ef/core/modeling/data-seeding)
- [Relationships](https://learn.microsoft.com/ef/core/modeling/relationships)
