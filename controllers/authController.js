// authController.js - autenticação com fallback (DB opcional ou in-memory)
const db = require('../models/db');
const bcrypt = require('bcryptjs');

const users = [
  { id: 1, username: 'admin', password: 'admin' } // fallback em memória
];

exports.showLogin = (req, res) => {
  res.render('login');
};

async function verifyPassword(stored, provided) {
  if (!stored) return false;
  // Se parecer um hash bcrypt (começa com $2), use compare
  if (typeof stored === 'string' && stored.startsWith('$2')) {
    return bcrypt.compare(provided, stored);
  }
  // fallback: comparar texto simples
  return stored === provided;
}

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (db.useDb) {
      // buscar atendente pelo login
      const rows = await db.query('SELECT id_atendente AS id, login AS username, senha FROM Atendente WHERE login = ?', [username]);
      const user = rows && rows[0];
      if (user && await verifyPassword(user.senha, password)) {
        res.cookie('user', JSON.stringify({ id: user.id, username: user.username }), { httpOnly: true });
        return res.redirect('/produtos');
      }
      return res.status(401).send('Usuário ou senha inválidos');
    }

    // fallback em memória
    const user = users.find(u => u.username === username);
    if (user && await verifyPassword(user.password, password)) {
      res.cookie('user', JSON.stringify({ id: user.id, username: user.username }), { httpOnly: true });
      return res.redirect('/produtos');
    }
    return res.status(401).send('Usuário ou senha inválidos');
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).send('Erro interno');
  }
};

exports.logout = (req, res) => {
  res.clearCookie('user');
  res.redirect('/login');
};
