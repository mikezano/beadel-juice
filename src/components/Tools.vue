<template>
	<div class="tools">
		<button class="tools__select-file" @click="updateCanvasImageButton">Select File</button>
		<input type="file" ref="file" @change="updateCanvasImage" v-show="false" git />
		<template v-if="showControls">
			<div>Pixel Size: {{ zoom }}px</div>
			<div class="tools__canvas">
				<canvas id="canvas" ref="imageCanvas"></canvas>
				<img class="tools__img-ref" ref="imgRef" />
			</div>

			<input
				class="tools__range"
				type="range"
				min="10"
				max="50"
				value="30"
				step="1"
				@change="updateZoom"
			/>
			<label>Zoom</label>

			<div>
				<label>Highlight Matches</label>
				<input type="checkbox" @change="updateAreMatchesHighlighted" checked />
			</div>

			<button class="tools__clear" @click="clearButton">Clear</button>
		</template>
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
			zoom: 0,
			showControls: false
		};
	},
	// created() {
	// 	console.log("functions exist:", nearestPerlerByHex);
	// },
	methods: {
		...mapMutations([
			"updatePixelData",
			"updateBase64",
			"updateAreMatchesHighlighted"
		]),
		updateCanvasImageButton() {
			this.$refs.file.click();
		},
		updateCanvasImage(e) {
			this.showControls = true;
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
		updateAreMatchesHighlighted(e) {
			const isChecked = e.target.checked;
			console.log("checked:", isChecked);
			this.$store.commit("updateAreMatchesHighlighted", isChecked);
		},

		clearButton() {
			this.pixelData = [];
			this.zoom = 0;
			this.showControls = false;
			this.file = null;
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
	$orange: orange;
	$blue: lightblue;
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
	&__range {
		margin: 1rem 0;
	}

	&__select-file,
	&__clear {
		border-radius: 0.2rem;
		padding: 1rem;
		font-size: 1.5rem;
		font-weight: bold;
		color: white;
		margin-bottom: 1.5rem;
	}
	&__select-file {
		border: 0.1rem solid $orange;
		background-color: lighten($orange, 10%);
		box-shadow: 0 0.4rem darken($orange, 10%);
	}
	&__clear {
		border: 0.1rem solid $blue;
		background-color: lighten($blue, 10%);
		box-shadow: 0 0.4rem darken($blue, 10%);
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
