const mysql = require('mysql');

// Pool de conexões. Ajuste via variáveis de ambiente ou edite os valores padrão.
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'academia',
  charset: 'utf8mb4'
});

// Executa uma query com parameter binding (os "?" são substituídos de forma segura)
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// Códigos de erro que indicam problema de conexão/acesso ao banco
const CONNECTION_ERRORS = [
  'ECONNREFUSED',
  'ETIMEDOUT',
  'ENOTFOUND',
  'PROTOCOL_CONNECTION_LOST',
  'ER_ACCESS_DENIED_ERROR',
  'ER_BAD_DB_ERROR',
  'ER_CON_COUNT_ERROR',
  'POOL_CLOSED'
];

function isConnectionError(err) {
  return CONNECTION_ERRORS.includes(err.code);
}

module.exports = { pool, query, isConnectionError };
