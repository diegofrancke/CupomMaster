-- =============================================
-- Script: Criação das Tabelas
-- Descrição: Script para criar todas as tabelas do sistema
-- Data: 2024-11-20
-- =============================================

USE CupomMasterDb;
GO

-- =============================================
-- Tabela: Users
-- Descrição: Armazena os usuários do sistema
-- =============================================
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    Telefone NVARCHAR(20) NULL,
    PasswordHash NVARCHAR(500) NOT NULL,
    Role INT NOT NULL, -- 0 = ADMIN, 1 = OPERADOR
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    CONSTRAINT UQ_Users_Username UNIQUE (Username),
    CONSTRAINT UQ_Users_Email UNIQUE (Email)
);
GO

CREATE INDEX IX_Users_Username ON Users(Username);
CREATE INDEX IX_Users_Email ON Users(Email);
GO

-- =============================================
-- Tabela: Lojas
-- Descrição: Armazena as lojas cadastradas
-- =============================================
CREATE TABLE Lojas (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nome NVARCHAR(200) NOT NULL,
    CNPJ NVARCHAR(18) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    Telefone NVARCHAR(20) NULL,
    Endereco NVARCHAR(500) NULL,
    Ativo BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    CONSTRAINT UQ_Lojas_CNPJ UNIQUE (CNPJ)
);
GO

CREATE INDEX IX_Lojas_CNPJ ON Lojas(CNPJ);
GO

-- =============================================
-- Tabela: Cupons
-- Descrição: Armazena os cupons de desconto
-- =============================================
CREATE TABLE Cupons (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Codigo NVARCHAR(50) NOT NULL,
    ValorDesconto DECIMAL(10,2) NOT NULL,
    TipoDesconto INT NOT NULL, -- 0 = PERCENTUAL, 1 = VALOR_FIXO
    DataValidade DATETIME2 NOT NULL,
    QuantidadeDisponivel INT NOT NULL,
    QuantidadeUtilizada INT NOT NULL DEFAULT 0,
    Ativo BIT NOT NULL DEFAULT 1,
    RegrasUso NVARCHAR(1000) NULL,
    LojaId INT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    CONSTRAINT UQ_Cupons_Codigo UNIQUE (Codigo),
    CONSTRAINT FK_Cupons_Lojas FOREIGN KEY (LojaId) REFERENCES Lojas(Id) ON DELETE SET NULL
);
GO

CREATE INDEX IX_Cupons_Codigo ON Cupons(Codigo);
CREATE INDEX IX_Cupons_LojaId ON Cupons(LojaId);
CREATE INDEX IX_Cupons_DataValidade ON Cupons(DataValidade);
GO

-- =============================================
-- Tabela: HistoricoUsos
-- Descrição: Armazena o histórico de uso dos cupons
-- =============================================
CREATE TABLE HistoricoUsos (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CupomId INT NOT NULL,
    DataUso DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ValorPedido DECIMAL(10,2) NOT NULL,
    ValorDesconto DECIMAL(10,2) NOT NULL,
    LojaId INT NULL,
    Observacao NVARCHAR(500) NULL,
    CONSTRAINT FK_HistoricoUsos_Cupons FOREIGN KEY (CupomId) REFERENCES Cupons(Id) ON DELETE CASCADE,
    CONSTRAINT FK_HistoricoUsos_Lojas FOREIGN KEY (LojaId) REFERENCES Lojas(Id)
);
GO

CREATE INDEX IX_HistoricoUsos_CupomId ON HistoricoUsos(CupomId);
CREATE INDEX IX_HistoricoUsos_LojaId ON HistoricoUsos(LojaId);
CREATE INDEX IX_HistoricoUsos_DataUso ON HistoricoUsos(DataUso);
GO

PRINT 'Tabelas criadas com sucesso!';
GO
