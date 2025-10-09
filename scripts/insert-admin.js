// scripts/insert-admin.js
// Insere/atualiza o usuário admin na tabela Atendente com senha hasheada
const db = require('../models/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function run() {
  if (!db.useDb) {
    console.log('USE_DB=false; não vou inserir no banco.');
    return;
  }
  const pool = await db.initPool();
  if (!pool) {
    console.log('Pool não inicializado. Cheque .env');
    return;
  }

  const username = 'admin';
  const plain = 'admin';
  const hash = await bcrypt.hash(plain, 10);

  // tenta inserir com id 1 (se já existir, atualiza senha)
  await pool.execute(
    'INSERT INTO Atendente (id_atendente, nome, cpf, telefone, login, senha, tipo_usuario) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE nome=VALUES(nome), senha=VALUES(senha)',
    [1, 'Administrador', '00000000000', '11999990000', username, hash, 'admin']
  );

  console.log('Admin inserido/atualizado com login=admin e senha=admin (hasheada).');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
