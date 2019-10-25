cd sync-company-status-batch/app
node node_modules/db-migrate/bin/db-migrate create company-status-ddl --sql-file --config ./db/config/database.json --env thisEnv
