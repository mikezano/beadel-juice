<template>
	<div class="beadz">
		<section class="beadz__tools">
			<Tools @on-pixels-generated="pixelsGenerated" @on-update-zoom="zoomUpdate" />
		</section>
		<section class="beadz__view">
			<BeadGrid :width="canvasWidth" :height="canvasHeight" :zoom="zoom" />
			<BeadTip />
		</section>
		<section class="beadz__colors">
			<ColorStats @on-highlight-pixels="highlightPixels" />
		</section>
	</div>
</template>

<script>
import Tools from "../components/Tools.vue";
import BeadGrid from "../components/BeadGrid.vue";
import BeadTip from "../components/BeadTip.vue";
import ColorStats from "../components/ColorStats.vue";
import { mapState } from "vuex";
export default {
	data() {
		return {
			canvasHeight: 0,
			canvasWidth: 0,
			zoom: 0
		};
	},
	components: {
		Tools,
		BeadGrid,
		BeadTip,
		ColorStats
	},
	methods: {
		pixelsGenerated(pixelGridData, width, height) {
			this.pixelGridData = pixelGridData;
			this.canvasWidth = width;
			this.canvasHeight = height;
		},
		zoomUpdate(zoom) {
			this.zoom = zoom;
		},
		highlightPixels(name) {
			if (name === null) {
				this.pixelGridData.forEach(p => {
					p.highlight = false;
					p.key = `${p.id}-0`;
				});
			} else {
				this.pixelGridData.forEach(p => {
					p.highlight = p.name === name;
					if (p.highlight === true) {
						p.key = `${p.id}-${p.highlight ? 1 : 0}`;
					}
				});
			}
		}
	},
	computed: {
		...mapState(["pixelGridData"])
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
