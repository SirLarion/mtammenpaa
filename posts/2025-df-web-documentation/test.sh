#!/bin/bash
img=code-dark.webp
if [[ $(grep -c "ANMF" $img) == 0 ]]; then
  imgname=${img%.*}
  magick $img -resize 960x960 ../build/$dir/$imgname.webp
  magick $img -resize 480x480 ../build/$dir/$imgname-small.webp
fi
