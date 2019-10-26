## To create a db migration

```

cd sync-company-status-batch/app
node node_modules/.bin/db-migrate create add-company-pk-ddl --sql-file --config ./db/config/database.json --env thisEnv

```

This will generate sql files in the app/migrations folder. Add the required sql statements to the generated files.
