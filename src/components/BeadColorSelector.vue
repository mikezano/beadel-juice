<template>
	<div class="bcs" draggable="true" @mousedown="dragStart" ref="bcs">
		<h3 class="bcs__title">Color Switch</h3>
		<ul class="bcs__list">
			<li class="bcs__item" v-for="bead in beads" :key="bead.id">
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
		return { beads: perler, position: { x: 0, y: 0, elX: 0, elY: 0 } };
	},
	mounted() {
		const rect = this.$refs.bcs.parentNode.getBoundingClientRect();
		this.position.x = rect.x;
		this.position.y = rect.y;
	},
	methods: {
		dragStart(e) {
			//e.preventDefault();
			document.onmousemove = this.dragSelector;
			document.onmouseup = this.dragEnd;
			const rect = this.$refs.bcs.getBoundingClientRect();
			const rectParent = this.$refs.bcs.parentNode.getBoundingClientRect();
			console.log("Rect:", rect);
			console.log("Rect Parent:", rectParent);
			const mousePos = { x: e.clientX, y: e.clientY };
			this.position.elX = mousePos.x - rect.x;
			this.position.elY = mousePos.y - rect.y;
		},
		dragSelector(e) {
			e.preventDefault();
			console.log(`x:${e.clientX}, y:${e.clientY}`);

			this.$refs.bcs.style.top = `${e.clientY -
				this.position.y -
				this.position.elY}px`;
			this.$refs.bcs.style.left = `${e.clientX -
				this.position.x -
				this.position.elX}px`;
		},
		dragEnd(e) {
			debugger;
			e.preventDefault();
			document.onmousemove = null;
			document.onmouseup = null;
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
	&__item-color {
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		margin-right: 0.1rem;
	}
}
</style>

