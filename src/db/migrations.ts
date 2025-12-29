import { schemaMigrations } from "@nozbe/watermelondb/Schema/migrations";

export const migrations = schemaMigrations({
  migrations: [
    {
      toVersion: 1,
      steps: [
        // example:
        // addColumns({ table: 'accounts', columns: [...] })
      ],
    },
  ],
});
