<template>
	<div class="bead-grid">
		<div
			class="bead-grid__cell"
			v-for="pixel in pixelData"
			:key="pixel.id"
			:style="hslColor(pixel.hsl)"
			:title="pixel.hsl"
		></div>
	</div>
</template>

<script>
export default {
	props: ['pixelData'],
	methods: {
		hslColor(pixel) {
			return {
				backgroundColor: pixel,
			};
		},
	},
	created() {
		console.log('Pixel Data: ', this.pixelData);
	},
};
</script>

<style>
.bead-grid {
	display: grid;
	grid-template-columns: repeat(29, 20px);
	grid-template-rows: repeat(29, 20px);
	grid-gap: 0;
	margin: auto;
}
.bead-grid__cell {
	width: 20px;
	height: 20px;
	border: 1px solid #333;
}
</style>