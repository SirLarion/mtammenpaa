<script>
    GEOMETRY_FILES = ["/media/rolling-joint.glb"];
    INITIAL_ANGLE = 25;
</script>
<script type="module" src="/three.js" defer></script>

<picture>
    <source srcset="/media/rolling-joint-print-ready-small.webp 480w"
    media="(max-width: 480px) and (max-resolution: 1.4dppx)" />
    <img src="/media/rolling-joint-print-ready.webp" fetchpriority="high" alt="A
    simple spherical rolling joint freshly 3D-printed on the bed of a Prusa Mini." />
</picture>
<span>*A little sneak peek of what's to come 👀*</span>

## Digital Fabrication, week 6

Our topic this week was 3D-printing. I've been getting more familiarized with it
for the past few months, but I still consider myself very much a beginner. This
means it's worthwhile to go get down to the basic definitions. 

### Additive manufacturing

The concept of additive manufacturing is perhaps easiest described with its
reverse: subtractive manufacturing. Where subtractive manufacturing is used to
make objects by chipping away pieces of the source material (such as chiseling
stone to create a statue), additive manufacturing starts with nothing and adds
material during the process. 

In practice, additive manufacturing is synonymous with 3D-printing. This is
understandable as 3D-printing is, in some ways, what's at the core of additive
manufacturing; in the beginning there's nothing, and layer by layer new material
is added to create some intended outcome.

### Ways of 3D-printing

The dominant way to do 3D-printing is fused filament fabrication (FFF), which is
perhaps more commonly known as fused deposition modeling (FDM, but that's
trademarked, don't tell anyone I said it 🤫). This is where a filament (thin
tube of material) is melted in a nozzle that extrudes it onto an empty plate or
the previous layer of material where it adheres. This is quite easy to do (you
can do it by hand with a pen-like tool), which is why it's so popular. At the
same time, surprisingly sturdy and high-fidelity objects can be created with
this method.

Another well-known 3D-printing method is stereolithography (SLA). This is where
a photoreactive resin contained inside a vat is polymerized by using a light
source, usually an ultraviolet laser. It's often regarded as a more precise way
of creating objects than FFF as the fidelity of the result depends on the width
of the laser, which can be very *very* small (compared to the nozzle of an FFF
printer, which is only very small). However, this is losing its validity over
time with the rapid improvement of FFF machines. Digital light processing (DLP)
is another way of doing SLA, where a kind of image is projected onto a layer of
resin instead of using a laser. This way the whole layer can be built at once.

Sheet lamination is another way to 3D-print. It can be practically thought of as
3-dimensional vinyl cutting. Sheets of material are consequtively added, cut
into the correct shape for the layer, and glued to the next sheet. In fact, in
some ways, this is a bit of a mix of subtractive and additive manufacturing as
you remove quite a bit of the material that's used. 

### Spherical rolling joint

