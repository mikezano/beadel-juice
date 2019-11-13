<template>
	<div class="bead-grid-container">
		<div class="bead-grid" ref="beadGrid">
			<div
				class="bead-grid__cell"
				v-for="pixel in pixelData"
				:key="pixel.id"
				:style="hslColor(pixel.closestHex)"
				:title="
					`${pixel.code} - ${pixel.name}\nclosest: ${pixel.closestHex}\nhex: ${pixel.hex}\nrgb: ${pixel.rgb}`
				"
			>
				<span>{{pixel.code}}</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: ["pixelData", "width", "height"],
	methods: {
		hslColor(pixel) {
			return {
				backgroundColor: pixel
			};
		}
	},
	mounted() {
		console.log("Pixel Data: ", this.pixelData);
		console.log(this.$refs);
		this.$refs.beadGrid.style.gridTemplateColumns = `repeat(${this.width}, 40px)`;
		this.$refs.beadGrid.style.gridTemplateRows = `repeat(${this.height}, 40px)`;
		debugger;
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
	width: 40px;
	height: 40px;
	border: 1px solid #333;
}
</style>
