const DBMigrate = require("db-migrate");

const dbmigrate = DBMigrate.getInstance(true, {
  config: "./db/config/database.json",
  env: "thisEnv"
});

dbmigrate.up().then(function() {
  console.log("successfully migrated migrations up");
  return;
});
