import { Database } from 'bun:sqlite';
import { keys, values, without } from 'ramda';

const { DB } = process.env;

const main = async () => {
  const db = new Database(DB);

  const fields = ['id', 'title', 'tags', 'public'];
  const obj: Record<string, string> = {};
  console.write('Enter post ID\n> ');

  let i = 0;
  for await (const line of console) {
    if (line.length > 0) {
      if (fields[i] === 'public') {
        if (line === 'true') obj.publishedAt = "datetime('now')";
        if (line === 'false') obj.publishedAt = 'null';
      } else {
        obj[fields[i]] = `"${line}"`;
      }
    }
    i++;

    if (i === fields.length) break;
    console.write(`\n${fields[i]}:\n> `);
  }

  const postKeys: string[] = [...keys(obj), 'updatedAt'];
  const postValues: string[] = [...values(obj), "datetime('now')"];

  const queryStr = `INSERT INTO blogPosts (${postKeys.join(
    ', '
  )}) VALUES (${postValues.join(', ')}) ON CONFLICT(id) DO UPDATE SET ${without(
    ['id'],
    postKeys
  )
    .map(key => `${key}=excluded.${key}`)
    .join(', ')};`;

  db.query(queryStr).run();
};

await main();
