<picture>
    <source srcset="/build/2025-df-kickoff/aalto-fablab-small.webp 480w"
    media="(max-width: 480px)" />
    <img src="/build/2025-df-kickoff/aalto-fablab.webp" alt="The red-brick building of Aalto Studios in Otaniemi, Espoo, Finland. The Aalto Fablab can be barely seen through the windows." />
</picture>
<span>*Aalto Fablab peeking out from the corner at the lovely, snowy Finland.*</span>

## Digital Fabrication, week 0

This is something I've been waiting for for a while now. Electronics has been a
topic on the backlog for me for several years already. A year ago, I started
actually getting more interested in it as a possibility to repurpose consumer
electronics that have been lying around the house, somewhat at the end of their
(conventional) lifespan. 

Shortly, I came across the Aalto University Digital Fabrication
minor and got *very* excited. But when I looked into it, I found out that you
had to make a separate application and that the application period had already
ended (queue sad trombone noise). However, I got very motivated to make sure
that I get into that minor the next time it ran. In the meantime, I found the
"Electronics workshop" course in Aalto and I got my electronics fix from that.

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

I'm also quite interested in trying out weird shit in web development. One idea
I sloshed around in my mind was how I'd do content management. The website will
be somewhat of a blog, meaning that I need to create posts somehow. I quite
enjoy writing longer form in [Markdown](https://www.markdownguide.org) and thus
wanted to use that somehow for content management. First, I thought I'd do
client-side rendering with a JS library such as [Marked](https://marked.js.org),
but then I realized I might as well just compile the posts into HTML beforehand
and the server can then dish them out.

Another item in the "weird shit" -list was the colors.In a previous run of my
portfolio site, I made this random palette generator that adheres to the [WCAG
2.1 standard](https://www.w3.org/TR/WCAG21/#contrast-enhanced). I wanted to port
that to the new site as I do like the idea. After getting a basic
[actix-web](https://actix.rs/) server running and HTMX successfully loading
stuff into the DOM from there, I jumped on the color porting. There was nothing
super difficult about it, but in the original Typescript implementation, I used a
couple different JS libraries to handle the color formats and, importantly,
check for the contrast between colors. Initially, I thought of just importing
the same libraries in the HTML. I tried the idea on for size, but it was bugging
me a bit. As HTMX has quite a backend-heavy approach to client-side state, I
wanted to lean into that and try and have as little JS as I could. Following
that, I realized I could just generate the colors on the backend! I was already
planning on using a [templating engine](https://en.wikipedia.org/wiki/Web_template_system) 
so I could approach the colors in the same way.

The first templating engine I tried was
[Askama](https://rinja-rs.github.io/askama/). It did the trick initially and I
could move on to actually generating the colors. The color generator works by
utilizing [the HSL colorspace](https://en.wikipedia.org/wiki/HSL_and_HSV). It
first picks a random hue and some fairly low value for saturation and a high one
for lightness. Then it iteratively increases the saturation and decreases
lightness until the resulting color has a contrast ratio above 4.5 (WCAG
defined value for standard text against a background) with the original
color. I needed to replace the contrast checker with something rust-based. I
quickly found [palette](https://docs.rs/palette/latest/palette/), quite an
advanced rust crate for managing colors between different color spaces, getting
quite deep into color theory even. It was excessive for my needs, but there did
not seem to be anything else that would work (AND remain stable in the longer
term!) so I went with it.

Calculating the color contrast with the palette crate seemed like an easy task,
but, well, there is a but.

```rust
fn get_themed_gen_colors(t: &str, h: f32) -> ClientColors {
    let is_light = t == "light";
    let s: f32 = 0.35;
    let l: f32 = if is_light { 0.85 } else { 0.15 };

    let hc =
        generate_high_contrast_color(Hsl::new_srgb(h, s, l), if is_light { -1.0 } else { 1.0 });

    // CSS has 0-100 for the range of s & l
    let (s, l) = (s * 100.0, l * 100.0);
    let (hcs, hcl) = (hc.saturation * 100.0, hc.lightness * 100.0);

    ClientColors {
        bg_rainbow: format!("hsl({}, {}%, {}%)", h, s, l),
        bg_mono: format!(
            "hsl({}, {}%, {}%)",
            h,
            s,
            if is_light { 98.0 } else { 10.0 }
        ),
        bg_monostrong: format!(
            "hsl({}, {}%, {}%)",
            h,
            s,
            if is_light { 90.0 } else { 20.0 }
        ),
        bg_rainbowlight: format!(
            "hsl({}, {}%, {}%)",
            h,
            s,
            l + if is_light { -5.0 } else { 5.0 }
        ),
        fg_rainbow: format!("hsl({}, {}%, {}%)", h, hcs, hcl),
        fg_rainbowdark: format!(
            "hsl({}, {}%, {}%)",
            h,
            hcs,
            hcl + if is_light { -15.0 } else { 15.0 }
        ),
        fg_rainbowreverse: format!(
            "hsl({}, {}%, {}%)",
            (h + 180.0) % 360.0,
            hcs,
            hcl + if is_light { -15.0 } else { 15.0 }
        ),
    }
}
```
