<template>
	<div
		class="bead-tip"
		:style="{left: `${coordinates.x - coordinates.rect.x}px`, top: `${coordinates.y - coordinates.rect.y}px`}"
	>
		<table v-if="isShowing">
			<tr>
				<td>Name</td>
				<td>{{pixelData.name}}</td>
			</tr>
			<tr>
				<td>Code</td>
				<td>{{pixelData.code}}</td>
			</tr>
			<tr>
				<td>Color</td>
				<td :style="{backgroundColor: pixelData.closestHex}">
					{{pixelData.closestHex}}
					<span></span>
				</td>
			</tr>
			<tr>
				<td>Actual</td>
				<td :style="{backgroundColor: pixelData.hex}">{{pixelData.hex}}</td>
			</tr>
			<tr>
				<td>RGB</td>
				<td>{colorRGB}</td>
			</tr>
		</table>
	</div>
</template>

<script>
export default {
	props: ["isShowing", "pixelData", "coordinates"],
	created() {
		//console.log(this.isShowing);
		//console.log(this.pixelData);
	},
	watch: {
		coordinates(newVal, oldVal) {
			console.log(newVal, oldVal);
		}
	}
};
</script>

<style lang="scss" scoped>
.bead-tip {
	position: absolute;
	background-color: #333;
	border: 2px solid black;
	box-shadow: 0.5rem 0.5rem 1rem hsla(0, 0%, 0%, 0.8);
	font-size: 0.8rem;
	padding: 0.5rem;
	text-align: left;
}
</style>