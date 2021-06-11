import { createConnection } from "typeorm";

export const testConn = () => {
  return createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    database: "test-memeify",
    username: "postgres",
    password: "manoj",
    synchronize: true,

    dropSchema: true,

    entities: ["src/entities/*.*"],
    migrationsTableName: "custom_migration_table",
    migrations: ["src/migrations/*.*"],
    cli: {
      migrationsDir: "src/migrations/migration",
    },
  });
};
