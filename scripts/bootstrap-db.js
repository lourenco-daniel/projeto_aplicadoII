// scripts/bootstrap-db.js
// Script para criar o banco (se não existir) e aplicar sql/create_tables.sql
// Usa variáveis do .env
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'sistema_pedidos';

  console.log('Conectando ao MySQL...');
  // Conecta sem especificar database para poder criar
  const conn = await mysql.createConnection({ host, user, password, multipleStatements: true });

  // Cria banco se não existir
  console.log(`Criando database ${dbName} (se não existir)`);
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);

  // Conectar ao banco criado
  await conn.changeUser({ database: dbName });

  // Ler script SQL
  const sqlPath = path.join(__dirname, '..', 'sql', 'create_tables.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error('Arquivo SQL não encontrado em', sqlPath);
    process.exit(1);
  }
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('Executando script SQL para criar tabelas...');
  await conn.query(sql);

  console.log('Banco e tabelas criados/atualizados com sucesso.');
  await conn.end();
}

run().catch(err => {
  console.error('Erro ao criar/importar banco:', err.message);
  process.exit(1);
});
