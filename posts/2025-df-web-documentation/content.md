<picture>
    <source srcset="/media/code-dark.webp 1x" media="(prefers-color-scheme: dark)">
    <source srcset="/media/code-light-small.webp 480w" media="(max-width: 480px) and (max-resolution: 1dppx)">
    <source srcset="/media/code-dark-small.webp 480w" media="(prefers-color-scheme: dark) and (max-width: 480px) and (max-resolution: 1dppx)">
    <img src="/media/code-light.webp" fetchpriority="high" alt="Rust code displaying the implementation of a web server endpoint.">
</picture>
<span>
    <em>
        A picture? Why not just code as text? - Gotta have pictures too 💅
    </em>
</span>

## Digital Fabrication, week 1

Website building continues. The *key* next steps were to create some content and
the ways to route to it. What I *wanted* to do was a lot more than that.
However, let's start with the important stuff.

### Navigation

Creating navigation turned out to be surprisingly difficult. Regular anchor-tag
based navigation in HTML is of course exceedingly simple. However, I wanted to
create a reactive web page using HTMX partial loading *but* with no client-side
state from javascript. At the same time, the website endpoints have to be built
in such a way that their content can be partially loaded with HTMX *or* fully
loaded simply by navigating to that site.

The goal was to create a nav that has simple text-buttons looking like links,
except if the user is on the selected page. For example, if the user is on the
"front" page, the nav would look like this:

<pre>
    <b>front</b> <b><u>about</u></b> <b><u>posts</u></b>
</pre>

Let's say the anchor for the active page has `class="active"`. Then the CSS is
trivial:

```css
a.active {
  text-decoration: none;
}
```

Now, when I click <b><u>about</u></b>, how does that anchor element gain the
`active` class? And how does the anchor for the previous page lose it? In the
longer term, I think this could be done with some CSS selector trickery.
However, with limited time before the DF course ramps up to more intensive work,
I need quick solutions. I ended up creating a Jinja template for the whole `<nav>`
element. The nav elements have constant definitions in the rust backend and the
nav then gets rendered every time one of the nav pages is loaded.

```rust
const NAV_ITEMS: [NavItem; 3] = [
    NavItem {
        name: "front",
        endpoint: "/",
        active: false,
    },
    NavItem {
        name: "about",
        endpoint: "/about",
        active: false,
    },
    NavItem {
        name: "posts",
        endpoint: "/posts",
        active: false,
    },
];

pub fn build_nav(jinja: &Environment, active_name: &str) -> Result<String, AppError> {
    let template = jinja.get_template("nav.html")?;
    Ok(template.render(context! {
        nav_items => NAV_ITEMS
            .iter()
            .map(|i| {
                let item = i.clone();
                if item.name == active_name {
                    NavItem { active: true, ..item }
                } else {
                    item
                }
            }).collect::<Vec<NavItem>>()
    })?)
}
```
 
However, because of the requirement for full page loads, the nav definition
needs to be passed to each page regardless of whether it actually changes
something in the nav. Quite annoying and creates lots of code duplication, but
it'll do for now.

### Content

