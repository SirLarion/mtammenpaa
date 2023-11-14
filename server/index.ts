import { Elysia } from 'elysia';
import { Database } from 'bun:sqlite';
import { staticPlugin } from '@elysiajs/static';
import cors from '@elysiajs/cors';

const { PORT = 8080, DB } = process.env;

const db = new Database(DB);

const getPosts = () => db.query('SELECT * FROM blogPosts;').all();

new Elysia()
  .use(cors())
  .use(staticPlugin({ prefix: '/' }))
  .get('/posts/all', getPosts)
  .get('/posts/:postId', ({ params }) =>
    Bun.file(`blog/${params.postId}/post.html`)
  )
  .get('/', () => Bun.file('public/index.html'))
  .listen(PORT, () => console.log(`🚀 Listening at localhost:${PORT}`));
