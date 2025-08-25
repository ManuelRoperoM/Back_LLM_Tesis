# Migrations

## Crear una nueva migracion

npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate src/migrations/"NombreMigracion" -d src/data-source.ts

## Ejecutar la migracion

npx ts-node -r tsconfig-paths/register -r dotenv/config ./node_modules/typeorm/cli.js migration:run -d src/data-source.ts

## Libreria

npm install -D ts-node tsconfig-paths
