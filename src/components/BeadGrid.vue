<template>
	<div class="bead-grid-container">
		<div class="bead-grid" ref="beadGrid">
			<div
				class="bead-grid__cell"
				:class="{'bead-grid__cell--highlight': pixel.highlight === true}"
				v-for="pixel in pixelData"
				:key="generateKey(pixel)"
				:style="hslColor(pixel.closestHex)"
				:title="
					`${pixel.code} - ${pixel.name}\nclosest: ${pixel.closestHex}\nhex: ${pixel.hex}\nrgb: ${pixel.rgb}`
				"
			>
				<span class="bead-grid__cell-code">{{pixel.code}}</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: ["pixelData", "width", "height", "zoom"],
	methods: {
		hslColor(pixel) {
			return {
				backgroundColor: pixel
			};
		},
		changePixelSizing(size) {
			this.$refs.beadGrid.style.gridTemplateColumns = `repeat(${this.width}, ${size}px)`;
			this.$refs.beadGrid.style.gridTemplateRows = `repeat(${this.height}, ${size}px)`;
		},
		generateKey(pixel) {
			return `${pixel.id}-${pixel.highlight ? 1 : 0}`;
		}
	},
	mounted() {
		this.changePixelSizing(40);
	},
	watch: {
		zoom(newVal, oldVal) {
			console.log("zoom: ", this.zoom, oldVal, newVal);
			this.changePixelSizing(newVal);
		}
	}
};
</script>

<style>
.bead-grid-container {
	width: calc(100vw - 28rem);
	height: 90vh;
	display: flex;
	align-content: center;
	align-items: center;
	overflow: auto;
}
.bead-grid {
	display: grid;
	grid-template-columns: repeat(29, 40px);
	grid-template-rows: repeat(29, 40px);
	grid-gap: 0;
	margin: auto;
}
.bead-grid__cell {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	border: 1px solid transparent;
}
.bead-grid__cell--highlight {
	border: 2px solid white;
}
.bead-grid__cell-code {
	font-size: 8px;
}
</style>
