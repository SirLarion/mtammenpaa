## Digital Fabrication, week 2

```rust
const FOO: [&str; 3] = ["one", "two", "three"];
println!("{:?}", FOO);
```

```html
<picture>
    <source srcset="/build/2025-df-kickoff/aalto-fablab-small.webp 480w"
    media="(max-width: 480px)" />
    <img src="/build/2025-df-kickoff/aalto-fablab.webp" alt="The red-brick building of Aalto Studios in Otaniemi, Espoo, Finland. The Aalto Fablab can be barely seen through the windows." />
</picture>
<span>*Aalto Fablab peeking out from the corner at the lovely, snowy Finland.*</span>
```

```json
{
  "path": "2025-df-web-documentation",
  "img_urls": "code-dark.webp,code-light-small.webp,code-dark-small.webp,code-light.webp",
  "img_alt": "Rust code displaying the implementation of a web server endpoint.",
  "display_name": "Digital Fabrication Week #1",
  "description": "Webdev time. Flavors of Rust, HTMX, Sqlite with exorbitant amounts of CSS on top."
}
```

```markdown
## Digital Fabrication, week 1
```

```ts 
const initApp = async () => {
  const app = express();

  const db = await sqlite.open({ filename: 'db.sqlite', driver: Database });
  db.migrate();

  initializeRoutes(app, db);

  const { PORT } = process.env;

  const server = app.listen(PORT, () => {
    console.log(`v&m-love listening on port ${PORT} 💖`);
  });

  // Handle graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing v&m-love');
    server.close(() => {
      console.log('HTTP server closed');
    });
  });
};

initApp();
```

