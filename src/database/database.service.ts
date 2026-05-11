import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

type MigrationRow = QueryResultRow & {
  name: string;
};

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly pool = new Pool({
    connectionString:
      process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/todolist',
  });

  async onModuleInit(): Promise<void> {
    await this.connectWithRetry();
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }

  query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[],
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params);
  }

  private async connectWithRetry(attempt = 1): Promise<void> {
    try {
      await this.runMigrations();
      this.logger.log('Postgres connection ready');
    } catch (error) {
      if (attempt >= 10) {
        throw error;
      }

      this.logger.warn(`Postgres unavailable, retrying (${attempt}/10)`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await this.connectWithRetry(attempt + 1);
    }
  }

  private async runMigrations(): Promise<void> {
    await this.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const migrationsPath = join(process.cwd(), 'migrations');
    const migrationFiles = (await readdir(migrationsPath))
      .filter((file) => file.endsWith('.sql'))
      .sort();

    const appliedResult = await this.query<MigrationRow>(
      'SELECT name FROM schema_migrations',
    );
    const appliedMigrations = new Set(appliedResult.rows.map((row) => row.name));

    for (const file of migrationFiles) {
      if (appliedMigrations.has(file)) {
        continue;
      }

      await this.applyMigration(file, await readFile(join(migrationsPath, file), 'utf8'));
    }
  }

  private async applyMigration(name: string, sql: string): Promise<void> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [name]);
      await client.query('COMMIT');
      this.logger.log(`Applied migration ${name}`);
    } catch (error) {
      await this.rollback(client);
      throw error;
    } finally {
      client.release();
    }
  }

  private async rollback(client: PoolClient): Promise<void> {
    try {
      await client.query('ROLLBACK');
    } catch (error) {
      this.logger.error('Failed to roll back migration transaction', error);
    }
  }
}
