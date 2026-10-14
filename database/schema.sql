-- Script de criação do banco e da tabela (MySQL / MariaDB)
-- Execute com:  mysql -u root -p < database/schema.sql

CREATE DATABASE IF NOT EXISTS academia
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE academia;

CREATE TABLE IF NOT EXISTS aluno (
  id        INT          NOT NULL AUTO_INCREMENT,
  nome      VARCHAR(100) NOT NULL,
  telefone  VARCHAR(20)  NOT NULL,
  plano     VARCHAR(50)  NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dados de exemplo (opcional)
INSERT INTO aluno (nome, telefone, plano) VALUES
  ('Ana Souza',   '(62) 99999-1111', 'Mensal'),
  ('Bruno Lima',  '(62) 98888-2222', 'Trimestral'),
  ('Carla Alves', '(62) 97777-3333', 'Anual');
