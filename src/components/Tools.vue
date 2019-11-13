<template>
	<div class="tools">
		<input type="file" ref="file" @change="updateCanvasImage" />
		<canvas id="canvas" ref="imageCanvas"></canvas>
	</div>
</template>

<script>
//https://docs.google.com/spreadsheets/d/1u9CIj65P48rnmLr3yLIg096lRP-w-txcqBVfKnaCDZc/edit#gid=1983628989

import {
	rgbToHex,
	//nearestPerlerByHex
	nearestPerlerByHex_Chroma
} from "../models/colorCounter";

export default {
	data() {
		return {
			file: null,
			pixelData: []
		};
	},
	// created() {
	// 	console.log("functions exist:", nearestPerlerByHex);
	// },
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

			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);

			var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			var data = imgData.data;

			for (let i = 0; i < data.length; i += 4) {
				const red = data[i];
				const green = data[i + 1];
				const blue = data[i + 2];

				//const hsl = this.rgbToHSL(red, green, blue);

				const hex = rgbToHex(red, green, blue);
				const closest = nearestPerlerByHex_Chroma(hex);

				//console.log('HSL: ', hsl);
				this.pixelData.push({
					closestHex: closest.hex,
					hex: hex,
					rgb: `${red},${green},${blue}`,
					id: Math.random(),
					name: closest.name,
					code: closest.code
				});
			}

			this.$emit(
				"on-pixels-generated",
				this.pixelData,
				canvas.width,
				canvas.height
			);
		}
	}
};
</script>
