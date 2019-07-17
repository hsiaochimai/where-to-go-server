module.exports = {
  JWT_EXPIRY: process.env.JWT_EXPIRY || "7d",
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_URL:
    process.env.DATABASE_URL ||
    "postgresql://hsiaochimai@localhost:5432/where-to-go",
  TEST_DB_URL:
    process.env.TEST_DB_URL ||
    "postgresql://hsiaochimai@localhost:5432/where-to-go-test"
};
