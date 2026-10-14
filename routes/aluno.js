const express = require('express');
const { query, isConnectionError } = require('../config/db');

const router = express.Router();

// ---------- Helpers ----------

function tratarErro(err, res) {
  console.error('Erro de banco:', err.code || err.message);
  if (isConnectionError(err)) {
    return res.status(503).json({ erro: 'Banco de dados indisponível. Tente novamente mais tarde.' });
  }
  return res.status(500).json({ erro: 'Erro ao processar a requisição' });
}

function idValido(valor) {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validarCorpo(body) {
  const erros = [];
  const { nome, telefone, plano } = body || {};

  if (typeof nome !== 'string' || nome.trim() === '') erros.push('nome é obrigatório');
  else if (nome.trim().length > 100) erros.push('nome deve ter no máximo 100 caracteres');

  if (typeof telefone !== 'string' || telefone.trim() === '') erros.push('telefone é obrigatório');
  else if (telefone.trim().length > 20) erros.push('telefone deve ter no máximo 20 caracteres');

  if (typeof plano !== 'string' || plano.trim() === '') erros.push('plano é obrigatório');
  else if (plano.trim().length > 50) erros.push('plano deve ter no máximo 50 caracteres');

  return erros;
}

// ---------- Rotas ----------

// GET /aluno -> lista todos
router.get('/', async (req, res) => {
  try {
    const alunos = await query('SELECT id, nome, telefone, plano FROM aluno ORDER BY id');
    res.status(200).json(alunos);
  } catch (err) {
    tratarErro(err, res);
  }
});

// GET /aluno/:id -> busca um
router.get('/:id', async (req, res) => {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ erro: 'id inválido' });

  try {
    const rows = await query('SELECT id, nome, telefone, plano FROM aluno WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ erro: 'Aluno não encontrado' });
    res.status(200).json(rows[0]);
  } catch (err) {
    tratarErro(err, res);
  }
});

// POST /aluno -> cria
router.post('/', async (req, res) => {
  const erros = validarCorpo(req.body);
  if (erros.length) return res.status(400).json({ erro: 'Dados inválidos', detalhes: erros });

  const nome = req.body.nome.trim();
  const telefone = req.body.telefone.trim();
  const plano = req.body.plano.trim();

  try {
    const result = await query(
      'INSERT INTO aluno (nome, telefone, plano) VALUES (?, ?, ?)',
      [nome, telefone, plano]
    );
    res.status(201).json({
      mensagem: 'Aluno criado com sucesso',
      aluno: { id: result.insertId, nome, telefone, plano }
    });
  } catch (err) {
    tratarErro(err, res);
  }
});

// PUT /aluno/:id -> atualiza
router.put('/:id', async (req, res) => {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ erro: 'id inválido' });

  const erros = validarCorpo(req.body);
  if (erros.length) return res.status(400).json({ erro: 'Dados inválidos', detalhes: erros });

  const nome = req.body.nome.trim();
  const telefone = req.body.telefone.trim();
  const plano = req.body.plano.trim();

  try {
    const result = await query(
      'UPDATE aluno SET nome = ?, telefone = ?, plano = ? WHERE id = ?',
      [nome, telefone, plano, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ erro: 'Aluno não encontrado' });
    res.status(200).json({
      mensagem: 'Aluno atualizado com sucesso',
      aluno: { id, nome, telefone, plano }
    });
  } catch (err) {
    tratarErro(err, res);
  }
});

// DELETE /aluno/:id -> remove
router.delete('/:id', async (req, res) => {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ erro: 'id inválido' });

  try {
    const result = await query('DELETE FROM aluno WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ erro: 'Aluno não encontrado' });
    res.status(200).json({ mensagem: 'Aluno removido com sucesso', id });
  } catch (err) {
    tratarErro(err, res);
  }
});

module.exports = router;
