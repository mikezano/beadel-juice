<template>
	<div class="tools">
		<input type="file" ref="file" @change="updateCanvasImage" />
		<canvas id="canvas" ref="imageCanvas"></canvas>
	</div>
</template>

<script>
export default {
	data() {
		return {
			file: null,
			pixelData: [],
		};
	},
	methods: {
		updateCanvasImage(e) {
			const self = this;
			const files = e.target.files;
			const reader = new FileReader();

			reader.onload = () => {
				var img = new Image();
				img.onload = function() {
					self.drawCanvasImage(img);
				};
				img.src = event.target.result;
			};

			reader.readAsDataURL(files[0]);

			//this.file = this.$refs.file.files[0];
			//console.log('file', this.file);
		},

		drawCanvasImage(img) {
			var canvas = this.$refs.imageCanvas;
			canvas.width = img.width;
			canvas.height = img.height;

			var ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0);

			var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			var data = imgData.data;
			console.log(data);

			for (let i = 0; i < data.length; i += 4) {
				const red = data[i];
				const green = data[i + 1];
				const blue = data[i + 2];

				const hsl = this.rgbToHSL(red, green, blue);
				console.log('HSL: ', hsl);
				this.pixelData.push(hsl);
			}
		},

		rgbToHSL(r, g, b) {
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

			return 'hsl(' + h + ',' + s + '%,' + l + '%)';
		},
	},
};
</script>
