-- =============================================
-- Script: Criação do Banco de Dados CupomMaster
-- Descrição: Script para criar o banco de dados
-- Data: 2024-11-20
-- =============================================

USE master;
GO

-- Verifica se o banco já existe e o remove (cuidado em produção!)
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'CupomMasterDb')
BEGIN
    ALTER DATABASE CupomMasterDb SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE CupomMasterDb;
END
GO

-- Cria o novo banco de dados
CREATE DATABASE CupomMasterDb;
GO

USE CupomMasterDb;
GO

PRINT 'Banco de dados CupomMasterDb criado com sucesso!';
GO
