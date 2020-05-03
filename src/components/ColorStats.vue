<template>
	<div class="deets">
		<button class="deets__export" @click="exportStats">Export</button>
		<div>Beaded</div>
		<div class="deets__image">
			<img ref="finalResultImg" class="deets__image-result" />
			<canvas ref="finalResult" class="deets__image-canvas" />
		</div>
		<ul class="deets__list" @mouseleave="highlightPixels" ref="colorStats">
			<li
				class="deets__pixel"
				v-for="pixel in mappedPixels"
				:key="pixel.id"
				:data-name="pixel.name"
				@mouseover="highlightPixels"
			>
				<div class="deets__pixel-color" :style="bgColor(pixel)"></div>
				<div class="deets__pixel-name">
					<div>{{ pixel.name }}</div>
					<div>{{ pixel.code }}</div>
				</div>
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
			console.log(pixel);
			if (pixel.name === "Translucent Purple") {
				console.log(pixel);
			}
			return { backgroundColor: pixel.closestHex };
		},
		drawFinalResult() {
			var canvas = this.$refs.finalResult;
			canvas.width = this.width;
			canvas.height = this.height;

			var ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.imageSmoothingEnabled = false;

			let buffer = [];
			for (let i = 0; i < this.pixelGridData.length; i++) {
				const _i = i * 4;
				const rgb = chroma(this.pixelGridData[i].closestHex).rgba();
				buffer[_i] = rgb[0];
				buffer[_i + 1] = rgb[1];
				buffer[_i + 2] = rgb[2];
				buffer[_i + 3] = 255;
			}

			let iData = ctx.createImageData(canvas.width, canvas.height);
			iData.data.set(buffer);
			ctx.putImageData(iData, 0, 0);

			const base64 = canvas.toDataURL();
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
		...mapState(["pixelGridData", "base64", "width", "height"])
	},
	watch: {
		pixelGridData(newPixelGridData) {
			if (!newPixelGridData) return;

			this.mappedPixels = [];
			const _this = this;
			newPixelGridData.forEach(pixel => {
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
	display: flex;
	flex-direction: column;
	padding: 0 1rem;
	&__list {
		list-style-type: none;
		text-align: left;
		padding: 0;
		margin: 1rem 0;
		flex: auto;
		overflow: auto;
		height: calc(100vh - 380px);
	}
	&__image {
		width: 100%;
		border: 0.1rem dashed white;
	}
	&__image-result {
		image-rendering: pixelated;
		width: 100%;
	}
	&__image-canvas {
		display: none;
	}
	&__export {
		$orange: #0071c5;
		border-radius: 0.2rem;
		padding: 1rem;
		font-size: 1.5rem;
		font-weight: bold;
		color: white;
		margin-bottom: 1.5rem;
		border: 0.1rem solid $orange;
		background-color: lighten($orange, 10%);
		box-shadow: 0 0.4rem darken($orange, 10%);
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
		font-size: 0.8rem;
		padding-left: 0.2rem;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	&__pixel-color {
		width: 1rem;
		height: 1rem;
	}
}
</style>
