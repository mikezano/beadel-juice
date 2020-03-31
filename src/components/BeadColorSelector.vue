<template>
	<div class="bcs" draggable="true" @mousedown="dragStart" ref="bcs">
		<i class="bcs__close" @click="close">X</i>
		<h3 class="bcs__title">Color Switch</h3>
		<ul class="bcs__list">
			<li class="bcs__item" v-for="bead in beads" :key="bead.id" @click="onColorSelect(bead)">
				<div class="bcs__item-color" :style="{backgroundColor: bead.hex}"></div>
				<div class="bcs__item-name">{{bead.name}}</div>
			</li>
		</ul>
	</div>
</template>

<script>
import { perler } from "../models/colorCounter";
export default {
	props: ["gridPosition"],
	data() {
		return {
			beads: perler,
			dragStartPos: { x: 0, y: 0 },
			containerRect: null
		};
	},
	mounted() {
		console.log("Beads", this.beads);
		const rect = this.$refs.bcs.parentNode.getBoundingClientRect();
		this.containerRect = rect;
	},
	methods: {
		close() {
			this.$emit("on-color-selector-close");
		},
		dragStart(e) {
			const rect = this.$refs.bcs.getBoundingClientRect();
			this.dragStartPos.x = e.clientX - rect.x;
			this.dragStartPos.y = e.clientY - rect.y;
			document.onmousemove = this.dragSelector;
			document.onmouseup = this.dragEnd;
		},
		dragSelector(e) {
			e.preventDefault();

			this.$refs.bcs.style.top = `${e.clientY -
				this.containerRect.y -
				this.dragStartPos.y}px`;
			this.$refs.bcs.style.left = `${e.clientX -
				this.containerRect.x -
				this.dragStartPos.x}px`;
		},
		dragEnd(e) {
			e.preventDefault();
			document.onmousemove = null;
			document.onmouseup = null;
		},
		onColorSelect(bead) {
			this.$emit("on-color-select", bead);
		}
	}
};
</script>

<style lang="scss">
.bcs {
	position: absolute;
	top: 0;
	background-color: #333;
	//border: 0.2rem solid #222;
	box-shadow: 0 0 2rem black;
	&__close {
		position: absolute;
		right: 0.5rem;
		top: 0.8rem;
		color: red;
	}
	&__close:hover {
		transform: scale(1.3);
		cursor: pointer;
	}
	&__title {
		padding: 0;
		margin: 0.8rem 0;
	}
	&__list {
		margin: 0;
		padding: 0;
		height: 10rem;
		overflow: auto;
		background-color: #222;
	}
	&__item {
		display: flex;
		padding: 0.2rem;
	}
	&__item:hover {
		background-color: #333;
		cursor: pointer;
	}
	&__item-color {
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		margin-right: 0.1rem;
	}
}
</style>

