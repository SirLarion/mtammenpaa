<picture>
    <source srcset="/media/xiao-small.webp 480w"
    media="(max-width: 480px) and (max-resolution: 1dppx)" />
    <img src="/media/xiao.webp" fetchpriority="high" alt="A seeed XIAO breakout
    board with the RP2040 microcontroller. It's attached to a small, white
    breadboard with headers ready to be soldered." />
</picture>
<span>*Lil' fella looking all excited to get its new headers.*</span>

## Digital Fabrication, week 5

Embedded programming is quite a recent discovery for me. I really only started
doing it a bit over a year ago in the Aalto University "Electrical engineering
workshop" course (Sähköpaja). For me as a programmer, the "programming" part of
it did feel more like "copy-paste this piece of code from SparkFun", but, to be
fair, that's expected, as it was a course geared towards first-year electrical
engineering students. In the Digital Fabrication minor, I'm getting the feeling
that I'll get to go quite a bit beyond copy-paste. But for now, we're going with
the basics.

### Microcontrollers

At the heart of everything embedded, there is the icrocontroller unit or MCU.
It's a small circuit for processing logic (similar in nature to the **C**entral
**P**rocessing **U**nit in regular computers). When you create your `blink.ino`
code and upload it to Arduino Uno, what really happens is that the compiled
machine code goes through the serial port of the Uno and a separate "programmer"
(not the human kind) circuit flashes the code into flash memory, from which the
the microcontroller can load the code when it's circuit is on. This way the
programmer (human kind) can be assured that the machine code will be loaded in
the correct places inside the MCU and it won't be bricked when they turn it on.

Once the MCU is turned on though, a big (or actually very small, but dense) pile
of transistors organized into specific logic circuits such as registers,
addition circuits and multiplication circuits gets activated in ways that
correspond to the machine code that has been uploaded into it. The activation
causes the circuits to output voltages that can then be sent to specific pins
to, for example, turn on and off a connected LED.

### Electronics

My definite weak point in embedded programming is the underlying physics of the
electronics itself. I went through physics in upper secondary school very
literally "by the book", got very good grades and then immediately forgot
everything afterwards. Fortunately, with good rules of thumb, one can remember
things for a surprisingly long time. I still remember the PUImURI rule, where
"puimuri" is finnish for a combine harvester and `P = UI` and `U = RI` are
perhaps the most important rules of electronics. 

P is the measure of power in watts, U (also denoted with V) is voltage in volts,
I is currect in amperes and R is resistance in ohms. These two rules encompass
the relationships between these measures. For example, if I have a circuit with
`R = 220Ω`, `I = 500mA = 0.5A`, I know that it's voltage drop is `U = 220Ω *
0.5A = 110V`. Similarly, if I have a device connected to a 3.7V battery, and I
know it's running at 1W of power I can calculate the current going through it with
`P = UI => I = P/U = 1W/3.7V ≈ 270mA`.

### Programming

Probably the most common way among hobbyists to program microcontrollers is via the
Arduino IDE and the C++ preprocessor that's colloquially known as the Arduino
language. The differences to simply using the actual C++ language are very
small, but quite essential. Before the underlying C++ is compiled into machine
code, the Arduino preprocessor injects a few of it's own definitions into the
code. The core of these is the `Arduino.h` header that defines, for example, the 
core Arduino functions such as `pinMode`, `analog/digitalRead`,
`analog/digitalWrite` among others. In this way, the Arduino preprocessor is
very analogous to, for example, a `Makefile` or a `CMakeList`. 

Perhaps more usefully, though, `Arduino.h` also contains macro definitions (e.g.
`#define SOME_MACRO`) that are specific to the MCU that you are programming. How
can it do this if it's just a header? That's where the concept of the Arduino
"core" comes in. Cores are pre-defined sets of data specific to some MCU. These
are downloaded via the Arduino IDE (or `arduino-cli` as I prefer) when you're
setting up your project. Among other things, the core contains the `Arduino.h`
header for that MCU. The mechanism of creating macros via `#define` is nothing
unique to Arduino, though. It's just how C++ allows creating static values that
are set prior to compilation. With this system, manufacturers of MCUs (or their
most avid fans) can create a set of static definitions that allow the end-user
of the Arduino to easily program the MCU without needing to know the specifics.

