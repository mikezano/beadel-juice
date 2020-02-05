<template>
	<div class="bead-grid-container" ref="beadGridContainer">
		<div class="bead-grid" ref="beadGrid" @click="showColorSelector" v-if="pixelsAreAvailable">
			<div
				class="bead-grid__cell"
				v-for="pixel in pixelData"
				:class="{
					'bead-grid__cell--highlight': pixel.highlight === true
				}"
				:data-id="pixel.id"
				:key="generateKey(pixel)"
				:style="hslColor(pixel.closestHex)"
				:title="
					`${pixel.code} - ${pixel.name}\nclosest: ${pixel.closestHex}\nhex: ${pixel.hex}\nrgb: ${pixel.rgb}`
				"
			>
				<!-- <span class="bead-grid__cell-code">{{ pixel.code }}</span> -->
			</div>
		</div>
		<BeadColorSelector
			@on-color-select="changeColor"
			@on-color-selector-close="closeColorSelector"
			v-if="isShowingColorSelector"
			:gridPosition="nextGridPosition"
		/>
	</div>
</template>

<script>
import BeadColorSelector from "./BeadColorSelector.vue";
import { mapState, mapMutations } from "vuex";

export default {
	data() {
		return {
			isShowingColorSelector: false,
			perlerToReplace: null,
			nextGridPosition: null
		};
	},
	created() {
		document.addEventListener("keydown", e => {
			if (e.ctrlKey && e.key === "z") {
				alert("undo");
			}
		});
	},
	methods: {
		...mapMutations(["updatePixelData", "updateZoom"]),
		showColorSelector(e) {
			const cell = e.target.closest(".bead-grid__cell");
			this.nextGridPosition = cell.getBoundingClientRect();
			const { id } = cell.dataset;
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
		closeColorSelector() {
			this.isShowingColorSelector = false;
		},
		changeColor(bead) {
			const replacement = this.perlerToReplace;
			const newPixelData = this.pixelData.map(p => {
				if (p.hex === replacement.hex) {
					p = {
						...replacement,
						...bead,
						id: Math.random().toString(),
						closestHex: bead.hex,
						hex: replacement.hex
					};
				}
				return p;
			});
			this.$store.commit("updatePixelData", {
				pixelData: newPixelData,
				width: null,
				height: null
			});
		}
	},
	computed: {
		...mapState(["pixelData", "width", "height", "zoom"]),
		pixelsAreAvailable() {
			return this.pixelData && this.pixelData.length > 0;
		}
	},
	watch: {
		zoom(newVal) {
			this.changePixelSizing(newVal);
		},
		pixelData() {
			// debugger;
			// if (oldVal === null) {

			// }
			//TODO: how to remove timeout but still have $refs.beadGrid exist
			const _this = this;
			setTimeout(() => {
				const beadGridWidth =
					_this.$refs.beadGridContainer.clientWidth / _this.width;
				_this.$store.commit("updateZoom", beadGridWidth);
				_this.changePixelSizing(this.zoom);
			}, 100);
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
