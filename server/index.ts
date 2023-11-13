import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import cors from "@elysiajs/cors";


const {
  PORT = 8080,
} = process.env;


new Elysia()
  .use(cors())
  .use(staticPlugin({ prefix: "/" }))
  .get("/", () => Bun.file("public/index.html"))
  .listen(PORT, () => console.log(`🚀 Listening at localhost:${PORT}`));
