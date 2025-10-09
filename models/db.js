// db.js - gerencia conexão MySQL (mysql2/promise)
// Use a flag USE_DB=true no .env para ativar; caso contrário retorna null e o app usa o fallback em memória
const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = null;
const useDb = (process.env.USE_DB || 'false').toLowerCase() === 'true';

async function initPool() {
  if (!useDb) return null;
  if (pool) return pool;
  if (!process.env.DB_HOST) return null; // não configurado
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  return pool;
}

async function query(sql, params) {
  const p = await initPool();
  if (!p) throw new Error('DB not configured');
  const [rows] = await p.execute(sql, params);
  return rows;
}

module.exports = { initPool, query, useDb };
