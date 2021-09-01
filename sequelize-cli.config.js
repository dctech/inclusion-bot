const {
  DATABASE_URL,
  NODE_ENV,
} = process.env;

module.exports = {
  all: {
    url: DATABASE_URL,
    dialect: "postgres",
    ssl: NODE_ENV === "production",
    dialectOptions: NODE_ENV === "production"
      // Heroku does not support verifiable certificates
      ? { ssl: { rejectUnauthorized: false } }
      : {},
  }
}
