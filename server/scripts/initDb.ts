import { Database } from 'bun:sqlite';

const { DB } = process.env;

const tables = [
  'CREATE TABLE IF NOT EXISTS blogPosts (\
    id TEXT PRIMARY KEY, \
    title TEXT NOT NULL, \
    updatedAt TEXT, \
    publishedAt TEXT, \
    tags TEXT NOT NULL \
  );',
];

const init = async () => {
  const db = new Database(DB, { create: true });

  tables.forEach(initTable => db.query(initTable).run());
};

await init();
