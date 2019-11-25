<template>
	<div class="bead-grid-container">
		<div class="bead-grid" ref="beadGrid" @click="showColorSelector">
			<div
				class="bead-grid__cell"
				:class="{'bead-grid__cell--highlight': pixel.highlight === true}"
				:data-id="pixel.id"
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
		<BeadColorSelector @on-color-select="changeColor" v-if="isShowingColorSelector" />
	</div>
</template>

<script>
import BeadColorSelector from "./BeadColorSelector.vue";

export default {
	props: ["pixelData", "width", "height", "zoom"],
	data() {
		return {
			isShowingColorSelector: false,
			perlerToReplace: null
		};
	},
	methods: {
		showColorSelector(e) {
			const { id } = e.target.dataset;
			this.perlerToReplace = this.pixelData.filter(
				f => f.id.toString() == id.toString()
			)[0];
			this.isShowingColorSelector = true;
		},
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
		},
		changeColor(bead) {
			console.log("Received bead:", bead);

			const replacement = this.perlerToReplace;
			this.pixelData.forEach(p => {
				if (p.hex === replacement.hex) {
					p = { ...bead };
				}
			});
		}
		// showAlternatives(e) {
		// 	const cell = e.target;
		// 	const backgroundColor = cell.style.backgroundColor;
		// }
	},
	mounted() {
		this.changePixelSizing(40);
	},
	watch: {
		zoom(newVal, oldVal) {
			console.log("zoom: ", this.zoom, oldVal, newVal);
			this.changePixelSizing(newVal);
		}
	},
	components: {
		BeadColorSelector
	}
};
</script>

<style lang="scss">
.bead-grid-container {
	position: relative;
	width: calc(100vw - 28rem);
	height: 90vh;
	display: flex;
	align-content: center;
	align-items: center;
	overflow: auto;
	//padding: 1rem;
	border: 0.1rem solid black;
	background-color: #888;
	box-shadow: inset 0 0 1rem #000;
}
.bead-grid {
	display: grid;
	grid-template-columns: repeat(29, 40px);
	grid-template-rows: repeat(29, 40px);
	grid-gap: 0;
	margin: auto;

	&__cell {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		border: 1px solid black;
	}
	&__cell:hover {
		transform: scale(1.1);
		border: 2px solid white;
	}
	&__cell--highlight {
		border: 2px solid white;
	}
	&__cell-code {
		font-size: 8px;
	}
}
</style>
