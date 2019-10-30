const perlerColorsDetails = require("../colors/perler.json");

// const perlerColors = perler.map(x => {
// 	return { [x.name]: x.hex };
// });

const allPerlerColors = {
	white: "#F7F7F2",
	lightGray: "#BEC3BF",
	gray: "#96989C",
	pewter: "#93A19F",
	charcoal: "#545F5F",
	darkGray: "#56575C",
	//black: "#343234",
	//
	toastedMarshmallow: "#F1E5D8",
	sand: "#EAC49F",
	fawn: "#D7B087",
	tan: "#CFA889",
	rust: "#A04E3F",
	cranapple: "#88404F",
	//
	lightBrown: "#9D7153",
	brown: "#6C524D",
	//
	cream: "#EDE7BA",
	pastelYellow: "#FAEE8D",
	yellow: "#F9D737",
	cheddar: "#FFB64E",
	orange: "#FF803E",
	butterscotch: "#E19A52",
	//
	hotCoral: "#FF6158",
	salmon: "#FF777F",
	blush: "#FF9E8D",
	flamingo: "#FFB5BE",
	peach: "#FCC6B8",
	//
	lightPink: "#F5C0D5",
	bubbleGum: "#E16D9D",
	pink: "#E65794",
	magenta: "#F34676",
	//
	red: "#C43A44",
	cherry: "#AD3345",
	raspberry: "#AD3C6C",
	plum: "#B25FAA",
	//
	lightLavendar: "#B4A6D3",
	pastelLavendar: "#9582BB",
	purple: "#6F5493",
	//
	blueberryCreme: "#87A7E1",
	periwinkle: "#6C88BF",
	//
	robinsEgg: "#B4D9DF",
	pastelBlue: "#63A9D6",
	lightBlue: "#278ACB",
	cobalt: "#0066B3",
	darkBlue: "#2B307C",
	midnight: "#162846",
	//
	toothpaste: "#B0E8D5",
	turquoise: "#008FCC",
	//
	//
	lightGreen: "#38C7AF",
	parrotGreen: "#00968A",
	//
	pastelGreen: "#73D594",
	kiwiLime: "#77CA4A",
	brightGreen: "#54B160",
	shamrock: "#009654",
	darkGreen: "#108355",
	//
	pricklyPear: "#CBD735",
	evergreen: "#3C614F"
};

const perlerColors = {};

perlerColorsDetails.forEach(p => {
	perlerColors[p.name.replace(" ", "")] = p.hex;
});

//console.log("what is the difference");
//console.log(allPerlerColors);
///console.log(perlerColors);

const nearestColor = require("nearest-human-color").from(allPerlerColors);
console.log("the nearest");
console.log(nearestColor("#104020"));

const findMatchByHex = hexColor => {
	return perlerColorsDetails.filter(p => p.hex === hexColor)[0];
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
	perlerColorsDetails as perler,
	findMatchByHex,
	rgbToHSL,
	rgbToHex,
	perlerColors,
	allPerlerColors,
	nearestColor
};
