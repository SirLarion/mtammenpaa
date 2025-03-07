<script>
    GEOMETRY_FILES = ["/media/fatspacer.glb", "/media/fusilli.glb", "/media/bottlecap.glb"];
    INITIAL_ANGLE = 25;
</script>
<script type="module" src="/three.js" defer></script>

<picture>
    <source srcset="/media/caliper-small.webp 480w"
    media="(max-width: 480px) and (max-resolution: 1dppx)" />
    <img src="/media/caliper.webp" fetchpriority="high" alt="A vernier caliper clamping a small metallic ring-like object." />
</picture>
<span>*Funky-looking spacer, it's like two different-sized spacers for the price of one 💰*</span>

## Digital Fabrication, week 3

I have been working with CAD tools in one way or another for about 10 years.
That's quite surprising for me as I feel like I've only done *real* CAD for a
couple of months now. By real CAD, I mean specifically 3D-modelling using
software like FreeCAD. I realize now that that's quite a narrow view. I am very
familiar with using Blender for 3D modelling (both for printing and rendering
purposes), Inkscape for vector graphics and GIMP or Photoshop for raster
images. 

I do still think there are quite fundamental differences between the engineer's
CAD and the artist's CAD, but I can't quite put my finger on what they are. When
I started using FreeCAD after having used quite a bit of Blender, I felt the
difference click. Maybe it just has to do with how you get to the end result
moreso than the result itself. *Using* FreeCAD feels more like programming and
Blender more like modelling.

I'm also quite comfortable with *non-digital* fabrication, mainly woodworking.
For me, CAD has filled the niche of creating objects which would otherwise be
difficult (considering my skillset) to create by hand. It is a tool for
accomplishing a specific task. The task that started my (engineer's) CAD
adventure was fixing a coffee thermos. I'd bought it from the Aalto University
shop back when I began my studies in 2019 and it had served me well. Now it
had broken in the most ridiculous way. It had a screw-on lid, whose top half
opened when pressing on a clamp. One day, the *clamp* broke in half, rendering
the whole thermos useless.

One option would've been to just make a new clamp. I disliked the way it had
broken though and felt that I didn't need the "convenience" of the thermos
opening up at the press of a button. Instead, I decided to remake the whole
screw-on lid — just without the opening mechanism. I'd heard about FreeCAD (and
other similar tools) by this point and wanted to give it a whirl. I insist on
using open source tools if I can so FreeCAD seemed like a no-brainer.

### FreeCAD starter

FreeCAD (and probably other similar CAD programs), as I've learned, has the
concept of the *sketch* at its core. Largely speaking, everything you do is
built out of 2D-sketches that have well-defined shapes and locations. You could
probably just build all of these sketches out of simple lines and arcs, but for
convenience, there are several different possibilities for what to use. So far
on my FreeCAD adventures I've been mainly using the "Create circle by center"
tool as (for some reason) most of my models — such as the thermos lid — have
been circular.

