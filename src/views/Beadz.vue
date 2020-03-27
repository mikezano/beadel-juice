<template>
	<div class="beadz">
		<section class="beadz__tools">
			<Tools @on-pixels-generated="pixelsGenerated" @on-update-zoom="zoomUpdate" />
		</section>
		<section class="beadz__view">
			<BeadGrid :width="canvasWidth" :height="canvasHeight" :zoom="zoom" />
		</section>
		<section class="beadz__colors">
			<ColorStats @on-highlight-pixels="highlightPixels" />
		</section>
	</div>
</template>

<script>
import Tools from "../components/Tools.vue";
import BeadGrid from "../components/BeadGrid.vue";
import ColorStats from "../components/ColorStats.vue";
import { mapState } from "vuex";
export default {
	data() {
		return {
			//pixelData: [],
			canvasHeight: 0,
			canvasWidth: 0,
			zoom: 0
		};
	},
	components: {
		Tools,
		BeadGrid,
		ColorStats
	},
	methods: {
		//...mapMutations(['updatePixelData']),
		pixelsGenerated(pixelData, width, height) {
			this.pixelData = pixelData;
			this.canvasWidth = width;
			this.canvasHeight = height;
		},
		zoomUpdate(zoom) {
			this.zoom = zoom;
		},
		highlightPixels(name) {
			if (name === null) {
				this.pixelData.forEach(p => {
					p.highlight = false;
					p.key = `${p.id}-0`;
				});
			} else {
				this.pixelData.forEach(p => {
					p.highlight = p.name === name;
					if (p.highlight === true) {
						p.key = `${p.id}-${p.highlight ? 1 : 0}`;
					}
				});
			}
		}
	},
	computed: {
		...mapState(["pixelData"])
	}
};
</script>

<style lang="scss">
.beadz {
	display: flex;

	&__tools,
	&__colors {
		width: 200px;
	}

	&__view {
		flex: auto;
		//display: flex;
		//align-items: center;
		//justify-content: center;
	}

	&__tools,
	&__colors,
	&__view {
		//border: 1px solid gray;
	}
}
</style>
