module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DB_URL || "postgresql://dunder_mifflin@localhost/iPlan",
    //CLIENT_ORIGIN: 'http://localhost:3000'
}