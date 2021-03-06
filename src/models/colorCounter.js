const perler = require("../colors/all.json");

const perlerColors = {};

//contains just the name and hex value
perler.forEach(p => {
	perlerColors[p.name.replace(" ", "")] = p.hex;
});

const nearestPerlerColor = require("nearest-human-color").from(perlerColors);
const chroma = require("chroma-js");

//The Euclidian
const nearestPerlerByHex_Euclidian = hexColor => {
	const hex = nearestPerlerColor(hexColor).value;
	return exactPerlerByHex(hex);
};

//hexColor comes directly off the canvas pixels
const nearestPerlerByHex_Chroma = hexColor => {
	let minDistance = 1000000;
	let nearestPerler = null;
	perler.forEach(p => {
		const currentDistance = chroma.distance(p.hex, hexColor);
		const currentDistanceLAB = 0; //chroma.distance(p.hex, hexColor, "lab");
		const currentDistanceHSL = 0; //chroma.distance(p.hex, hexColor, "hsl");
		const currentDistanceRGB = chroma.distance(p.hex, hexColor, "rgb");

		const totalDistance =
			currentDistance +
			currentDistanceLAB +
			currentDistanceHSL +
			currentDistanceRGB;

		if (totalDistance < minDistance) {
			minDistance = totalDistance;
			nearestPerler = p;
		}
	});

	return nearestPerler;
};

//hexColor comes directly off the canvas pixels
const closestColorMatcher = (hexColor, ignoreExact, ignoreList) => {
	let minDistance = 1000000;
	let closestColor = null;
	debugger;
	perler.forEach(p => {
		if (
			(p.hex.toLowerCase() === hexColor && ignoreExact) ||
			ignoreList.indexOf(p.hex) > -1
		) {
			return;
		}
		const currentDistance = chroma.distance(p.hex, hexColor);
		const currentDistanceLAB = 0; //chroma.distance(p.hex, hexColor, "lab");
		const currentDistanceHSL = 0; //chroma.distance(p.hex, hexColor, "hsl");
		const currentDistanceRGB = chroma.distance(p.hex, hexColor, "rgb");

		const totalDistance =
			currentDistance +
			currentDistanceLAB +
			currentDistanceHSL +
			currentDistanceRGB;

		if (totalDistance < minDistance) {
			minDistance = totalDistance;
			closestColor = p;
		}
	});

	return closestColor;
};

const sortedBeads = () => {
	let beadsWithAvgRGB = perler.map(m => {
		let hue = chroma(m.hex).hsl()[0];
		return { ...m, hue };
	});

	beadsWithAvgRGB.sort((a, b) => {
		return a.hue > b.hue ? 1 : -1;
	});

	return beadsWithAvgRGB;
};

const nearestNcolorsByHex_Chroma = (hexColor, n) => {
	let collection = [];
	let nextHex = hexColor;
	for (var i = 0; i < n; i++) {
		const closestPerler = nearestPerlerByHex_Chroma(nextHex);
		collection.push(closestPerler);
		nextHex = closestPerler.hex;
	}
	return collection;
};

//Get the exact perler from the list
const exactPerlerByHex = hexColor => {
	return perler.filter(p => p.hex === hexColor)[0];
};

const rgbToHSL = (r, g, b) => {
	// Make r, g, and b fractions of 1
	r /= 255;
	g /= 255;
	b /= 255;

	// Find greatest and smallest channel values
	let cmin = Math.min(r, g, b),
		cmax = Math.max(r, g, b),
		delta = cmax - cmin,
		h = 0,
		s = 0,
		l = 0;

	// Calculate hue
	// No difference
	if (delta == 0) h = 0;
	// Red is max
	else if (cmax == r) h = ((g - b) / delta) % 6;
	// Green is max
	else if (cmax == g) h = (b - r) / delta + 2;
	// Blue is max
	else h = (r - g) / delta + 4;

	h = Math.round(h * 60);

	// Make negative hues positive behind 360°
	if (h < 0) h += 360;

	// Calculate lightness
	l = (cmax + cmin) / 2;

	// Calculate saturation
	s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

	// Multiply l and s by 100
	s = +(s * 100).toFixed(1);
	l = +(l * 100).toFixed(1);

	return "hsl(" + h + "," + s + "%," + l + "%)";
};

const rgbToHex = (r, g, b) => {
	r = r.toString(16);
	g = g.toString(16);
	b = b.toString(16);

	if (r.length == 1) r = "0" + r;
	if (g.length == 1) g = "0" + g;
	if (b.length == 1) b = "0" + b;

	return "#" + r + g + b;
};

export {
	perler,
	sortedBeads,
	exactPerlerByHex,
	nearestPerlerByHex_Euclidian as nearestPerlerByHex,
	rgbToHSL,
	rgbToHex,
	nearestPerlerByHex_Chroma,
	nearestNcolorsByHex_Chroma,
	closestColorMatcher
};
