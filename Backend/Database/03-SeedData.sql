-- =============================================
-- Script: Dados Iniciais (Seed)
-- Descrição: Insere dados iniciais para teste
-- Data: 2024-11-20
-- Nota: Execute este script após criar as tabelas
-- =============================================

USE CupomMasterDb;
GO

-- =============================================
-- Seed: Lojas
-- =============================================
SET IDENTITY_INSERT Lojas ON;
GO

INSERT INTO Lojas (Id, Nome, CNPJ, Email, Telefone, Endereco, Ativo, CreatedAt, UpdatedAt)
VALUES 
    (1, 'Loja Centro', '12.345.678/0001-90', 'centro@lojas.com', '(11) 3000-0001', 'Rua das Flores, 123 - Centro', 1, '2024-01-01', '2024-01-01'),
    (2, 'Loja Shopping', '23.456.789/0001-91', 'shopping@lojas.com', '(11) 3000-0002', 'Av. Paulista, 1000 - Shopping Center', 1, '2024-01-01', '2024-01-01'),
    (3, 'Loja Online', '34.567.890/0001-92', 'online@lojas.com', '(11) 3000-0003', 'E-commerce', 1, '2024-01-01', '2024-01-01');
GO

SET IDENTITY_INSERT Lojas OFF;
GO

-- =============================================
-- Seed: Cupons
-- =============================================
SET IDENTITY_INSERT Cupons ON;
GO

INSERT INTO Cupons (Id, Codigo, ValorDesconto, TipoDesconto, DataValidade, QuantidadeDisponivel, QuantidadeUtilizada, Ativo, RegrasUso, LojaId, CreatedAt, UpdatedAt)
VALUES 
    (1, 'BEMVINDO10', 10.00, 0, '2024-07-01', 100, 15, 1, 'Válido para primeira compra', NULL, '2024-01-01', '2024-01-01'),
    (2, 'NATAL2024', 50.00, 1, '2024-02-01', 50, 23, 1, 'Válido para compras acima de R$ 200', 1, '2024-01-01', '2024-01-01'),
    (3, 'FRETEGRATIS', 15.00, 1, '2024-04-01', 200, 87, 1, 'Desconto no valor do frete', 2, '2024-01-01', '2024-01-01');
GO

SET IDENTITY_INSERT Cupons OFF;
GO

-- =============================================
-- Nota: Usuários devem ser criados via API
-- pois as senhas precisam ser hashadas com BCrypt
-- Use o endpoint POST /api/Auth/register
-- =============================================

-- Usuários padrão para criar via API:
-- Admin: { username: "admin", email: "admin@cupommaster.com", password: "admin123", role: 0 }
-- Operador: { username: "operador", email: "operador@cupommaster.com", password: "operador123", role: 1 }

PRINT 'Dados iniciais inseridos com sucesso!';
PRINT 'Não esqueça de registrar os usuários via API (POST /api/Auth/register)';
GO
