<picture>
    <source srcset="/build/2025-df-kickoff/aalto-fablab-small.webp 480w"
    media="(max-width: 480px) and (max-resolution: 1.4dppx)" />
    <img src="/build/2025-df-kickoff/aalto-fablab.webp" alt="The red-brick building of Aalto Studios in Otaniemi, Espoo, Finland. The Aalto Fablab can be barely seen through the windows." />
</picture>
<span>*Aalto Fablab peeking out from the corner at the lovely, snowy Finland.*</span>

## Digital Fabrication, week 0

This is something I've been waiting for for a while now. Electronics has been a
topic on the backlog for me for several years already. About a year ago (fall of
2023), I started actually getting more interested in it as a possibility to
repurpose consumer electronics that have been lying around the house, somewhat
at the end of their (conventional) lifespan. 

Shortly, I came across the Aalto University Digital Fabrication
minor and got *very* excited. But when I looked into it, I found out that you
had to make a separate application and that the application period had already
ended (queue sad trombone noise). However, I got very motivated to make sure
that I get into that minor the next time it ran. In the meantime, I found the
"Electronics workshop" course in Aalto and got my electronics fix from that.

Come last autumn, my hands were itching to write the application for this year's
Digital Fabrication minor. Eventually, I of course found out that this year
there is no separate application. I didn't expect I'd ever be disappointed by
that but there you go. 

This week, it finally started. I'm a little bit too ready for it as I want to
already just jump into CNC-milling, PCB-design, really any of the things I haven't
tried yet. But I should take it easy. I got the excellent advice of a Digital
Fabrication alumnus that I should really plan for stamina since the minor will
be quite intensive.


### Website

Time to get meta. The first task for us was to create a documentation website.
If you're reading this, I guess I've succeeded 🎉. I've been wanting to make a
personal portfolio website for some time already and have also made a couple
poor first drafts. Software-wise, my latest interests have been 
[the Rust language](https://www.rust-lang.org/) and the [HTMX](https://htmx.org/)
javascript library(?), which is why those two make an excellent base for the
software in my website. When I'm learning some other language/framework/paradigm
I can then rewrite the website with that and learn something new all over again!

The actual assignment in DF was creating a very simple website that would be
automatically served by Git(Lab/Hub) to a web page. Due to my agenda for a
portfolio website, I wanted to go (quite a bit 😅) beyond that.

I'm also quite interested in trying out weird shit in web development. One idea
I had was randomly generated colors for each page visit (while adhering to
[the WCAG 2.1 spec](https://www.w3.org/TR/WCAG21/#contrast-enhanced). This was something I'd
already implemented for a previous run at a portfolio site and decided to port
it over to the new one. Another idea I sloshed around in my mind was how I'd do
content management. The website will be somewhat of a blog, meaning that I need
to create posts somehow. I quite enjoy writing longer form in 
[Markdown](https://www.markdownguide.org) and thus
wanted to use that somehow for content management. First, I thought I'd simply do
client-side rendering of MD to HTML with a JS library such as [Marked](https://marked.js.org),
but then I realized I might as well just compile the posts into HTML beforehand
and the server can then dish them out. I decided to use
[Pandoc](https://pandoc.org) for that as it seemed very mature and I had a bit of
experience with it beforehand. The only problem (so far :D) I could see with
this approach was that I'd have no metadata like tags and title on the
website etc. As a first solution, I decided to use an
[SQLite](https://www.sqlite.org/) database and make a row for each post
containing metadata. 

The structure of my server ended up looking something like this:

<pre>
├── justfile
├── posts
│   ├── 2025-df-kickoff
│   ├── About
│   ├── justfile
└── server
    ├── client
    ├── db.sqlite
    ├── justfile
    ├── migrations
    ├── src
    └── templates
</pre>

`posts/` has the source .md files of the posts I've written (and any referenced
files like images). `server/` contains both the rust server source code (inside
`src`) and the `client/` (for assets, CSS and any possible javascript code such
as HTMX). `migrations/` contains SQL files that, when aggregated, express the
current state of the SQLite database. `templates/` contains
[Jinja](https://jinja.palletsprojects.com/en/stable/) templates that are used on
the rust backend to create dynamic content (using the
[minijinja](https://docs.rs/minijinja/latest/minijinja/) rust crate).

For building, bundling and deploying, I decided to go with
[Just](https://github.com/casey/just) as it seemed like a very nice and simple
way to manage a varying mix of different source files. The definitions for it
are managed in the `justfile`s (similar to e.g. Makefiles). For example, to
build my posts (convert them from MD to HTML), I could run `just` inside `posts/`
which would then execute the "default" script:

```makefile
default:
  #!/usr/bin/env bash
  for dir in *; do 
    [[ -d $dir ]] && pandoc $dir/content.md -o $dir/content.html
  done
  exit 0
```

The website structure started to come together. Next up was to actually get into
the nitty-gritty of HTML & CSS.
