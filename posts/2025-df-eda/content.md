<picture>
    <source srcset="/media/xiao-funky-pcb-filled-dark.webp 1x" media="(prefers-color-scheme: dark)">
    <source srcset="/media/xiao-funky-pcb-filled-light-small.webp 480w" media="(max-width: 480px) and (max-resolution: 1dppx)">
    <source srcset="/media/xiao-funky-pcb-filled-dark-small.webp 480w" media="(prefers-color-scheme: dark) and (max-width: 480px) and (max-resolution: 1dppx)">
    <img src="/media/xiao-funky-pcb-filled-light.webp" loading="lazy" alt="KiCad PCB designer showing a design where all the parts are connected and the ground plate has been filled in.">
</picture>
<span>*That's a very strange looking piece of steak.*</span>

## Digital Fabrication, week 7

We have arrived at the deep end: this week we're starting to design PCBs. I got
a bit of a slow start into it as I was sick for the first half of the week.
However, now I've got my KiCad open, and I'm ready to start drawing some lines!
First, let's go over some component basics though.

### Electronics components

Fortunately, for the purposes of this minor, we only need to understand the
operations of quite a limited set of components. Essentially, electronics
components either limit the flow of current or point it to go in a certain
direction. Then there are some fun side effects such as creating heat
(resistors) or light (LEDs). 

Resistors are perhaps the simplest type of component as they just throttle how
much current can go through the circuit relative to voltage (`U = RI`, this is
the R). It's also worthwhile to note that any circuit always has some resistance
even without resistors because no material has perfect conductivity (**except
superconductors!**). Likewise, all electronics *components* also have some
inherent resistance, leading to a "voltage drop", where some of the circuit's
voltage is sunk into the component. The voltage drop in LEDs, for example, goes
(not quite perfectly, of course) into emitting the photons that we see when
they're powered.

Switches aren't exactly thought of as resistors commonly, but that's basically
how they function. When a switch is open, there's an air gap (or other material
if sealed somehow) between two points of the circuit. The required voltage to
break through this gap is (usually) radically large because air is not
conductive. When the switch is closed, the air gap is removed and the conductive
points of the circuit meet, letting current flow through. Still, all switches
have some breakthrough voltage, beyond which current will pass through
regardless of whether the switch is closed or not. Usually, this leads to a
fried circuit.

Thinking about switches in this way is helpful for understanding how transistors
work. Transistors are a kind of switch that is opened or closed by an electric
current in one of its ports. Any kind of switch can be used to create logic
circuits (is one voltage high AND is another voltage high?) and eventually,
complex computation. Transistors can do this without any human intervention
though. Historically, this led to the explosive increase in computation both for
consumers and industries as transistors became smaller and were packed more
densely inside microchips. Transistors are quite delicate devices, however, as
the breakthrough voltages inside them are not very large. This is fine in
regular use, but, for example, a lightning strike will very easily break any
digital electronics that are plugged into mains power.

### KiCad

