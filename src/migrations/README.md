# This directory contains TypeORM migration files.
#
# Rules:
#   - NEVER manually edit a migration file that has already been applied (migration:run).
#   - All schema changes (create table, add column, alter column, drop index, etc.)
#     must be done by modifying entity files and generating a new migration.
#   - Migration files are auto-generated and auto-named by TypeORM.
#
# Workflow for schema changes:
#   1. Modify or create an *.entity.ts file in src/
#   2. Generate a new migration (run from backend/ directory):
#        npm run migration:generate -- src/migrations/<DescriptiveName>
#      Example:
#        npm run migration:generate -- src/migrations/CreateUserTable
#        npm run migration:generate -- src/migrations/AddPhoneColumnToUser
#   3. Review the generated migration file in this directory
#   4. Apply the migration:
#        npm run migration:run
#
# Other commands (run from backend/):
#   Rollback last migration:   npm run migration:revert
#   Show migration status:     npm run migration:status
#   Drop all tables (dev only!): npm run schema:drop
