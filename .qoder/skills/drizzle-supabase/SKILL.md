---
name: drizzle-supabase
description: Database rules for Drizzle ORM + Supabase PostgreSQL. Use when writing database queries, modifying schemas, handling migrations, or performing any database operations in this project.
---

# Drizzle ORM + Supabase PostgreSQL

## Overview

This project uses **Drizzle ORM** with **Supabase PostgreSQL** as the database backend. All database interactions must follow the rules below.

## Rules

### ORM & Schema

- Use **Drizzle ORM** exclusively. Schema files live in `/db`.
- Define tables using Drizzle's `pgTable()` helper.
- All new tables and columns must be added to schema files in `/db`, not via raw SQL.

### Database Connection

- Connection uses the `DATABASE_URL` environment variable (Supabase PostgreSQL connection string).
- Never hardcode database URLs or credentials.

### Queries

- Use **Drizzle query builder** (`db.select()`, `db.insert()`, `db.update()`, `db.delete()`) for all queries.
- Avoid raw SQL (`sql` tagged template) unless absolutely necessary (e.g., unsupported PostgreSQL features).
- Prefer typed queries — always use Drizzle's type-safe API.

### Migrations

When the schema changes:

1. Run `drizzle-kit generate` to create a migration file.
2. Review the generated SQL in `/drizzle`.
3. Run the migration to apply changes to the database.

Never modify migration files manually after they are generated.

### Validation

- **Always validate input with Zod** before `insert()` or `update()` operations.
- Define Zod schemas alongside or near Drizzle table definitions when practical.
- Example:

```ts
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});
```

### Auth / Users Table

- The `users` table is managed by **better-auth**. Do **not** modify it manually (no direct inserts, updates, or schema changes to the users table).
- If user-related data must be stored, create a separate related table that references `users.id` via foreign key.

## Quick Reference

| Task | Command / Approach |
|---|---|
| Generate migration | `drizzle-kit generate` |
| Apply migration | Run migration script |
| Query data | `db.select().from(table).where(...)` |
| Insert data | Validate with Zod first, then `db.insert().values(...)` |
| Update data | Validate with Zod first, then `db.update().set(...)` |
| Auth users | Leave to better-auth — never modify directly |