How do we actually design electronics circuits then? KiCad is the open source
answer to this. It's a powerful piece of software used both by hobbyists and
industry workers for EDA (electronics design automation). I use Arch (by the
way), so I installed KiCad via pacman with `sudo pacman -S kicad`. As it's such
ubiquitous software, I figured running it would be a walk in the park. I had
quite a bit more (self-inflicted) trouble with it though, as I'm using the
[Wayland](https://wayland.freedesktop.org/) display server architechture rather
than the legacy — but very stable — [X11 display server](https://www.x.org/wiki/). 
KiCad does not have full support for Wayland yet, which is understandable as
Wayland is *only 16 years old* — so, indeed a very new development in the Linux
community.

I did eventually get it working though (my problem was actually an incorrectly
defined GTK theme). Next up, I needed to set up the 
[Fab KiCad component library](https://gitlab.fabcloud.org/pub/libraries/electronics/kicad). 
This was quite easily done, I simply cloned the repository and followed the
"Installation" guide in the `README` file. The component library is super
convenient to have as it contains everything that's available at the Fablab. I
can create my schematic and PCB model with reference to different components and
be sure that those correspond to real, physical components at the Fablab.

|  |  |  |
|--|--|--|
|  | <picture><source srcset="/media/kicad-symbol-library-dark.webp 1x" media="(prefers-color-scheme: dark)"><img src="/media/kicad-symbol-library-light.webp" alt="The KiCad preferences interface for managing symbol libraries." /></picture><span>*Preferences -> Manage symbol libraries*</span> | <picture><source srcset="/media/kicad-footprint-library-dark.webp 1x" media="(prefers-color-scheme: dark)"><img src="/media/kicad-footprint-library-light.webp" alt="The KiCad preferences interface for managing footprint libraries." /></picture><span>*Preferences -> Manage footprint libraries*</span> |

<picture>
    <source srcset="/media/kicad-3d-view-test-small.webp 480w"
    media="(max-width: 480px) and (max-resolution: 1dppx)" />
    <img src="/media/kicad-3d-view-test.webp" loading="lazy" alt="The
    KiCad PCB editor's 3D view showcasing the model of a XIAO attached to a PCB" />
</picture>
<span>*An entirely non-functional board but now there's a cool 3D-model!*</span>


### Test design 

What I'd really be interested to design on the slightly longer term is a board
taking use of a "simpler" microcontroller than the RP2040 that we're using, such
as the ATTiny412. However, due to my illness I was also catching up on last
week's work this week. On top of that, I had to get to know KiCad somewhat, so I
decided to go for a simple schematic design.

<picture>
    <source srcset="/media/xiao-schematic-dark.webp 1x" media="(prefers-color-scheme: dark)">
    <source srcset="/media/xiao-schematic-light-small.webp 480w" media="(max-width: 480px) and (max-resolution: 1dppx)">
    <source srcset="/media/xiao-schematic-dark-small.webp 480w" media="(prefers-color-scheme: dark) and (max-width: 480px) and (max-resolution: 1dppx)">
    <img src="/media/xiao-schematic-light.webp" loading="lazy">
</picture>
<span>*Schematic of the XIAO board broken out to other, labeled parts.*</span>

<picture>
    <source srcset="/media/xiao-schematic-labeled-1-dark.webp 1x" media="(prefers-color-scheme: dark)">
    <source srcset="/media/xiao-schematic-labeled-1-light-small.webp 480w" media="(max-width: 480px) and (max-resolution: 1dppx)">
    <source srcset="/media/xiao-schematic-labeled-1-dark-small.webp 480w" media="(prefers-color-scheme: dark) and (max-width: 480px) and (max-resolution: 1dppx)">
    <img src="/media/xiao-schematic-labeled-1-light.webp" loading="lazy"
    alt="The first set of the other, labeled parts of the schematic.">
</picture>

<picture>
    <source srcset="/media/xiao-schematic-labeled-2-dark.webp 1x" media="(prefers-color-scheme: dark)">
    <source srcset="/media/xiao-schematic-labeled-2-light-small.webp 480w" media="(max-width: 480px) and (max-resolution: 1dppx)">
    <source srcset="/media/xiao-schematic-labeled-2-dark-small.webp 480w" media="(prefers-color-scheme: dark) and (max-width: 480px) and (max-resolution: 1dppx)">
    <img src="/media/xiao-schematic-labeled-2-light.webp" loading="lazy" alt="The second set of the other, labeled parts of the schematic.">
</picture>

I broke out the SCL & SDA pins to create an I<sup>2</sup>C connector. Then I did the
same for the MOSI (PICO), MISO (POCI), SCK and CSn pins to create an SPI
connector. Other than those, I added an LED driven by one of the digital pins
with a 100Ω resistor and a switch that's pulled up to 3V3 with a 10k resistor.
Finally, I broke out the remaining digital pins (D0-D2) to be accessed via
female headers.

After putting together the schematic, I jumped over to the PCB editor. Now I
needed to lay out all of the footprints of the parts that I'd added in the
schematic in such a way that their connections can be made as simple and
efficient as possible. 

This was quite an interesting exercise. In theory, you'd want to have everything
as close together as possible since the longer the connections are, the more
resistance they have and the more they'll catch interference from the
environment. At the same time you're restricted by the geometry of the parts
you're using. For example, for conncting the JST PH 4-pin connector for
I<sup>2</sup>C to the XIAO, the SCL and SDA pins of the are on one side, but the
3V3 pin is one the other side. This means that some of the connections will have
to go across the board in a "non-optimal" way.

Similarly, when parts are close together, there are many cases where the optimal
route for their connections would go on top of each other. That's not possible
though (on one layer at least), so some connections will need to take the longer
route. Due to this, I had to move the I<sup>2</sup>C connector a little further
from the XIAO than I originally planned as otherwise the 3V3 connection would
have had to go all the way around the connector. Essentially, the whole process
is just balancing these aspects in ways that compromise on the factors that have
the most room for error. The connections that just carry power can be quite long
even so that's one place to compromise on. However, a connection carrying a high
bitrate signal will need to be as short as possible to mitigate interference.

Accommodating for the differing needs of connections can be done in KiCad via
net classes: groupings of "nets", or, basically connections. A net class can be,
for example, all the connections for an I<sup>2</sup>C connection, or — like I
have here — all the different power connections. These groupings are done
either by selecting all the labels of the connections, or by globbing. For
example `PWR*`, matches all the power connections here as their identifiers
all start with `PWR`. Then, the net class can be used to define a certain
width and clearance for all of the physical connections in that net class.

|  |  |  |
|--|--|--|
|  | <picture><source srcset="/media/xiao-pcb-net-classes-dark.webp 1x" media="(prefers-color-scheme: dark)"><img src="/media/xiao-pcb-net-classes-light.webp" alt="The KiCad net class settings interface showing a 'Power' net class and a 'Default' net class." /></picture> | <picture><source srcset="/media/xiao-net-class-width-dark.webp 1x" media="(prefers-color-scheme: dark)"><img src="/media/xiao-net-class-width-light.webp" alt="The actual effect of using net classes shown in the KiCad PCB editor." /></picture> |
<span>*Net class definitions on the left. On the right, the 3V3 connection is
visibly wider than the others.*</span>

As with any vector graphics editing software, KiCad has many different layers on
which you can work. However, with KiCad, their semantics are predefined. As
such, the most important layer in the PCB editor is `F.Cu` (front copper). This
is where all of the connections are defined (assuming you're working on a single
layer as we are). There are many other layers, for example, for defining
locations for adhesive or solder paste. For us, the important ones in addition
to `F.Cu` are `F.Silkscreen`(for all the markings, `D1`, `R1`, etc.) and
`Edge.Cuts`. The edge cuts layer is where the shape of the PCB is defined. You
can make simple rectangles, but also use e.g. bezier curves to create all kinds
of shapes.

<picture>
    <source srcset="/media/xiao-funky-pcb-filled-dark.webp 1x" media="(prefers-color-scheme: dark)">
    <source srcset="/media/xiao-funky-pcb-filled-light-small.webp 480w" media="(max-width: 480px) and (max-resolution: 1dppx)">
    <source srcset="/media/xiao-funky-pcb-filled-dark-small.webp 480w" media="(prefers-color-scheme: dark) and (max-width: 480px) and (max-resolution: 1dppx)">
    <img src="/media/xiao-funky-pcb-filled-light.webp" loading="lazy" alt="KiCad PCB designer showing a design where all the parts are connected and the ground plate has been filled in.">
</picture>
<span>*I made the PCB a funky shape for the lols.*</span>

Another very concrete realisation I had was actually already during the lecture
on EDA. I was waiting for the part where everything is connected to ground. How
you do this though is that you just make the whole PCB the ground. It's stupid
simple, but never before did it click for me that the ground is just kind of the
reverse of all the other connections. In KiCad, you do this by selecting the
"Draw filled zones" tool, going all the way around your PCB, and then clicking 
"Edit -> Fill all zones" (or just pressing B).

Finally, I had to run the design rules checker (DRC). This is important as it
confirms that all the connections are valid and that there aren't any short
circuits, for example. For my DRC, well, I'll let the GIF speak for itself.

<p>
<video autoplay loop muted alt="The design rules checker in KiCad showing a
passing check.">
  <source src="/media/xiao-pcb-drc-dark.webm" media="(prefers-color-scheme: dark)" />
  <source src="/media/xiao-pcb-drc-light.webm" />
</video>
<span>*CSI_miami_shades_yaooo.gif*</span>
</p>

Very nice. I actually wasn't quite sure I'd get to this point in any reasonable
time, but here we are 🤔. Of course, creating this strange-looking piece of
steak is very far from anything useful, but now I know my way around the
software at least.

I'll have to hold off on actually milling this bad boy (or preferably some other
board that's actually meaningful in any way) for a moment as next week we'll be
looking at CNC machining in general to get the basic process down. After *that*
we'll get to milling PCBs.

That's it for now though! I'll need to get back into my FreeCAD pants now to
prep something for the CNC.
