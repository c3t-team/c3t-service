module.exports = {
  server: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '3306',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '123456',
  database: process.env.DB_NAME || 'eva',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
}