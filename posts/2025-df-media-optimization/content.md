<p>
<video autoplay loop muted poster="/media/cat.webp" alt="A gray tabby cat playing with a piece of birch bark that's attached to an old shoelace. He rolls around on a carpet while attacking the bark with playful fury.">
  <source src="/media/cat-small.webm" media="(max-width: 480px) and (max-resolution: 1.4dppx)" />
  <source src="/media/cat.webm" />
</video>
<span>
  <em>
    Kastanja (Finnish for "Chestnut") enjoys playing with a piece of bark
    attached to an old shoelace
  </em>
</span>
</p>

## Digital Fabrication, week 2

This week in DF, we have a swath of topics covering the use of and copying and
licensing media to and from our websites. Specifically, the optimization of
images and video for use online is discussed along with Creative Commons
licenses and — quite relevant for today — the licensing of content to web
crawlers that train large language models. I'll go through these roughly in the
order I worked on them.

### Copyright

The first thing on the list is copyright. I'd actually already added a copyright
blurb at the footer of my page before we talked about it in class. I'd had a
vague idea about Creative Commons licenses, but nothing concrete so I went to
their site to investigate. The CC-BSY-NC-SA license tickled my interest for a few
reasons. 

First, the content I write here is quite personal in nature so the <span><img
class="icon" src="https://mirrors.creativecommons.org/presskit/icons/by.svg"
width="16" height="16" /></span> BY part seemed like a no-brainer. I am open to the
content being used and adapted, but not in commercial ways, hence the <span><img
class="icon" src="https://mirrors.creativecommons.org/presskit/icons/nc.svg"
width="16" height="16" /></span> NC. On top of that, I don't want adaptations to
be used commercially either so <span><img class="icon"
src="https://mirrors.creativecommons.org/presskit/icons/sa.svg" width="16"
height="16" /></span> SA seemed to do the trick for that.

After learning more about CC on the course, I also added the full set of CC
symbols in my site footer for some extra pizzazz 💅.

### Files online

Beyond plain text content, there are a lot of variables involved when sharing
files through your website. For example, if you're simply showing a
context-providing image in a blog post, let's be honest, it doesn't need to have
1920x1080p resolution. The single largest factor affecting website responsivity
is the speed of the back-and-forth message passing between the client and the
server (unless you somehow bodge up your website with weird JS or something). It
makes much more sense for the image to be as small as the largest resolution
that it's displayed in. Looking at it with an upright phone with 480 pixels
width, the image can then easily just have 480x270p resolution. This makes
loading the picture far more responsive as the required network bandwidth is
smaller.

In addition to the resolution, image quality and compression have a lot of room
for fiddling with. In many cases (especially when the image has been made
smaller), the human eye cannot even perceive the difference between two
images if the quality of the other has been decreased via extra compression.
This is why you should *never* serve images as PNG files since they are
uncompressed. JPG files can be heavily compressed with no noticable
differences in quality and these days WebP can be used to apparently go even
further.

The same things apply for video, but with an extra level of magnitude. Video is
practically always quite a bit larger in size than images, so serving one
requires extra consideration. MP4 and WebM are quite good compressed file types
for video, but inside that, you can still tune the level of compression
(and of course resolution and frames-per-second, for example), to fit your use
case. Vimeo focuses on artsy, high quality video so, for them, having less
compression makes sense. A TikTok video, whose content barely skims your
braincells however, can do with a lot more compression.

