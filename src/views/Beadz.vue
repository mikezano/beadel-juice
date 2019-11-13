<template>
	<div class="beadz">
		<section class="beadz__tools">
			<Tools @on-pixels-generated="pixelsGenerated" />
		</section>
		<section class="beadz__view">
			<BeadGrid
				:pixel-data="pixelData"
				:width="canvasWidth"
				:height="canvasHeight"
				v-if="pixelsAreAvailable"
			/>
		</section>
		<section class="beadz__colors">colors</section>
	</div>
</template>

<script>
import Tools from "../components/Tools.vue";
import BeadGrid from "../components/BeadGrid.vue";
export default {
	data() {
		return {
			pixelData: [],
			canvasHeight: 0,
			canvasWidth: 0
		};
	},
	components: {
		Tools,
		BeadGrid
	},
	methods: {
		pixelsGenerated(pixelData, width, height) {
			console.log(pixelData);
			this.pixelData = pixelData;
			this.canvasWidth = width;
			this.canvasHeight = height;
		}
	},
	computed: {
		pixelsAreAvailable() {
			return this.pixelData.length > 0;
		}
	}
};
</script>

<style lang="scss">
.beadz {
	display: flex;

	&__tools,
	&__colors {
		width: 14rem;
	}

	&__view {
		flex: auto;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&__tools,
	&__colors,
	&__view {
		border: 1px solid blue;
	}
}
</style>
