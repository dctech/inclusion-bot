const {
  DATABASE_URL,
  NODE_ENV,
} = process.env;

module.exports = {
  "all": {
    "url": DATABASE_URL,
    "dialect": "postgres",
    "ssl": NODE_ENV === "production",
    "dialectOptions": {
      "ssl": NODE_ENV === "production"
    },
  }
}