I think about media compression in a similar way to compiled source code. You
have your source (a PNG image, my server's rust files) which act as the generic,
single source of truth for that piece of media. The source is then
compiled/compressed for use in a *specific* use case (a small WebP for my blog,
my server's binaries built on my webserver, for that specific hardware and OS
software).

### Image optimization

The images I'd used on the website were already in the WebP format as I'd heard
that it's recommended for online images. I'd gone for it quite blindly though so
I was curious to find out what the effect was.

This picture from my [About page](/about) was a good example as it was taken
with a Real Camera™ (not a phone) so it was quite large. A 5456x3632p JPG, it
weighed in around 5.7MB.

<picture>
    <source srcset="/media/big-miska-small.webp 480w"
    media="(max-width: 480px)" />
    <img src="/media/big-miska.webp" loading="lazy" alt="An image of me to use as an
    example of image optimization" />
</picture>
<span>*Picture of me on the About page, this has been scaled and compressed
already*</span>

I converted it to one larger WebP variant at 960x639p and a smaller one at
480x320p with ImageMagick.

```bash
# ImageMagick picks the larger of the image's dimensions 
# and resizes it to the number you provide here
magick miska.jpg -resize 960x960 miska.webp
magick miska.jpg -resize 480x480 miska-small.webp

```
The larger one dropped to 114kB and the smaller one to 73kB. Those are **50x**
and **78x** reductions respectively — and it shows. The load times for the image
are now blazing fast. However, I found out I can do event better by tweaking the
quality settings of the image with `-quality X`. For example:

```bash 
magick miska.jpg -resize 960x960 -quality 50 miska.webp
```
Now, the 960p image is down to 98kB with no noticable difference in quality.

For the assignment, I had to make an image below 500kB at 1980px on the largest
side. With the previous command, this is fairly simple:
```bash
magick miska.jpg -resize 1920x1920 -quality 50 miska1920.webp
```

The result has very nice quality, yet is around 176kB:

<img src="/media/miska1920.webp" loading="lazy" alt="A 1920x1278p image of me to use as an example of image optimization." />

Now, I wanted to do this for *all* images on my site. However, I didn't want to
*have* to manually do that for each image in a post I make. Thanks to the build
system I discussed in [the #0 DF post](/posts/digital-fabrication/week0), I
could just add the ImageMagick command to the build steps of a post.

```makefile
default:
  #!/usr/bin/env bash
  shopt -s nullglob
  (rm -r build > /dev/null 2>&1 || true) && mkdir build
  for dir in *; do 
    if [[ -d $dir && $dir != "build" ]]; then
      mkdir build/$dir
      cd $dir
      pandoc content.md -o ../build/$dir/content.html
      
      for img in *.jpg *.JPG *.jpeg *.png *.webp; do
        imgname=${img%.*}
        magick $img -resize 960x960 -quality 50 ../build/$dir/$imgname.webp
        magick $img -resize 480x480 -quality 50 ../build/$dir/$imgname-small.webp
      done

      cd -
    fi
  done
  exit 0
```

I had to do a couple of extra things compared to the previous version. I made a
`build/` directory for all the built items inside posts so that the source files
wouldn't be riddled with so much excess stuff. Then, I wanted to be able to have
any of a large variety of image files as the original image. To enable iterating
through many different possibilities (this for loop: `for img in *.jpg *.JPG
*.jpeg *.png *.webp`), I enabled the `nullglob` shell option. It worked like a
a charm. Now I'm automatically getting a bigger and a smaller variant of WebP images for each
image I use in a post. Then I just need to define the different sources for the
image and the media query that chooses between them (like I did in [Week
#1](/posts/digital-fabrication/week1) with the light and dark theme).

```html 
<!-- For the About page, for example -->
<picture>
    <source 
      srcset="/media/miska-small.webp 480w" 
      media="(max-width: 480px)"
    />
    <img src="/media/miska.webp" />
</picture>
```


### Licensing for training LLMs

I'm quite apprehensive towards the use of LLMs in general. I feel their training
and operating costs (for society, not the companies developing them) are far too
high compared to the slop that comes out. Going in-depth on that is a topic for
another day, however, but this serves as the motivation for why I'm quite keen
on disallowing the training of LLMs on any content I have made. 

The `robots.txt` file has been a known standard for communicating about your
website to bots for a long time already. I have no quarrely with search engine
indexing bots to come look at my site — I don't mind being seen. Instead, I
found a `robots.txt` file in [a guide by Vivek
Gite](https://www.cyberciti.biz/web-developer/block-openai-bard-bing-ai-crawler-bots-using-robots-txt-file/)
that's practically a curated list of which bots to disallow if you specifically
don't like LLM trainers. Even further, a commenter by the name of Elias had
included it in an even larger compiled list. Here's the file in total:

```
User-agent: Amazonbot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-Agent: Applebot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Bytespider
Disallow: /
wide
User-agent: CCBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: cohere-ai
Disallow: /

User-agent: Diffbot
Disallow: /

User-agent: FacebookBot
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: ImagesiftBot
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: Meta-ExternalFetcher
Disallow: /

User-agent: Omgili
Disallow: /

User-agent: Omgilibot
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: Timpibot
Disallow: /

User-agent: YouBot
Disallow: /
```

A similar file we learned about in class is the `ai.txt` that's specifically
meant for these LLM trainers. 
[This ai.txt file generator](https://site.spawning.ai/spawning-ai-txt#ai-text-generator) 
was mentioned as a tool for getting this kind of file, so obviously I went and 
took an opt-out-of-everything variant of it and slapped it into my server root.

We also learned about the [not by AI badge](https://notbyai.fyi/) that
celebrates human creativity. While I'd definitely want one on this page, $99 for
an SVG is a little steep for my current budget of $0.

### Video optimization

As my website structure has small preview images and then larger images on the
posts themselves, I'd like to do the same for video as well. GIFs (that is,
image sequences in the GIF-format) are apparently not the best way to serve
short videos online. Instead, WebP seems to be the king on that front as well I
tried a simple ffmpeg command I copied from 
[Matt Joseph's blog](https://mattj.io/posts/2021-02-27-create-animated-gif-and-webp-from-videos-using-ffmpeg/)
that converts video to ~~WebP GIFs~~ (that's what I wrote intuitively and then
realized it makes no sense) animated webp. So for 5 seconds of 16 FPS animated WebP with
960px width starting at 54 seconds into the video, this is the command
```bash 
ffmpeg -i cat.mp4 -ss 54 -t 5 -vf "fps=16,scale=960:-1:flags=lanczos" \
    -vcodec libwebp -lossless 0 -compression_level 6 -q:v 30 -preset picture \
    -an -vsync 0 -loop 0 cat.webp
```
There's a lot of other stuff I have no clue about, but you know what they say

> When you find a command online, just blindly copy-paste it into your terminal
> and *hit it*

Fortunately, my computer remains intact and I got out the cat gif (yes, I'll say
gif now, "animated WebP" is too long) similar to the one you see at the top of
the page (but not the same one SPOILERS). 

The original `cat.mp4` is a chonker at 172MB. However it is also 1m 35s long at
30FPS 1920x1080p. The new `cat.webp` is 1.7MB so about 1% of the original size.
Pretty good. For the academic *lols*, how far can we take it? At 480p
(`cat-small.webp`), it's already 576kB. What about when we tweak the other
settings? After trying a couple values for the `compression_level` flag, it
seems like it doesn't have much of an effect on the file size. The FPS value and
`q:v` flag, however impact it quite a bit. Here's a table:

|                     | `q:v 30`                                                                                 | `q:v 20`                                                                                 | `q:v 10`                                                                                 | `q:v 5`                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| <span>16 FPS</span> | <img src="/media/cat-small.webp" loading="lazy" /><span>576kB</span>                     | <img src="/media/cat-small-q20.webp" loading="lazy" /><span>444kB</span>                 | <img src="/media/cat-small-q10.webp" loading="lazy" /><span>313kB</span>                 | <img src="/media/cat-small-q5.webp" loading="lazy" /><span>240kB</span>                  |
| <span>10 FPS</span> | <img src="/media/cat-small-q30-f10.webp" loading="lazy" /><span>359kB</span>             | <img src="/media/cat-small-q20-f10.webp" loading="lazy" /><span>277kB</span>             | <img src="/media/cat-small-q10-f10.webp" loading="lazy" /><span>195kB</span>             | <img src="/media/cat-small-q5-f10.webp" loading="lazy" /><span>150kB</span>              |

Let's see that smallest one in a bit more detail just for reference:

<img src="/media/cat-small-q5-f10.webp" loading="lazy" alt="A very low quality GIF of the same cat." />
<span>*That's pretty cursed.*</span>

Technically, the course assignment called for making a 10 second 1280x720p
embedded video (i.e. not a gif) below 2MB in size, so let's have a go at that to
appease our course-completion-dictating overlords. I'll do it in parts so as to
also gain a better understanding on using ffmpeg.

First I tried just removing audio and shortening down the video to 10 seconds
(`-ss 54 -t 10 -an`). That already shaved (more like scythed, really) it down
from 172MB to 10MB. Next, I tried scaling the video down to 1280x720p (`-vf
scale=1280:-1`). That halved the size again to 5MB. The rest was up to
compression and quality changes. I naïvely tried just changing the extension of
the output file to `.webm` and I did get a WebM file out, but it was actually a
couple hundred kilobytes larger than the previous MP4. I came across 
this [StackExchange post about converting to WebM](https://video.stackexchange.com/questions/19590/convert-mp4-to-webm-without-quality-loss-with-ffmpeg)
and decided to try some things mentioned there. The CRF value of videos was also
mentioned on the course, so I started twiddling with that (`-crf 30`) while
sticking to MP4 for now. With no noticable difference in quality, the filesize
dropped again from 5MB to **1.6MB**, meaning that it's smaller, still at 30FPS
1280p, than the 16 FPS 960p WebP gif I made before. 🤯 That's pretty crazy. I
tried further increasing the CRF value (bigger value -> smaller file), but the
quality started dropping fast after that.

The StackExchange post mentioned a two-pass approach with converting to WebM so
I went for that next (yeah, yeah we're below 2MB already, whatever). So for a
CRF 30 WebM video, you'd do
```bash
ffmpeg -i input.mp4 -b:v 0 -crf 30 -pass 1 -an -f webm -y /dev/null
ffmpeg -i input.mp4 -b:v 0 -crf 30 -pass 2 output.webm
```
The first go, I only got the 1280p MP4 down to a 4MB WebM. I was able to
increase the CRF here quite a bit, though. I actually got it all the way up to
CRF 50 without much of a decrease in quality. This equated to a 1MB file size.
With some quality loss, I could even do CRF 60 at 493kB!

Here's the final result at CRF 50:

<p>
  <video autoplay loop muted preload="none" src="/media/cat10HD.webm" poster="/media/cat10HD.webp" type="video/webm"></video>
</p>

That's much better and smaller than my WebP gif so I might as well use that in
the start of the post instead. I mean, with 960p I got the video down to 698kB
(vs. 1.6MB) and with 480p down to 238kB! 🥵 

This was all very interesting. I certainly didn't expect the video compression
to be such a roller coaster of emotions, but here we are. Next week we're
getting down to Computers Aiding our Design, which I'm looking forward to. I've
only self-learnt a bit of FreeCAD for 3D printing but I expect we'll go into
much greater depths than that.