On the course, I learned about using construction geometry, that is, adding
geometry to sketches that only acts as reference and is not included in the
final model. Normal geometry in FreeCAD needs to be constrained for the sketch
to be valid. Literally, you cannot do anything with a sketch that isn't
constrained. Construction geometry doesn't need to be constrained, which is why
its so useful as a point of reference. It can also be used *to* constrain, so,
for example, if I want to constrain one end of a line on the perimeteter of a
circle (rather than it's center), I could add a line as construction geometry
from the center to the perimeter and then constrain the other line to that.

Constraints generally are the double-edged sword of FreeCAD. In many other
modelling software, the requirements for sketch creation are more lax. However,
that can also lead to strange undefined behavior. In FreeCAD, when you know
something is constrained, you know it's going to work for modelling. *Getting*
there can be quite a task though. There have been several occasions in which
I've been *absolutely certain* that FreeCAD is just somehow broken and I *must*
be correct in thinking that there are no more degrees of freedom left.

One quite surefire way of finding out what exactly isn't constrained yet is to
just click and drag on the sketch. Whip it around a little bit in different ways
(yes, a very rigorous and academic approach) and look at how it's moving. This
is how I discovered a particularly annoying underconstraint when I was making
round-edged pockets on the bottom of a ring. I used an arc to make the sketch for
the pockets but the angle of the arc just refused to be constrained. Eventually
I just gave and constrained it by using the "Block edge" constraint — quite
shameful, I know. Maybe I should revisit that sketch after learning more on the
course. 🤔

### Spacer

A few weeks back, while doing maintenance on my fatbike that I'd bought used a
year back, I found out that it was missing a part. On one side of my rear wheel,
there was a very specific and funky-looking spacer where the wheel's hub meets
the dropout (bike-words for the place where the wheel attaches to the frame). On
the other side, there was an *empty space* shaped like a specific and
funky-looking spacer. I don't quite understand how I biked for a whole winter
with this problem present. Despite this previously perfect operation, now I
couldn't quite get the wheel to align properly so something had to be done.


Fortunately, I have a mechanical engineer friend that is always ready to spin up
the lathe and start chewing metal. Before getting hands-on, though, they needed
a model of the spacer. Thus, a perfect opportunity to do something I want and
*also* work on the Digital Fabrication assignment (not that I wouldn't want that
anyway of course 😇).

In terms of workflow, *previously* I would've done something like this:

1. Circle sketch for the "bottom" cylinder of the spacer.
2. Pad 
3. On top of the pad, circle sketch for the "top" cylinder of the spacer.
4. Pad 
5. Circle sketch for the hole going through
6. Pocket
7. Chamfer the sharp edges

In the spirit of the assignment, though, I wanted to try something new. First
off, I made the model parametric by adding a spreadsheet and filling it in with
the dimensions of the part. It took me a moment to understand as I didn't
realize that I couldn't *use* the values just by referring to the labels, but
I had to set an alias for each field.

I hadn't used the "revolution" tool in the Part Design workbench before. That
was practically as easy an approach as the one listed above so I went with it. I
went into sketcher, drew a couple of lines and used the horizontal and vertical
constraints to get them in the right shape. Measuring the part, it was easiest
to just measure the different diameters, so those were the values that I had in
the spreadsheet. Then I constrained the horizontal dimensions of the lines
relative to the origin using, for example, `Spreadsheet.FullDiameter / 2` and
`Spreadsheet.HousingDiameter / 2` (for the bottom and top cylinder radii
respectively), and then did the same for the vertical dimensions.

<picture>
    <source srcset="/media/sketch-dark.webp 1x" media="(prefers-color-scheme: dark)">
    <source srcset="/media/sketch-light-small.webp 480w" media="(max-width: 480px) and (max-resolution: 1.4dppx)">
    <source srcset="/media/sketch-dark-small.webp 480w" media="(prefers-color-scheme: dark) and (max-width: 480px) and (max-resolution: 1.4dppx)">
    <img src="/media/sketch-light.webp" loading="lazy" alt="FreeCAD in sketcher mode, showing a sketch looking like tall, elongated, letter L">
</picture>

With the sketch ready, I clicked on "Revolution" and out comes the model. As a
finishing touch, I added a chamfer on the edges. Here's the model rendered out
for your convenience.

<picture id="fatspacer.glb">
    <source srcset="/media/fatspacer-small.webp 480w"
    media="(max-width: 480px)" />
    <img src="/media/fatspacer.webp" loading="lazy" alt="A 3D-model of a 2-layered
    cylinder, where the top cylinder is around half the size of the bottom one." />
</picture>
<span>*Go on then, touch it.* 😏</span>

Just to try out some other additive and subtractive tools, I started working on
a strange helix thing. In the sketch, I wanted to connect a circle and a regular
polyhedron with two parallel lines and it turned out to be more difficult than I
thought. The problem was that, I was trying to somehow split the circle at a
certain point on it's perimeter. Eventually I realized that doing so makes no
sense and is, in fact, just my vector-graphics-head talking. Instead, I removed
the circle after having the two lines constrained. Then I put in an arc in its
place. After that, getting the rest constrained was very simple.

I used the additive helix on the sketch and it worked about as well as I'd
imagined. However, the next problem came with the physical limitations of my
6-year-old laptop. FreeCAD started running v-e-e-e-r-y-y slowly.
Initially, I thought I could also make a subtractive helix on the same model,
but that turned out to be a no-no.

<picture id="fusilli.glb">
    <source srcset="/media/fusilli-small.webp 480w"
    media="(max-width: 480px) and (max-resolution: 1.4dppx)" />
    <img src="/media/fusilli.webp" loading="lazy" alt="A 3D-model of a helical
    shape looking a bit like fusilli." />
</picture>

Just to get an example of using subtractive helix (and also to benchmark having
multiple concurrent WebGL contexts on my website), here's a special bottle cap I
modelled a couple months back. It's used for attaching an air lock to a bottle
that has something fermenting in it.

<picture id="bottlecap.glb">
    <source srcset="/media/bottlecap-small.webp 480w"
    media="(max-width: 480px) and (max-resolution: 1.4dppx)" />
    <img src="/media/bottlecap.webp" loading="lazy" alt="A 3D-model of a bottle
    cap that has a hole in the middle." />
</picture>

Here are all the project files for the above models zipped in a neat little
package: <a href="/media/projects.zip" download="projects.zip">ZIP</a>

Till next week 👋
