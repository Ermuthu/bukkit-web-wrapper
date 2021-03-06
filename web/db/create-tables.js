/**
 * Initial setup of
 * database tables
 */

const fs = require("fs");
const path = require("path");
const async = require("async");

const logger = require("../logger");
const db = require("./db");

function createTables(finalCallback) {
  const createTablesSqlStatements = fs
    .readFileSync(path.join(__dirname, "sql", "create-tables.sql"), "utf-8")
    .split("\n\n");

  async.map(createTablesSqlStatements, createTable, (err, results) => {
    if (err) {
      return logger.error("There was an error creating the database tables.");
    }
    logger.debug("All database tables created!");
    finalCallback();
  });

  function createTable(createTableSql, cb) {
    db.query(createTableSql, err => {
      if (err) {
        logger.error(err);
        return cb(err);
      }
      logger.info("Database table created!");
      return cb();
    });
  }
}

module.exports = createTables;
