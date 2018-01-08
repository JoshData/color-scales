var d3color = require("d3-color");

function hex(color) {
	function componentToHex(c) {
	    var hex = parseInt(c).toString(16);
	    return hex.length == 1 ? "0" + hex : hex;
	}
	color = d3color.rgb(color);
    return "#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
}

function isInRGBGamut(c) {
	var crgb = d3color.rgb(c);
	return !(crgb.r < 0 || crgb.r > 255 || crgb.g < 0 || crgb.g > 255 || crgb.b < 0 || crgb.b > 255);
}

function interp(c1, c2, v) {
	// Convert to color space.
	c1 = d3color.hcl(c1);
	c2 = d3color.hcl(c2);

	// Interpolate.
	var c = d3color.hcl(
		(1-v)*c1.h + v*c2.h,
		(1-v)*c1.c + v*c2.c,
		(1-v)*c1.l + v*c2.l
	)

	// Check that it is within RGB gamut. If not, reduce its chroma just
	// enough to keep it within the RGB gamut.
	while (!isInRGBGamut(c))
		c.c /= 1.05;

	return c;
}

function bwcontrast(c) {
	// reset C to 0 and L to 0 or 1, whichever is farther
	c = d3color.hcl(c);
	if (c.l < 50) c.l = 100;
	else c.l = 0;
	c.c = 0;
	return c;
}

function monochrome(c) {
	// reset chrome to zero
	c = d3color.hcl(c);
	c.c = 0;
	return c;
}

window.color_scale = function(clr1, clr2, segments) {
	var ret = [];
	clr1 = d3color.rgb(clr1);
	clr2 = d3color.rgb(clr2);
	for (var v = 0; v < segments; v++) {
		var c = interp(clr1, clr2, v/(segments-1));
		ret.push({
			rgb: d3color.rgb(c),
			hex: hex(c),
			css: c.toString(),
			bwcontrast: bwcontrast(c).toString(),
			monochrome_css: monochrome(c).toString(),
		})
	}
	return ret;
}
