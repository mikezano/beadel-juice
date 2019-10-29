<template>
	<div class="beadz">
		<section class="beadz__tools">
			<Tools @on-pixels-generated="pixelsGenerated" />
		</section>
		<section class="beadz__view">
			<BeadGrid :pixel-data="pixelData" />
		</section>
		<section class="beadz__colors">colors</section>
	</div>
</template>

<script>
import Tools from '../components/Tools.vue';
import BeadGrid from '../components/BeadGrid.vue';
export default {
	data() {
		return {
			pixelData: [],
		};
	},
	components: {
		Tools,
		BeadGrid,
	},
	methods: {
		pixelsGenerated(pixelData) {
			console.log(pixelData);
			this.pixelData = pixelData;
		},
	},
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
