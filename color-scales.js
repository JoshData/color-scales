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

	// Check that we're going the right way in hues.
	// We might want to wrap around 360 instead of
	// tranversing e.g. 300 through 200 to get to 100.
	if (c2.h < c1.h-180) c2.h += 360;
	if (c1.h < c2.h-180) c1.h += 360;

	// There's a problem with colors near the zero-chroma axis
	// like white and black --- their hues don't matter!
	// That ruins the interpolation because we're pulling
	// mid-point values toward a hue that isn't actually
	// perceptually apparent. The chroma value doesn't
	// matter in a different way -- it must be zero.
	function min(a, b) { return a > b ? b : a; }
	function max(a, b) { return a < b ? b : a; }
	function safepow(a, b) { return isFinite(b) ? a**b : 0; }
	var vh = v;
	if (c1.c < 10) vh = v**max(c1.c/10, 0);
	if (c2.c < 10) vh = safepow(v, 1/max(c2.c/10, 0));
	if (c1.c > 90) vh = v**((100-min(c1.c, 100))/10);
	if (c2.c > 90) vh = safepow(v, 10/(100-min(c2.c, 100)));

	// There's a related problem with colors near the lightness
	// extremes where only chroma at or near zero is in the RGB
	// gamut. There's no reason to pull colors toward zero chroma
	// more than necessary to keep them in the the RGB gamut,
	// so also avoid pulling chroma toward zero in these
	// cases.
	var vc = v;
	if (c1.l < 5) vc = v**max(c1.l/5, 0);
	if (c2.l < 5) vc = safepow(v, 1/max(c2.l/5, 0));
	if (c1.l > 95) vc = v**((101-min(c1.l, 100))/5);
	if (c2.l > 95) vc = safepow(v, 5/(101-min(c2.l, 100)));

	var c = d3color.hcl(
		(1-vh)*c1.h + vh*c2.h,
		(1-vc)*c1.c + vc*c2.c,
		(1-v)*c1.l + v*c2.l
	)

	// Check that it is within RGB gamut. If not, reduce its chroma just
	// enough to keep it within the RGB gamut.
	var ctr = 0;
	while (!isInRGBGamut(c)) {
		c.c /= 1.1;
		if (c.c < .5)
			break;
		ctr++; if (ctr > 50) break;
	}

	// If it's still not in the gamut, clamp.
	if (!isInRGBGamut(c)) {
		c = d3color.rgb(c);
		c.r = max(0, min(255, c.r));
		c.g = max(0, min(255, c.g));
		c.b = max(0, min(255, c.b));
	}

	return c;
}

function bwcontrast(c) {
	// Choose a light or dark grey for a foreground
	// text color that will be most contrast-y with
	// then given color.
	c = d3color.hcl(c);
	if (c.l < 60) c.l = 90;
	else c.l = 10;
	c.c /= 3;
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
