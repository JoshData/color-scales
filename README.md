Color Scale Generator Using a Perceptually Valid Color Space
============================================================

https://joshdata.github.io/color-scales/

There are lots of color scale generators on the web. This one generates scales for continuous variables based on human color perception so that neighboring colors have equal separation in both hue and lightness. Lightness steps are important because not everyone can discriminate hues the same way.

You’re probably familiar with RGB — the triple of red-green-blue color components that represents colors shown on computer monitors. Unfortunately math in “RGB space” isn’s perceptually valid. Dividing the green component in half doesn’t make a color half as green. Adding 50 to all of components makes the color brighter by uneven amounts depending on which color you start with. That’s because the sensitivity of human color perception is uneven across the gamut of colors we can see, and the definition of RGB used by computer monitors doesn’t follow human perceptual sensitivity.

Color professionals have come up with alternative measurement systems for colors so that taking consistent arithmetic steps has a perceptually consistent effect. One such system replaces RGB with [CIE 1976 L*, u*, v* (CIE LUV) color space](https://en.wikipedia.org/wiki/CIELUV), and RGB’s cylindrical equivalent HSL with [CIELCH](https://en.wikipedia.org/wiki/CIELUV#Cylindrical_representation_(CIELCH)). This page uses CIELCH to interpolate colors evenly across their lightness (L), chroma (C, similar to saturation), and hue (H).

Color math is performed with [d3-color](https://github.com/d3/d3-color). Some of the suggested end colors are inspired by [Color Brewer](http://colorbrewer2.org/)’s end colors.