Now, getting down to practice. I've wanted to make a simple 
[spherical rolling joint](https://en.wikipedia.org/wiki/Ball_joint#Spherical_rolling_joint) 
for some time now, just to be able to mount things in a way where they can be 
moved and rotated easily.

<picture>
    <source srcset="/media/srj-small.webp 480w"
    media="(max-width: 480px) and (max-resolution: 1.4dppx)" />
    <img src="/media/srj.webp" loading="lazy" alt="A metallic spherical rolling
    joint with precisely machined parts and an array of bearings enabling the
    joint to move fluidly." />
</picture>
<span>*A "real" spherical rolling joint for reference. Source: 
<a href="https://mirai-automation.com/wp-content/uploads/2023/10/Untitled-1.png" target="_blank" rel="noreferrer">Mirai Automation</a>*</span>

In addition to the joint and housing seen in the picture above, I want to have a
screw that can be adjusted to lock the joint in place via friction.

One approach is to make the housing with a gap on one side such that it can be
flexed. This way the actual joint would be inserted in the housing after
printing. However, with 3D-printing, a more interesting approach is to print the
joint directly inside the housing. With a ball, the surface area of the contact
between the two objects after printing should be so small that the ball can just
be lightly snapped off the housing.

During modeling, I got well acquainted with the boolean tool in the Part Design
workshop in FreeCAD. This was because I had to carve out the sphere shape inside
the joint housing. Modeling the rest of the housing and the joint was quite a
walk in the park.

For the screw, I used the Fasteners workbench. I'd twiddled with it a little bit
before but I hadn't actually made anything, so this was quite the learning
experience. It turned out to be really easy and intuitive to use though so, in
the end, I had the fastener screw ready quite quickly. The biggest learning
though was probably concerning the "Hole" tool in Part Design. I'd never
really understood how it differs from pocketing. However, as I was scratching my
head and struggling to find a good way of creating the screw hole (I was ready
to do a boolean operation with the screw I'd made and the housing), I found out that
with Hole, you can just specify that it's a screw hole with a certain standard
size. I just had to turn on modeling the actual threads as I will be printing
them. Due to this I had to make sure that everything else was tip-top beforehand
because modeling the threads turns my computer into a PCB-aluminium alloy.

<picture id="rolling-joint.glb">
    <source srcset="/media/rolling-joint-small.webp 480w"
    media="(max-width: 480px) and (max-resolution: 1.4dppx)" />
    <img src="/media/rolling-joint.webp" loading="lazy" alt="A 3D-model of a
    simple rolling joint with a cube housing. The cube has a screw hole on one
    side with a screw sitting next to it." />
</picture>
<span>*Quite happy with the result. Of course this is worthless by itself, but
with the knowledge I have from making a joint like this, I can utilize it in a
lot more interesting ways later.*</span>

Over on the PrusaSlicer side, I had the Prusa Mini printer selected and imported
the STEP file. At the Fablab, there are also several Prusa MK4s and some Ultimaker
S3s, but I wanted to try out the Mini as I haven't used it before. I switched
the infill density to 20% as we'd learned during the previous lecture that
around 20% is the optimal in terms of structural strength relative to the mass of
the material. I also turned on the brim for the bottom layer as I got a warning
message complaining about low bed adhesion without it. 

<p>
<video autoplay loop muted preload="none" poster="/media/sliced-poster.webp" alt="The rolling joint opened and sliced in the PrusaSlicer software" preload="none">
  <source src="/media/sliced.webm" />
</video>
<span>*How it'll happen in theory. Let's see if reality is anywhere close.*</span>
</p>

There was some slight overhang on the upper edge of the housing where the
opening for the joint starts up (small blue bit in the video). However, it was minor
enough that I decided not too care about it too much. Time to get printing.

|                     |                                                                                                                                                                           |                                                                                                                                                                           |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                     | <video autoplay loop muted preload="none" poster="/media/print-process-1-poster.webp" src="/media/print-process-1.webm" alt="Printing the rolling joint, part 1"></video> | <video autoplay loop muted preload="none" poster="/media/print-process-2-poster.webp" src="/media/print-process-2.webm" alt="Printing the rolling joint, part 2"></video> |
|                     | <video autoplay loop muted preload="none" poster="/media/print-process-3-poster.webp" src="/media/print-process-3.webm" alt="Printing the rolling joint, part 3"></video> | <video autoplay loop muted preload="none" poster="/media/print-process-4-poster.webp" src="/media/print-process-4.webm" alt="Printing the rolling joint, part 4"></video> |

There are some small printing artifacts here and there, but mainly I was
interested in how the joint moves. After removing the brim, I started applying
violence on the joint to break it loose. More of it was required than I'd
hoped for, but eventually I got the joint moving. It still gets snagged on the
bottom on where the joint was attached, but it's not too critical.

<p>
<video autoplay loop muted preload="none" poster="/media/rolling-joint-test-poster.webp" alt="The final rolling joint being moved around. It stops abruptly in place every now and then." preload="none">
  <source src="/media/rolling-joint-test.webm" />
</video>
<span>*Little choppy, but it moves, I guess!*</span>
</p>

The fastener itself printed fine, but the screw hole turned out poorly. A seam
was created through the middle of the hole and the fastener doesn't fit properly
inside. I'll try to break it in with a steel M6 bolt, but my hopes aren't high.
Some future improvements could be to manually set the location of the seam and
maybe to print the housing sideways (although this could lead to problems with
the joint itself).

The project is split into two different FreeCAD files as I modeled the fastener
separately to limit the computational requirements of the project. Both files
can be downloaded here: <a href="/media/rolling-joint.zip"
download="rolling-joint.zip">ZIP</a>

That's that for printing! Next week (this week as I'm writing this actually 😅)
we'll get deep into electronics with designing electronics schematics and PCBs.
Very scary, but very cool . 
