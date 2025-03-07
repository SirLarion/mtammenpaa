<script>
    GEOMETRY_FILES = ["/media/istand.glb"];
    INITIAL_ANGLE = 60;
</script>
<script type="module" src="/three.js" defer></script>

<picture>
    <source srcset="/media/drawing-small.webp 480w"
    media="(max-width: 480px) and (max-resolution: 1dppx)" />
    <img src="/media/drawing.webp" fetchpriority="high" alt="A drawing detailing measurements and plans for an iPod stand. The iPod is seen on the side and a vernier caliper opposite to it." />
</picture>
<span>*It's more of a thought process than a real drawing, I prefer to leave
that part to the CAD-side.*</span>

## Digital Fabrication, week 4

This week, our topic was "Computer Controlled Cutting". In theory, this included
all kinds of crazy shit like plasma and waterjet cutters and even [wire
EDM](https://en.wikipedia.org/wiki/Electrical_discharge_machining), which is
maybe the closest thing to sorcery I've ever seen. All of these are ways to get
maddeningly accurate pieces cut of all sorts of different materials. Plasma
cutters use the conductivity of the material being cut to create a plasma that
cuts through. Quite simple, but it requires conductive material (very much like
[powder coating paint](https://en.wikipedia.org/wiki/Powder_coating)). Waterjet
cutting is also simple in that it just pushes a high-pressure jet of water
through the material. However, getting the water to that pressure is a little
less simple as it's enough to cut strong metal. This method has the upside of
being able to cut anything (that it's strong enough for), but requires more
specialized equipment. Wire EDM is a whole different story. It uses a rapidly
pulsing current that passes through a wire. The wire is engulfed in a stream of
dielectric liquid that does some crazy magic<sup>1</sup> that slowly cuts
through whatever's in front of it.

<aside><sup>1</sup> Apparently, the current passing
through the wire creates an arc of current in the liquid, which removes
material.</aside>

### Laser cutting theory

In practice, we focused on laser cutting, which makes sense as it has maybe the
best balance of approachability and potential for use out of these methods. The
basic principle is that you use a CNC machine that points a laser at the
material you want to cut and the laser burns through. This limits the material
selection to those that can be cut by the power of the laser, but also to those
that don't emit incredibly toxic fumes when burnt, like PVC or vinyl do. In
practice, all of the materials emit some toxic fumes (shouldn't be breathing
smoke from burnt wood either!), which means that the laser cutter should always
be used in a very well ventilated area, preferably with a fume exhaust directly
in the cutter (in the fablab, there's a little knob that needs to be turned to 6
before cutting).

We also discussed the limitations of laser cutters. First, the laser is highly
focused to a point (focal point of the laser lens), if this point isn't where
your material is, you're gonna get a poor cut. This is because the "laser
waist", or the width of the laser beam at the point of contact with the
material, is then wider than it should be and the power of the laser is spread
over a larger area. Second, even if the laser is perfectly focused, there will
always be a tiny amount of material that is removed by the laser. This amout is
called "kerf", and not accounting for it can lead to your pieces suddenly not
fitting together even though your model says they should.

### Part design

To test out laser cutting, we got the assignment of designing an object with at
least three different laser-cut parts that fit together without having to glue
anything. I wanted to design a sleek-looking stand for my iPod (yes, I'm one of
*those* kinds of people) that could also house its charging cable. It would be
made out of plywood just for the ease of working with it. My first idea was a
podium-esque leaning-back design so that it could take some pressure from
pressing the buttons of the iPod while it's in the stand. I quickly realized
that my requirement for "sleek-looking" and the assignment spec of only
laser-cutting and not using any glue made that approach quite difficult. After
some thinking I came up with a very simple design that wraps a piece of plywood
around the bottom of the iPod by using two lattice hinges.

<picture>
    <source srcset="/media/plan-small.webp 480w"
    media="(max-width: 480px) and (max-resolution: 1dppx)" />
    <img src="/media/plan.webp" loading="lazy" alt="The drawn-out plan for the iPod stand." />
</picture>
<span>*It's more of a thought process than a real drawing, I prefer to leave
that part to the CAD-side.*</span>

The top part in the picture above is the actual "holder" for the iPod. In the
middle is the beef — the body of the stand. The image shows one lattice hinge
and the ends of the body where it wraps around and attaches to itself. The body
also contains rectangular holes. The little protrusions on the sides of the
top part go inside these holes so that the body holds the iPod in place. The
drawing actually has holes on the bottom too, which I drew there by mistake 🫠.
On the bottom, there's a display of how the body is locked in place by a simple
ring that also acts as the "weight" of the stand. The other two pieces can be
quite thin plywood, but this one should preferably be a little thicker just to
give the whole things some extra weight and sturdiness.

Next up it was time to write down parameters. Now, I'm a keyboard power-user and
I was frustrated with the workflow of entering aliases for FreeCAD spreadsheet
cells by right-clicking -> clicking properties -> clicking alias -> entering
alias. So I went for a little internet-surf and found that you can just press
Alt+A to focus an alias field that's in the same view. Perfect!

For designing the lattice, I found two excellent resources. The first, a PDF
created by some mechanical engineering undergrads called 
["Laser Cut like a Boss"](https://lasercutlikeaboss.weebly.com/uploads/2/7/8/8/27883957/advancedjoinery_master_web.pdf), 
that discusses the parameters of lattice hinges (and other laser cut joints). 
That further linked to a guide by 
["Deferred Procrastination"](https://www.defproc.co.uk/analysis/lattice-hinge-design-minimum-bend-radius/),
showing how to actually calculate the different parameters depending on your use
case.

This was quite useful as I was able to plug in my design specs into a
formula and find out what kind of cuts I would need to make. 

```
// I couldn't get Tex formatting to work so here's the monster I plugged into FreeCAD
// ArcAngle is really just 180 as it's a half turn.
NSegments = ceil(ArcAngle / (45 deg - acos((MaterialThickness + Kerf) / (2 * sqrt(MaterialThickness ^ 2 / 2)))))
```

Critically, I also found out that with 3mm plywood and assuming 0.2mm kerf, I'd
need 23 lattice segments to get a 180 degree turn. However, with my arc length
of `π * r = π * 9.45mm ≈ 29.7mm`, the segments would need to be `29.7 / 23 ≈
1.29mm` which is quite thin.

Later, I asked course staff and they said that actually there's only 0.1mm kerf
and that 1.29mm segment width should be doable. Interesting. I plugged in
0.1mm kerf to the formula and now the minimum segments is **46**! What? Looking
at the formula again, I realized that the kerf is actually beneficial here as it
creates the clearance for the bending of the segments. Essentially, without
kerf, there's no room for the segments to move. Further, I realized that `π / 2`
is not in fact 180 degrees but 90. My trigonometry has quite the chonky cover of rust
on it clearly. With that bit of added spice, now the required amount of segments
is 93, meaning a segment width of 0.32mm 😅. Dropping to a material
thickness of 2.0mm, I got the width up to 0.48mm. With the assumed kerf of
0.2mm, it would get up to 0.99mm which would be quite doable.

I tried modelling the lattice in FreeCAD. In terms of workflow, it was quite
easy. But right when I started creating the linear feature arrays for the
lattice, my computer started melting down. Bummer. However, with all the
parameters ready, I decided I could just make the lattices by hand in Inkscape.
It took a bit of manual copy-paste and align-to-last-selected (for some reason
the "Interpolate between paths" tool kept crashing for me), but I did get it
done.

<p>
<svg class="image" version="1.1" viewBox="0 0 134.476 32.100" xmlns="http://www.w3.org/2000/svg">
<g transform="translate(-17.116 -29.485)">
<rect x="17.116" y="29.485" width="134.38" height="32" fill="none" stroke-width="0.2" style="paint-order:stroke fill markers"/>
<path d="m38.802 29.463v13-13zm1.5002 0v13-13zm1.4996 0v13-13zm1.5002 0v13-13zm1.5002 0v13-13zm1.4996 0v13-13zm1.5002 0v13-13zm1.5002 0v13-13zm1.4996 0v13-13zm1.5002 0v13-13zm1.5002 0v13-13zm1.4996 0v13-13zm1.5002 0v13-13zm1.5002 0v13-13zm1.4996 0v13-13zm1.5002 0v13-13zm1.5002 0v13-13zm1.4996 0v13-13zm1.5002 0v13-13zm1.5002 0v13-13zm34.004 0v13-13zm1.5002 0v13-13zm1.4996 0v13-13zm1.5002 0v13-13zm1.5002 0v13-13zm1.4996 0v13-13zm1.5002 0v13-13zm1.5002 0v13-13zm1.4996 0v13-13zm1.5002 0v13-13zm1.5002 0v13-13zm1.4996 0v13-13zm1.5002 0v13-13zm1.5002 0v13-13zm1.4996 0v13-13zm1.5002 0v13-13zm1.5002 0v13-13zm1.4996 0v13-13zm1.5002 0v13-13zm1.5002 0.022738v13-13zm-91.754 2.9998v26-26zm1.4996 0v26-26zm1.5002 0v26-26zm1.5002 0v26-26zm1.4996 0v26-26zm1.5002 0v26-26zm1.5002 0v26-26zm1.4996 0v26-26zm1.5002 0v26-26zm1.5002 0v26-26zm1.4996 0v26-26zm1.5002 0v26-26zm1.5002 0v26-26zm1.4996 0v26-26zm1.5002 0v26-26zm1.5002 0v26-26zm1.4996 0v26-26zm1.5002 0v26-26zm1.5002 0v26-26zm1.4996 0v26-26zm1.5002 0v26-26zm32.504 0v26-26zm1.4996 0v26-26zm1.5002 0v26-26zm1.5002 0v26-26zm1.4996 0v26-26zm1.5002 0v26-26zm1.5002 0v26-26zm1.4996 0v26-26zm1.5002 0v26-26zm1.5002 0v26-26zm1.4996 0v26-26zm1.5002 0v26-26zm1.5002 0v26-26zm1.4996 0v26-26zm1.5002 0v26-26zm1.5002 0v26-26zm1.4996 0v26-26zm1.5002 0v26-26zm1.5002 0v26-26zm1.4996 0v26-26zm1.5002 0v26-26zm-63.254 16v13-13zm62.504 0v13-13zm-91.004 0.022737v13-13zm1.5002 0v13-13zm1.4996 0v13-13zm1.5002 0v13-13zm1.5002 0v13-13zm1.4996 0v13-13zm1.5002 0v13-13zm1.5002 0v13-13zm1.4996 0v13-13zm1.5002 0v13-13zm1.5002 0v13-13zm1.4996 0v13-13zm1.5002 0v13-13zm1.5002 0v13-13zm1.4996 0v13-13zm1.5002 0v13-13zm1.5002 0v13-13zm1.4996 0v13-13zm1.5002 0v13-13zm35.504 0v13-13zm1.5002 0v13-13zm1.4996 0v13-13zm1.5002 0v13-13zm1.5002 0v13-13zm1.4996 0v13-13zm1.5002 0v13-13zm1.5002 0v13-13zm1.4996 0v13-13zm1.5002 0v13-13zm1.5002 0v13-13zm1.4996 0v13-13zm1.5002 0v13-13zm1.5002 0v13-13zm1.4996 0v13-13zm1.5002 0v13-13zm1.5002 0v13-13zm1.4996 0v13-13zm1.5002 0v13-13z" fill="none" stroke="#000" stroke-width="0.2" style="paint-order:stroke fill markers"/></g>
</svg>
<span>*Huzzah! Very much non-parametric, but works for me for now.*</span>
</p>

With the difficult part out of the way (so I thought at least), I started
working on the other shapes in the design. The crucial parts of these were the
clasps in the body that "snap" together at the back when the body is wrapped,
and also the slots in the body for the piece that actually holds up the iPod.
Finally, there was the bottom ring that holds the body together. Actually making
these was quite quick work. 

<picture id="istand.glb">
    <source srcset="/media/istand-small.webp 480w"
    media="(max-width: 480px)" />
    <img src="/media/istand.webp" loading="lazy" alt="Models of the different
    parts that the iPod stand will be composed of." />
</picture>

Then came the actual difficult part: adjusting for kerf. My design had so many
features where I had to either add the amount of kerf to the dimensions or
remove it, often within the same part. I redid the adjustments at least three or
four times before getting them right (hopefully). At least it was a good
exercise in building the intuition for how kerf affects the design in different
cases. I had booked a time for laser cutting at the fablab and I was *still*
adjusting the dimensions at the lab up until it was my go with the laser.

### Laser cutting practice

Setting up for cutting took more time than I expected. We picked out a piece of
test cardboard that was 3.6mm thick and my `Params.MaterialThickness` was 3.0mm
at the time. Adjusting that somewhy started throwing a bunch of errors even
though the geometry of the model itself seemed to be totally fine. As it seemed
fine, we just carried on with the cutting.

<picture>
    <source srcset="/media/screenshot1-small.webp 480w"
    media="(max-width: 480px)" />
    <img src="/media/screenshot1.webp" loading="lazy" alt="A screenshot of the
    Epilog laser cutter driver software showing a cutting job that is ready to
    go." />
</picture>
<span>*Ready to cut.*</span>

<picture>
    <source srcset="/media/cardboard-small.webp 480w"
    media="(max-width: 480px)" />
    <img src="/media/cardboard.webp" loading="lazy" alt="A sheet of cardboard
    inside a laser cutter. Pieces corresponding to the previous design have been
    popped out of the sheet." />
</picture>
<span>*The result with 3.6mm cardboard.*</span>

There was still a bit of time left and I wanted to try out cutting the lattice
hinges. That was the thing I was most unsure about in the design so getting some
tactile feedback on that was key. As the lattice design was a separate SVG, I had
to combine that first with the shape of the main body.

<p>
<svg version="1.2" viewBox="0 0 134.76 32.3" xmlns="http://www.w3.org/2000/svg" >
<path d="m21.782 5.3994e-5v13.103zm1.5034 0v13.103zm1.5028 0v13.103zm1.5033 0v13.103zm1.5033 0v13.103zm1.5028 0v13.103zm1.5034 0v13.103zm1.5033 0v13.103zm1.5028 0v13.103zm1.5034 0v13.103zm1.5034 0v13.103zm1.5028 0v13.103zm1.5033 0v13.103zm1.5034 0v13.103zm1.5028 0v13.103zm1.5033 0v13.103zm1.5034 0v13.103zm1.5028 0v13.103zm1.5033 0v13.103zm1.5034 0v13.103zm34.076 0v13.103zm1.5034 0v13.103zm1.5028 0v13.103zm1.5034 0v13.103zm1.5033 0v13.103zm1.5028 0v13.103zm1.5034 0v13.103zm1.5034 0v13.103zm1.5028 0v13.103zm1.5033 0v13.103zm1.5034 0v13.103zm1.5028 0v13.103zm1.5034 0v13.103zm1.5034 0v13.103zm1.5028 0v13.103zm1.5034 0v13.103zm1.5034 0v13.103zm1.5028 0v13.103zm1.5033 0v13.103zm1.5034 0.022921v13.103zm-91.948 3.0236v26.206zm1.5028 0v26.206zm1.5033 0v26.206zm1.5034 0v26.206zm1.5028 0v26.206zm1.5033 0v26.206zm1.5034 0v26.206zm1.5028 0v26.206zm1.5034 0v26.206zm1.5034 0v26.206zm1.5028 0v26.206zm1.5034 0v26.206zm1.5034 0v26.206zm1.5028 0v26.206zm1.5033 0v26.206zm1.5034 0v26.206zm1.5028 0v26.206zm1.5033 0v26.206zm1.5034 0v26.206zm1.5028 0v26.206zm1.5033 0v26.206zm32.573 0v26.206zm1.5028 0v26.206zm1.5033 0v26.206zm1.5034 0v26.206zm1.5028 0v26.206zm1.5034 0v26.206zm1.5034 0v26.206zm1.5028 0v26.206zm1.5034 0v26.206zm1.5034 0v26.206zm1.5028 0v26.206zm1.5034 0v26.206zm1.5034 0v26.206zm1.5028 0v26.206zm1.5034 0v26.206zm1.5034 0v26.206zm1.5028 0v26.206zm1.5033 0v26.206zm1.5034 0v26.206zm1.5028 0v26.206zm1.5034 0v26.206zm-63.388 16.127v13.103zm62.636 0v13.103zm-91.197 0.02292v13.103zm1.5034 0v13.103zm1.5028 0v13.103zm1.5033 0v13.103zm1.5033 0v13.103zm1.5028 0v13.103zm1.5034 0v13.103zm1.5033 0v13.103zm1.5028 0v13.103zm1.5034 0v13.103zm1.5034 0v13.103zm1.5028 0v13.103zm1.5033 0v13.103zm1.5034 0v13.103zm1.5028 0v13.103zm1.5033 0v13.103zm1.5034 0v13.103zm1.5028 0v13.103zm1.5033 0v13.103zm35.579 0v13.103zm1.5034 0v13.103zm1.5028 0v13.103zm1.5034 0v13.103zm1.5033 0v13.103zm1.5028 0v13.103zm1.5034 0v13.103zm1.5034 0v13.103zm1.5028 0v13.103zm1.5033 0v13.103zm1.5034 0v13.103zm1.5028 0v13.103zm1.5034 0v13.103zm1.5034 0v13.103zm1.5028 0v13.103zm1.5034 0v13.103zm1.5034 0v13.103zm1.5028 0v13.103zm1.5033 0v13.103zm4.1956-16.247h2.806v2.8h-2.806zm-34.361 0v2.8h-2.806v-2.8zm-27.859 2.8h2.806v-2.8h-2.806zm-34.361 0v-2.8h-2.806v2.8zm115.62-5.7v27.1h-5.1108v-22h-5.1108v27.1h-55.105v-2.5c0-0.8284-0.673-1.5-1.5032-1.5h-1.0021c-0.83019 0-1.5032 0.6716-1.5032 1.5v2.5h-65.327v-27.1h5.1108v22h5.1108v-27.1z" fill="none" stroke-width=".2" style="paint-order:stroke fill markers"/>
</svg>
<span>*So many lines. 📈*</span>
</p>

While cutting, I was near-certain that the laser had just burnt up the segments.

<p>
  <video autoplay loop muted src="/media/cut1.webm" poster="/media/cut1.webp" type="video/webm"></video>
</p>

<p>
  <video autoplay loop muted src="/media/cut2.webm" poster="/media/cut2.webp" type="video/webm"></video>
  <span>*Almost there.*</span>
</p>

Yet, the cut was actually perfect. The result was quite a bit jigglier than I
thought though.

<picture>
    <source srcset="/media/body-small.webp 480w"
    media="(max-width: 480px)" />
    <img src="/media/body.webp" loading="lazy" alt="The main body of the iPod
    stand cut out from 2mm plywood. The lattice hinges are black with char as
    they're so thin." />
</picture>

<p>
  <video autoplay loop muted src="/media/jiggly.webm" poster="/media/jiggly.webp" type="video/webm"></video>
  <span>*Gettin jiggy wit it 🪱*</span>
</p>

I didn't have time to cut out the top and the lock ring this time, but it was a
successful cutting session nonetheless.

<b>Edit - 2025-02-21</b>

I went to [KUBU](https://kubu.fi/) (ran by my parents 💅) and used the 
[XTool P2](https://www.xtool.com/products/xtool-p2-55w-co2-laser-cutter)
there to cut the rest of the parts. The top I managed just fine, but with the
lock ring, I realized I'd made a foolish blunder. 

<picture>
    <source srcset="/media/lock-ring-blunder-small.webp 480w"
    media="(max-width: 480px)" />
    <img src="/media/lock-ring-blunder.webp" loading="lazy" alt="The iPod stand
    finalized, except that the lock ring is quite a bit too big." />
</picture>
<span>*The lock ring on the bottom is far too big.*</span>


When I modeled the lock ring, I assumed that I'd need to account for the padding
of the ring in the width itself, but geometry doesn't work like that.

<picture>
    <source srcset="/media/blunder-drawing-small.webp 480w"
    media="(max-width: 480px)" />
    <img src="/media/blunder-drawing.webp" loading="lazy" alt="A drawing
    explaining how I made a mistake with the lock ring geometry." />
</picture>
<span>*Here's a better way of explaining that.*</span>

After modifying the model and running the cut again, the piece came out just
right. 

<picture>
    <source srcset="/media/istand-final-small.webp 480w"
    media="(max-width: 480px)" />
    <img src="/media/istand-final.webp" loading="lazy" alt="The iPod stand actually finalized" />
</picture>

It's not a very good or a very pretty stand, but at least I've learned
something about laser cutting through it 😅.