The underlying language is just core C++ with the same control flow (functions,
loops, if-else statements) and data types. Notably though, it is quite uncommon
(though possible) to include any parts of the C++ standard library when
creating Arduino code. This is due to the memory limitations of the MCUs being
programmed. More advanced functionality is instead created via the Arduino
functions and Arduino libraries.

### Libraries

Arduino libraries are just C++ libraries, and you will not find any `.ino` files
in their source code. However, they also take use of the core Arduino libraries.
One of these is the `Arduino` library, but there are also others such as
`Serial`, `Wire` and `SPI`. All these have their own definitions for each core,
and when external libraries refer to these, it's possible to create very
advanced functionality that can be used with many different MCUs.

There are libraries for creating HTTP servers, running displays and
reading sensor output just to name a few. A key library for our
assignment is `Adafruit_NeoPixel`. It contains the definitions and functions to
operate a [NeoPixel](https://learn.adafruit.com/adafruit-neopixel-uberguide),
an RGB LED made by the Adafruit company. In the course, we have been given [seeed
studio XIAO RP2040](https://wiki.seeedstudio.com/XIAO-RP2040/) breakout boards
to play around and learn with. This board has a builtin NeoPixel and we should
make some code to do things with it.

### Coding

As I mentioned, I prefer the workflow of using
[arduino-cli](https://arduino.github.io/arduino-cli/1.1/) along with my own
editor (NeoVim, by the way 🤓) as opposed to Arduino IDE. `arduino-cli` has all
the same functionality as the IDE, but the documentation for it online is a
little bit lacking, so when I was learning to use it, I had to figure out quite
a bit on my own. Here's a list of some useful things I've learned:

```bash
# Sketches should have the following structure
# └── sketchName
#     ├── sketch.yaml    <-- info on which board is selected & which  
#     │                      serial port is the board connected to
#     └── sketchName.ino <-- code, notice the name is the same as the folder's

# Run all commands from inside <sketchName>, the sketch "root"

# The "play" button of the Arduino IDE
arduino-cli compile --upload

# Same as doing this 
arduino-cli compile && arduino-cli upload

# Looking for cores 
arduino-cli core search <keyword>

# Installing cores 
arduino-cli core install <keyword>

# Installing libraries 
arduino-cli lib install <name>

# List all the boards that are defined within installed cores
arduino-cli board listall

# "Attaching" a sketch to a board specified by it's FQBN 
# (fully qualified board name), this simply creates the 
# sketch.yaml file
arduino-cli board attach <board>
```

I'd already installed the core for RP2040 as I have a Raspberry Pi Pico 2B dev
board at home that I'd played around with previously. I already had the
`Adafruit_NeoPixel` library too as I'd done some fiddling with that as well. This is
how you would've installed them with `arduino-cli` though, just for an example.

```bash
# Install rp2040 core
arduino-cli core install rp2040

# Install Adafruit_NeoPixel library
arduino-cli lib install Adafruit_NeoPixel
```

I'd already made a blink test with an ESP32-based board for the NeoPixel so I
just adapted that to the RP2040. All I really had to change was the macro for
which pin is the one for the NeoPixel on the seeed XIAO.

```cpp
#include <Adafruit_NeoPixel.h>

#define POWER 11
#define LED 12

Adafruit_NeoPixel pixel(1, LED, NEO_GRB + NEO_KHZ800);

void setPixelHigh() {
  pixel.setBrightness(20);
  pixel.setPixelColor(0, pixel.Color(70, 10, 50));
  pixel.show();
}

void setPixelLow() {
  pixel.setBrightness(0);
  pixel.setPixelColor(0, pixel.Color(70, 10, 50));
  pixel.show();
}

void setup() {
  pixel.begin();
  pinMode(POWER, OUTPUT);
  digitalWrite(POWER, HIGH);
}

void loop() {
  setPixelHigh();
  delay(100);
  setPixelLow();
  delay(100);
}
```

There was also a macro for a `POWER` pin which was set to high in an example
sketch in [the seeed XIAO documentation](https://wiki.seeedstudio.com/XIAO-RP2040-with-Arduino/#rgb-led),
so I followed along. Not sure what exactly it does though. `setPixelHigh` and
`setPixelLow` are just helper functions I made as turning the NeoPixel on and
off is somewhat more involved than a regular LED. 

For running the NeoPixel first, you initialize the NeoPixel object with
`Adafruit_NeoPixel pixel(1, <PIN>, <ADDITIONAL_CONFIG>)`<sup>1</sup> and
`pixel.begin()` in setup. Then, if you want to change its color you first run
`pixel.setPixelColor(0, <pixel.Color object>)`<sup>2</sup> and then
`pixel.show()` which just flushes all the recent changes to the physical
NeoPixel. However, if you want to change the *brightness*, you somewhy also need
to set the color every time along with `pixel.setBrightness(<value>)`. A little
bit strange and caused me a lot of headache when I was first learning to use
NeoPixels, but it iiiss what it iiis I guess.

<p>
<video autoplay loop muted preload="none" poster="/media/blink.webp" alt="The seeed XIAO with a blinking NeoPixel RGB LED." preload="none">
  <source src="/media/blink.webm" />
</video>
<span>*NeoPixel blinking away. My phone's camera butchered the colors, but if
you look closely, you can see that the light is purple.*</span>
</p>

Would've been fun to play around with some sensors as well, but I was busy this
week with other things so I decided to leave my coding at that.

<aside><sup>1</sup>1 is the amount of pixels, the same interface is used for
strips of several NeoPixels.</aside>

<aside><sup>2</sup> 0 is the index of NeoPixel
in the initialized "array", we have just 1 so it's always 0.</aside>

### Soldering

Another task we had to do was to solder some headers onto our new seeed XIAO
boards. This was both to get some soldering practice and to get acquainted with
the electronics work stations at the fablab.

With soldering, you must always take proper safety precautions since you're
working with an extremely hot tool that causes unhealthy fumes to come out of
metals. First, make sure that the fumes are properly ventilated. Practically,
this means having an active exhaust sucking away the fumes. Second, clear your
working space such that there's nothing flammable around. Third, pick up and put
down the soldering iron with care. If you're not using it, it should *always* be
in the stand.

When actually soldering, I was surprised at how quickly I was done with it. As
soon as the iron hit the board I just went into the solder zone. It was quite
satisfying and also nice to know that my soldering skills hadn't entirely
disappeared since my previous go at it.

<picture>
    <source srcset="/media/xiao-ready-small.webp 480w"
    media="(max-width: 480px) and (max-resolution: 1dppx)" />
    <img src="/media/xiao-ready.webp" loading="lazy" alt="The seed XIAO, now with headers freshly soldered." />
</picture>
<span>*Quite alright work. Looking back at it, some of the headers are maybe a
little on the under-soldered side.*</span>

After soldering, an essential task is always to check that everything's properly
connected. This can be done with a multi-meter by checking the resistance
between all the other pins and the ground pin (or one of them). If there's
resistance, the multi-meter will beep, indicating that there's connection. The
multi-meter beeped away with my XIAO so I was satsified with that.

Soldering was such fun though that I came back with some breakout boards of my
own that I needed to put headers on. I had a voltage converter, an accelerometer
and a GPS board to go through. This time, I was very much not in the zone. I was
outside the zone looking in desperately for someone to notice and come open the
door. I did get fairly ok results, but had to resolder more than I liked.
Particularly with the accelerometer, I accidentally pushed in one of the pins 
while soldering, leading to it being uneven with the others.

<picture>
    <source srcset="/media/uneven-small.webp 480w"
    media="(max-width: 480px) and (max-resolution: 1dppx)" />
    <img src="/media/uneven.webp" loading="lazy" alt="An accelerometer with
    headers soldered in. One of the headers is positioned quite differently
    compared to the others." />
</picture>

With some fiddling, I got it back in place. The other boards were more
cooperative. Although, with them too, I had some difficulty getting the solder
to spread to a nice, even cone around the header. Here's the full set.

<picture>
    <source srcset="/media/final-boards-small.webp 480w"
    media="(max-width: 480px) and (max-resolution: 1dppx)" />
    <img src="/media/final-boards.webp" loading="lazy" alt="A set of breakout
    boards with new headers soldered onto them." />
</picture>

That's all for this week! Next we're heading into 3D-printing territory, which
is quite familiar for me, but I'm looking forward to any new things I can learn ⚗️.
