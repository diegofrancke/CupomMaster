-- =============================================
-- Script: Consultas Úteis
-- Descrição: Queries para consulta e análise
-- Data: 2024-11-20
-- =============================================

USE CupomMasterDb;
GO

-- =============================================
-- Consultas Básicas
-- =============================================

-- Listar todos os usuários
SELECT Id, Username, Email, Telefone, Role, CreatedAt
FROM Users
ORDER BY CreatedAt DESC;
GO

-- Listar todas as lojas
SELECT Id, Nome, CNPJ, Email, Telefone, Ativo, CreatedAt
FROM Lojas
ORDER BY Nome;
GO

-- Listar todos os cupons com informações da loja
SELECT 
    c.Id,
    c.Codigo,
    c.ValorDesconto,
    CASE c.TipoDesconto 
        WHEN 0 THEN 'PERCENTUAL'
        WHEN 1 THEN 'VALOR_FIXO'
    END AS TipoDesconto,
    c.DataValidade,
    c.QuantidadeDisponivel,
    c.QuantidadeUtilizada,
    c.Ativo,
    l.Nome AS NomeLoja,
    c.RegrasUso
FROM Cupons c
LEFT JOIN Lojas l ON c.LojaId = l.Id
ORDER BY c.CreatedAt DESC;
GO

-- =============================================
-- Consultas Avançadas
-- =============================================

-- Cupons válidos (ativos, não expirados, com disponibilidade)
SELECT 
    Codigo,
    ValorDesconto,
    CASE TipoDesconto 
        WHEN 0 THEN 'PERCENTUAL'
        WHEN 1 THEN 'VALOR_FIXO'
    END AS TipoDesconto,
    DataValidade,
    QuantidadeDisponivel - QuantidadeUtilizada AS QuantidadeRestante
FROM Cupons
WHERE Ativo = 1 
    AND DataValidade > GETUTCDATE()
    AND QuantidadeUtilizada < QuantidadeDisponivel
ORDER BY DataValidade;
GO

-- Cupons mais utilizados
SELECT TOP 10
    c.Codigo,
    c.QuantidadeUtilizada,
    c.QuantidadeDisponivel,
    CAST(c.QuantidadeUtilizada * 100.0 / c.QuantidadeDisponivel AS DECIMAL(5,2)) AS PercentualUso,
    l.Nome AS Loja
FROM Cupons c
LEFT JOIN Lojas l ON c.LojaId = l.Id
ORDER BY c.QuantidadeUtilizada DESC;
GO

-- Histórico de uso por cupom
SELECT 
    c.Codigo,
    h.DataUso,
    h.ValorPedido,
    h.ValorDesconto,
    l.Nome AS Loja,
    h.Observacao
FROM HistoricoUsos h
INNER JOIN Cupons c ON h.CupomId = c.Id
LEFT JOIN Lojas l ON h.LojaId = l.Id
ORDER BY h.DataUso DESC;
GO

-- Total de desconto concedido por cupom
SELECT 
    c.Codigo,
    COUNT(h.Id) AS TotalUsos,
    SUM(h.ValorDesconto) AS TotalDesconto,
    AVG(h.ValorDesconto) AS MediaDesconto
FROM Cupons c
LEFT JOIN HistoricoUsos h ON c.Id = h.CupomId
GROUP BY c.Codigo
ORDER BY TotalDesconto DESC;
GO

-- Relatório de cupons por loja
SELECT 
    ISNULL(l.Nome, 'Geral (Todas as Lojas)') AS Loja,
    COUNT(c.Id) AS TotalCupons,
    SUM(CASE WHEN c.Ativo = 1 THEN 1 ELSE 0 END) AS CuponsAtivos,
    SUM(c.QuantidadeUtilizada) AS TotalUtilizados
FROM Cupons c
LEFT JOIN Lojas l ON c.LojaId = l.Id
GROUP BY l.Nome
ORDER BY TotalUtilizados DESC;
GO

-- =============================================
-- Consultas de Manutenção
-- =============================================

-- Verificar integridade referencial
SELECT 
    'Cupons sem loja válida' AS Problema,
    COUNT(*) AS Quantidade
FROM Cupons
WHERE LojaId IS NOT NULL 
    AND LojaId NOT IN (SELECT Id FROM Lojas)
UNION ALL
SELECT 
    'Histórico sem cupom válido' AS Problema,
    COUNT(*) AS Quantidade
FROM HistoricoUsos
WHERE CupomId NOT IN (SELECT Id FROM Cupons);
GO

-- Listar cupons expirados
SELECT 
    Codigo,
    DataValidade,
    DATEDIFF(DAY, DataValidade, GETUTCDATE()) AS DiasExpirado
FROM Cupons
WHERE DataValidade < GETUTCDATE()
ORDER BY DataValidade DESC;
GO

PRINT 'Consultas executadas com sucesso!';
GO
