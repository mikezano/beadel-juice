<template>
	<div class="deets">
		<h2>Pixel Deets</h2>
		<img ref="finalResultImg" class="deets__image-result" />
		<canvas ref="finalResult" class="deets__image-canvas" />
		<button @click="exportStats">Export</button>
		<ul class="deets__list" @mouseleave="highlightPixels" ref="colorStats">
			<li
				class="deets__pixel"
				v-for="pixel in mappedPixels"
				:key="pixel.id"
				:data-name="pixel.name"
				@mouseover="highlightPixels"
			>
				<div class="deets__pixel-color" :style="bgColor(pixel)"></div>
				<div class="deets__pixel-name">{{ pixel.name }}</div>
				<div class="deets__pixel-count">{{ pixel.count }}</div>
			</li>
		</ul>
	</div>
</template>

<script>
import { mapState } from "vuex";
import chroma from "chroma-js";
import BeadExport from "../models/BeadExport";

export default {
	data() {
		return {
			mappedPixels: []
		};
	},
	methods: {
		highlightPixels(e) {
			//https://github.com/vuejs/vue/issues/2236
			const highlight = e.currentTarget.classList.contains(".deets")
				? null
				: e.currentTarget.dataset.name;

			console.log(e.currentTarget.dataset.name);
			this.$emit("on-highlight-pixels", highlight);
		},
		bgColor(pixel) {
			return { backgroundColor: pixel.hex };
		},
		drawFinalResult() {
			var canvas = this.$refs.finalResult;
			canvas.width = this.width;
			canvas.height = this.height;

			var ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.imageSmoothingEnabled = false;

			let buffer = [];
			for (let i = 0; i < this.pixelData.length; i++) {
				const _i = i * 4;
				const rgb = chroma(this.pixelData[i].closestHex).rgba();
				buffer[_i] = rgb[0];
				buffer[_i + 1] = rgb[1];
				buffer[_i + 2] = rgb[2];
				buffer[_i + 3] = 255;
			}

			let iData = ctx.createImageData(canvas.width, canvas.height);
			iData.data.set(buffer);
			ctx.putImageData(iData, 0, 0);

			const base64 = canvas.toDataURL();
			console.log(base64);
			this.$refs.finalResultImg.src = base64;
		},
		exportStats() {
			const base64PerlerImage = this.$refs.finalResult.toDataURL();
			const beadExport = new BeadExport(
				this.base64,
				base64PerlerImage,
				this.width,
				this.height,
				this.mappedPixels,
				this.$refs.colorStats
			);
			beadExport.export();
		}
	},
	computed: {
		...mapState(["pixelData", "base64", "width", "height"])
	},
	watch: {
		pixelData(newPixelData) {
			if (!newPixelData) return;

			this.mappedPixels = [];
			const _this = this;
			newPixelData.forEach(pixel => {
				const colorExists =
					this.mappedPixels.filter(f => f.name === pixel.name)
						.length > 0;
				if (!colorExists) {
					var newItem = { ...pixel, count: 1 };
					_this.mappedPixels.push(newItem);
				} else {
					const indexOfColor = _this.mappedPixels.findIndex(
						f => f.name == pixel.name
					);
					_this.mappedPixels[indexOfColor].count++;
				}
			});

			this.mappedPixels.sort((a, b) => (a.count > b.count ? -1 : 1));
			this.drawFinalResult();
		}
	}
};
</script>
<style lang="scss">
.deets {
	&__list {
		list-style-type: none;
		text-align: left;
		padding: 0.2rem 0.4rem;
		margin: 0;
		height: 50vh;
		overflow: auto;
	}
	&__image-result {
		image-rendering: pixelated;
		width: 90%;
	}
	&__image-canvas {
		display: none;
	}
	&__pixel {
		display: flex;
		padding: 0.2rem 0;
		margin: 0;
	}
	&__pixel:hover {
		background-color: #555;
		cursor: pointer;
	}
	&__pixel-name {
		width: 10rem;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	&__pixel-color {
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
	}
}
</style>
