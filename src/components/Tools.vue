<template>
	<div class="tools">
		<button class="tools__select-file" @click="updateCanvasImageButton">Select File</button>
		<input type="file" ref="file" @change="updateCanvasImage" v-show="false" git />
		<label>Zoom:</label>
		<input type="range" min="10" max="50" value="30" step="1" @change="updateZoom" />
		<div class="tools__canvas">
			<canvas id="canvas" ref="imageCanvas"></canvas>
			<img class="tools__img-ref" ref="imgRef" />
		</div>
		<div>Pixel Size: {{ zoom }}px</div>
	</div>
</template>

<script>
//https://docs.google.com/spreadsheets/d/1u9CIj65P48rnmLr3yLIg096lRP-w-txcqBVfKnaCDZc/edit#gid=1983628989

import {
	rgbToHex,
	//nearestPerlerByHex
	nearestPerlerByHex_Chroma
} from "../models/colorCounter";
import { mapMutations } from "vuex";

export default {
	data() {
		return {
			file: null,
			pixelData: [],
			zoom: 0
		};
	},
	// created() {
	// 	console.log("functions exist:", nearestPerlerByHex);
	// },
	methods: {
		...mapMutations(["updatePixelData", "updateBase64"]),
		updateCanvasImageButton() {
			this.$refs.file.click();
		},
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
				self.$store.commit("updateBase64", img.src);
				this.$refs.imgRef.src = event.target.result;
			};

			reader.readAsDataURL(files[0]);
		},

		updateZoom(e) {
			console.log(e);
			this.zoom = e.target.value;
			//this.$emit("on-update-zoom", this.zoom);
			this.$store.commit("updateZoom", this.zoom);
		},

		drawCanvasImage(img) {
			var canvas = this.$refs.imageCanvas;
			canvas.width = img.width;
			canvas.height = img.height;

			var ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.imageSmoothingEnabled = false;
			debugger;
			ctx.drawImage(img, 0, 0);

			var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			var data = imgData.data;

			this.pixelData = []; //clear previous image
			for (let i = 0; i < data.length; i += 4) {
				const red = data[i];
				const green = data[i + 1];
				const blue = data[i + 2];

				//const hsl = this.rgbToHSL(red, green, blue);

				const hex = rgbToHex(red, green, blue);
				const closest = nearestPerlerByHex_Chroma(hex);

				//console.log('HSL: ', hsl);
				const rand = Math.random();
				this.pixelData.push({
					closestHex: closest.hex,
					hex: hex,
					rgb: `${red},${green},${blue}`,
					id: rand,
					key: `${rand}-0`,
					highlight: false,
					name: closest.name,
					code: closest.code
				});
			}
			this.$store.commit("updatePixelData", {
				pixelData: this.pixelData,
				width: canvas.width,
				height: canvas.height
			});
			//this.setPixelData(this.pixelData);
		}
	}
};
</script>

<style lang="scss">
.tools {
	display: flex;
	flex-direction: column;
	padding: 1rem;
	&__canvas,
	&__img-ref {
		width: 100%;
	}
	&__img-ref {
		image-rendering: pixelated;
	}
	&__select-file {
		$orange: orange;
		border: 0.1rem solid $orange;
		background-color: lighten(orange, 10%);
		border-radius: 0.2rem;
		padding: 1rem;
		font-size: 1.5rem;
		font-weight: bold;
		color: white;
		box-shadow: 0 0.4rem darken($orange, 10%);
		margin-bottom: 1.5rem;
	}
}

.tools__canvas {
	width: 100%;
	border: 0.1rem dashed white;
}
#canvas {
	width: 100%;
	height: auto;
	display: none;
}
</style>
