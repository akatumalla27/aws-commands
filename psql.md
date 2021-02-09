Rebuild schema:
```
DROP SCHEMA dev CASCADE;
CREATE SCHEMA dev;
```

Create test table
```
CREATE TABLE dev.tests (
"id" SERIAL PRIMARY KEY,
"name_val_1" TEXT,
"name_val_2" TEXT,
"location" TEXT,
"sheet_id" int not null UNIQUE,
"valid_start" timestamp NOT NULL DEFAULT NOW(),
"valid_end"  timestamp DEFAULT NULL
);

```
Checksum table
CREATE TABLE "checksum" (
  "id" SERIAL PRIMARY KEY,
  "created_at" timestamp UNIQUE NOT NULL DEFAULT (now()),
  "testchecksum" varchar NOT NULL
);
```
