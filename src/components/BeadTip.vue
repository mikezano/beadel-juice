<template>
	<div class="bead-tip">
		<table v-if="isShowing">
			<tr>
				<td>{{pixel.name}}: {{pixel.code}}</td>
				<td class="bead-tip__spacer">|</td>
				<td>Color</td>
				<td :style="{backgroundColor: pixel.closestHex}">
					{{pixel.closestHex}}
					<span></span>
				</td>
				<td class="bead-tip__spacer">|</td>
				<td>Actual</td>
				<td :style="{backgroundColor: pixel.hex}">{{pixel.hex}}</td>
				<td class="bead-tip__spacer">|</td>
				<td>RGB</td>
				<td>{colorRGB}</td>
			</tr>
		</table>
	</div>
</template>

<script>
import { mapState } from "vuex";
export default {
	//props: ["isShowing", "pixelData", "coordinates"],
	data() {
		return {
			event: null,
			pixel: null,
			isShowing: false
		};
	},
	watch: {
		hoveredPixelData(newVal) {
			this.isShowing = true;
			this.event = newVal.event;
			this.pixel = newVal.pixel;
		}
	},
	computed: {
		...mapState(["hoveredPixelData"])
	}
};
</script>

<style lang="scss" scoped>
.bead-tip {
	//background-color: #333;
	color: white;
	//border: 2px solid black;
	//box-shadow: 0.5rem 0.5rem 1rem hsla(0, 0%, 0%, 0.8);
	font-size: 0.8rem;
	padding-top: 0.2rem;
	text-align: left;
	&__spacer {
		padding: 0 0.5rem;
		color: #666;
	}
}
</style>