module.exports = {
  secret : process.env.JWT_SECRET || 'This1srand0m@',
  expiresIn: 60 * 60 * 24 * 30 * 12
}