Time to get to writing human language. I'll refrain from the meta-level of writing
about writing though so I'll jump to the part where I code more. With some
content available, I needed a way to route to it. The actual route to the built
HTML file on the server is `client/build/2025-df-kickoff/content.html` (for the
Week #0 post). This makes sense for my own structuring of the posts, but for the
navigation structure of the website, I wanted something different. For example,
for the DF posts, I wanted an endpoint of `/digital-fabrication/weekX`, which
meant that the endpoint needed to be defined separately in the SQLite table
I created for the posts. 

It's a messy structure, but — as with the nav state — it'll do for the time
being. Longer term, I think I want to either insert each post into the database
or build the posts such that the paths of the files are the same as the
endpoints. This will need quite a bit of refactoring in the future. On that
note, the backend code has also generally gotten messy as I've gone along.
I'll have to do some heavy cleanup at some point.

So, for the routing to a post, I created the endpoint `/{category}/{name}`,
where — again with DF posts as an example — the `category` is
"digital-fabrication" and `name` is the unique name of that post within the
category ("week0"). The backend then queries for posts that have `endpoint =
'/{category}/{name}` (which *should* be just one post) and gets back a row that
has metadata about the post — primarily, the actual path to the post HTML file.
The backend then serves that file (actually, it injects it into a Jinja template
but same-same).

```rust 
// Using SQLX as a driver for SQLite
let PostMeta { path, .. } =
    sqlx::query_as::<_, PostMeta>("SELECT endpoint, path FROM posts WHERE endpoint = $1;")
        .bind(req.path())
        .fetch_one(&ctx.db_pool)
        .await?;

let post = fs::read_to_string(format!("./client/build/{path}/content.html"))?;
```

Now, I still needed the actual `/posts` page to list the endpoints that lead to
the post files so that a user doesn't need to magically know the endpoint of
each post.

Here, I wanted to have a small preview image + description combo. As a simple
first pass at that, I just created a `preview.html` file for each post. Then,
when the user fetches `/posts`, the backend queries for all posts (or, in the
longer term, the latest 10 posts for example) and maps the endpoints of those
posts to their corresponding preview files. Yes, it's messy, I know 💩. 

### Bonus, mega-theming

Now to the fun part. I wanted to have the page be *entirely* responsive to the
device theme selection (and when I say entirely, well, look at the favicon). For
CSS, this was quite easy. In the color generator, I just create two sets of
color variables rather than one. Then, depending on the `prefers-color-scheme`
media query, I can select the correct set of colors.

```css 
/* Shortened list of colors */
:root {
  --bg-rainbow: var(--l-bg-rainbow);
  --fg-rainbow: var(--l-fg-rainbow);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-rainbow: var(--d-bg-rainbow);
    --fg-rainbow: var(--d-fg-rainbow);
  }
}
```

Images usually aren't themed. However, as I made took the screenshot of code on
top of this post, I realized I could quite simply switch the theme of my editor
and have a light theme and a dark theme version. With images, I can have
multiple source definitions by using the `<picture>` and `<source>` tags. The
functionality seems to be mainly used for image optimization by having multiple
sizes of images.

```html 
<picture>
    <source srcset="picture-small.webp 480w" media="(max-width: 480px)" />
    <img src="picture.webp"  />
</picture>

```

As you can see, the selection of source is defined via media query. However, as
I learned, you can also use the `prefers-color-scheme` media query for image
source selection too. For example, for the image on this page:

```html 
<picture>
    <source 
      srcset="/media/code-dark.webp" 
      media="(prefers-color-scheme: dark)"
    />
    <img 
      src="/media/code-light.webp" 
      alt="Rust code displaying the implementation of a web server endpoint." 
      width="960"
    />
</picture>
```

Finally, the favicon. Oh, the favicon. This was very excessive and completely
unnecessary, but it is my fav part of the site (pun aggressively intended).
Normally, the way you define a favicon is by having a `<link rel="icon"
href="/favicon.ico" />` definition in your document head pointing to an image in
your server `/public` folder. After scouring the `<link>` tag MDN docs, I found
that only the `rel="icon"` and the filetype of the favicon file really matter
when actually setting the favicon. This meant that I could have
`href="/favicon"` that points to a *server endpoint that returns a file* rather
than just a file. This meant it was quite simple to get a custom favicon for
each page reload similarly to the rest of the page. 

BUT<sup>BUT</sup> (very large but), getting a custom favicon *in the same theme
as the rest of the site* was a very different beast indeed. There's no
client-side state and no session-based state on the backend either so neither of
those works. The color generator only random-generates the hue of the color so
one option was to set the hue in the user's `window.localStorage`. This doesn't
have the intended effect though as the color wouldn't change per full-load.

It took quite a bit of thinking, but the approach I went with was to have the
`/favicon` path take the random-generated hue as a query parameter:
`/favicon?hue=<f32>`. How does the client know the hue though? The HTML is all
just Jinja templates, so the backend passes the hue to the template that creates
the favicon route with the hue as a template variable: `/favicon?hue={{ hue_var
}}`. Now, as with the nav, the hue needs to be passed down to *every* full-page
load, which is incredibly stupid. But like I said, it's definitely the best part
of the whole site.

Next week there's some optimization trickery and also video content. No idea
what that'll entail as I haven't really done anything like it but guess we'll
find out 🏂
