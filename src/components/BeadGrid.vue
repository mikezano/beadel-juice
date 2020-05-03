<template>
	<div class="bead-grid-container" ref="beadGridContainer">
		<div
			class="bead-grid"
			ref="beadGrid"
			@click="showColorSelector"
			v-if="pixelsAreAvailable"
			@mouseover="hoverCell"
			@mouseleave="clearHighlighting"
		>
			<div
				class="bead-grid__cell"
				v-for="pixel in pixelGridData"
				:class="{
					'bead-grid__cell--highlight': pixel.highlight === true
				}"
				:data-id="pixel.id"
				:key="generateKey(pixel)"
				:style="hslColor(pixel.closestHex)"
			>
				<!-- <span class="bead-grid__cell-code">{{ pixel.code }}</span> -->
			</div>
		</div>
		<BeadColorSelector
			@on-color-select="changeColor"
			@on-color-selector-close="closeColorSelector"
			@on-next-closest-color="selectNextClosestColor"
			v-if="isShowingColorSelector"
			:selectedCell="selectedCell"
		/>
	</div>
</template>

<script>
import BeadColorSelector from "./BeadColorSelector.vue";
import { mapState, mapMutations } from "vuex";
import { closestColorMatcher } from "../models/colorCounter";

export default {
	data() {
		return {
			isShowingColorSelector: false,
			isShowingBeadTip: false,
			//currentCell: null,
			//cellToReplace: null,
			selectedCell: null,
			//nextGridPosition: null,
			toolTipDelay: null,
			replacements: [],
			beadTipCoordinates: { x: 0, y: 0 }
		};
	},
	created() {
		document.addEventListener("keydown", e => {
			if (e.ctrlKey && e.key === "z" && this.replacements.length > 0) {
				this.undo();
			}
		});
	},
	computed: {
		...mapState([
			"pixelGridData",
			"width",
			"height",
			"zoom",
			"areMatchesHighlighted"
		]),
		pixelsAreAvailable() {
			return this.pixelGridData && this.pixelGridData.length > 0;
		}
	},
	methods: {
		...mapMutations([
			"updatePixelGridData",
			"updateZoom",
			"updateHoveredPixelData"
		]),
		selectNextClosestColor() {
			const { closestHex } = this.selectedCell.data;
			const closestMatch = closestColorMatcher(closestHex, true);
			this.changeColor(closestMatch);
			console.log("Closest Match:", closestMatch);
		},
		showColorSelector(e) {
			const cellElement = e.target.closest(".bead-grid__cell");
			//this.nextGridPosition = cellElement.getBoundingClientRect();
			//this.selectedCellElement = cellElement;
			const { id } = cellElement.dataset;
			this.cellToReplace = this.pixelGridData.filter(
				f => f.id.toString() == id.toString()
			)[0];
			this.selectedCell = { data: this.cellToReplace, el: cellElement };
			this.isShowingColorSelector = true;
		},
		hoverCell(event) {
			if (this.areMatchesHighlighted === false) return;

			const cellElement = event.target;
			const { id } = cellElement.dataset;

			const hoveredPixel = this.pixelGridData.filter(
				f => f.id.toString() === id.toString()
			)[0];

			this.$store.commit("updateHoveredPixelData", {
				event,
				pixel: hoveredPixel
			});

			this.pixelGridData.forEach(p => {
				p.highlight = p.name === hoveredPixel.name;
				if (p.highlight === true) {
					p.key = `${p.id}-${p.highlight ? 1 : 0}`;
				}
			});
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
			const replacement = this.selectedCell.data;

			let replacementIndexes = [];
			const newPixelGridData = this.pixelGridData.map((p, i) => {
				if (p.hex === replacement.hex) {
					replacementIndexes.push(i);
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

			this.replacements.push({
				beadToReplaceWith: bead,
				beadToReplace: replacement,
				indexes: replacementIndexes
			});

			this.$store.commit("updatePixelGridData", {
				pixelGridData: newPixelGridData,
				width: null,
				height: null
			});
		},
		undo() {
			const lastChange = this.replacements.pop();
			lastChange.indexes.forEach(i => {
				this.pixelGridData[i] = {
					...lastChange.beadToReplace,
					id: Math.random().toString()
				};
			});
			const newPixelGridData = this.pixelGridData.map((p, i) => {
				// if (p.closestHex === lastChange.beadToReplaceWith.hex) {
				// 	p = {
				// 		...lastChange.beadToReplace,
				// 		id: Math.random().toString()
				// 		//closestHex: bead.hex,
				// 		//hex: replacement.hex
				// 	};
				// }
				if (lastChange.indexes.includes(i)) {
					p = {
						...lastChange.beadToReplace,
						id: Math.random().toString()
						//closestHex: bead.hex,
						//hex: replacement.hex
					};
				}
				return p;
			});
			this.$store.commit("updatePixelGridData", {
				pixelGridData: newPixelGridData,
				width: null,
				height: null
			});
		},
		clearHighlighting() {
			clearTimeout(this.toolTipDelay);
			this.toolTipDelay = null;
			this.isShowingBeadTip = false;
			this.pixelGridData.forEach(p => {
				p.highlight = false;
			});
		}
	},
	watch: {
		zoom(newVal) {
			this.changePixelSizing(newVal);
		},
		pixelGridData() {
			//TODO: how to remove timeout but still have $refs.beadGrid exist
			const _this = this;
			setTimeout(() => {
				const beadGridWidth =
					_this.$refs.beadGridContainer.clientWidth / _this.width;
				_this.$store.commit("updateZoom", beadGridWidth);

				_this.changePixelSizing(this.zoom);
			}, 100);
		},
		areMatchesHighlighted(newVal) {
			if (newVal === false) {
				this.clearHighlighting();
			}
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
	grid-template-columns: repeat(29, 0);
	grid-template-rows: repeat(29, 0);
	grid-gap: 0;
	margin: auto;

	&__cell {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		border: 1px solid black;
	}
	&__cell:hover {
		transform: scale(1);
		border: 2px solid white;
	}
	&__cell--highlight {
		border: 1px dotted white;
	}
	&__cell-code {
		font-size: 8px;
	}
}
</style>
