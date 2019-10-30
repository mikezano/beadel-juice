<template>
	<div class="bead-grid-container">
		<div class="bead-grid">
			<div
				class="bead-grid__cell"
				v-for="pixel in pixelData"
				:key="pixel.id"
				:style="hslColor(pixel.closestHex)"
				:title="
					`closest: ${pixel.closestHex}\nhex: ${pixel.hex}\nrgb: ${pixel.rgb}`
				"
			></div>
		</div>
	</div>
</template>

<script>
export default {
	props: ["pixelData"],
	methods: {
		hslColor(pixel) {
			return {
				backgroundColor: pixel
			};
		}
	},
	created() {
		console.log("Pixel Data: ", this.pixelData);
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
