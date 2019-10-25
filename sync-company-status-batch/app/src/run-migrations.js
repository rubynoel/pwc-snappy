const DBMigrate = require('db-migrate');

const dbmigrate = DBMigrate.getInstance(true, {
  config: './db/config/database.json',
  env: 'thisEnv',
});

console.log('DBMigrate instance obtained. Will run migrations up...');
dbmigrate.up().then(function() {
  console.log('successfully migrated migrations up');
  return;
});
