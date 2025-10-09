// produtoModel.js - implementação com fallback: usa DB quando configurado, senão usa memória
const db = require('./db');

let produtos = [
  { id: 1, nome: 'Coxinha', descricao: 'Coxinha de frango', preco: 6.50, categoria: 'Salgado', quantidade: 20, foto: '' },
  { id: 2, nome: 'Pastel', descricao: 'Pastel de queijo', preco: 8.00, categoria: 'Salgado', quantidade: 15, foto: '' }
];
let nextId = 3;

// findAll: retorna array ou faz query DB
exports.findAll = async () => {
  if (db.useDb) {
    const rows = await db.query('SELECT id, nome, descricao, preco, categoria, quantidade, foto FROM produtos ORDER BY criado_em DESC');
    return rows;
  }
  return produtos.slice();
};

exports.findById = async (id) => {
  if (db.useDb) {
    const rows = await db.query('SELECT id, nome, descricao, preco, categoria, quantidade, foto FROM produtos WHERE id = ?', [id]);
    return rows[0] || null;
  }
  return produtos.find(p => p.id === id) || null;
};

exports.create = async (data) => {
  if (db.useDb) {
    const params = [data.nome, data.descricao, data.preco || 0.0, data.categoria, data.quantidade || 0, data.foto || null];
    const p = await db.query('INSERT INTO produtos (nome, descricao, preco, categoria, quantidade, foto) VALUES (?, ?, ?, ?, ?, ?)', params);
    // p.insertId nem sempre está presente dependendo do driver; buscar último registro é uma opção
    return { id: p.insertId || null, ...data };
  }
  const p = {
    id: nextId++,
    nome: data.nome || 'Produto',
    descricao: data.descricao || '',
    preco: parseFloat(data.preco) || 0.0,
    categoria: data.categoria || '',
    quantidade: parseInt(data.quantidade, 10) || 0,
    foto: data.foto || ''
  };
  produtos.push(p);
  return p;
};

exports.update = async (id, data) => {
  if (db.useDb) {
    await db.query('UPDATE produtos SET nome = ?, descricao = ?, preco = ?, categoria = ?, quantidade = ?, foto = ? WHERE id = ?', [data.nome, data.descricao, data.preco || 0.0, data.categoria, data.quantidade || 0, data.foto || null, id]);
    return { id, ...data };
  }
  const idx = produtos.findIndex(p => p.id === id);
  if (idx === -1) return null;
  produtos[idx] = Object.assign(produtos[idx], {
    nome: data.nome,
    descricao: data.descricao,
    preco: parseFloat(data.preco) || 0.0,
    categoria: data.categoria,
    quantidade: parseInt(data.quantidade, 10) || 0,
    foto: data.foto
  });
  return produtos[idx];
};

exports.delete = async (id) => {
  if (db.useDb) {
    await db.query('DELETE FROM produtos WHERE id = ?', [id]);
    return true;
  }
  const idx = produtos.findIndex(p => p.id === id);
  if (idx === -1) return false;
  produtos.splice(idx, 1);
  return true;
};

