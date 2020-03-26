<template>
	<div class="bead-tip">
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
				<td>Closest</td>
				<td :style="{backgroundColor: pixelData.closestHex}">
					{{pixelData.closestHex}}
					<span></span>
				</td>
			</tr>
			<tr>
				<td>Hex</td>
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
	props: ["isShowing", "pixelData"],
	created() {
		console.log(this.isShowing);
		console.log(this.pixelData);
	}
};
</script>

<style lang="scss" scoped>
.bead-tip {
	position: absolute;
	background-color: #333;
}
</style>