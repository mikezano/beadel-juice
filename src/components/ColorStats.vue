<template>
	<div>
		<h2>Pixel Deets</h2>
		<ul class="deets">
			<li class="deets__pixel" v-for="pixel in mappedPixels" :key="pixel.id">
				<div class="deets__pixel-name">{{pixel.name}}</div>
				<div class="deets__pixel-count">{{pixel.count}}</div>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	props: ["pixelData"],
	data() {
		return {
			mappedPixels: []
			//rawPixels
		};
	},
	watch: {
		pixelData(newPixelData) {
			this.mappedPixels = [];
			const _this = this;
			newPixelData.forEach(pixel => {
				const colorExists =
					this.mappedPixels.filter(f => f.name === pixel.name)
						.length > 0;
				if (!colorExists) {
					var newItem = { ...pixel, count: 1 };
					_this.mappedPixels.push(newItem);
				} else {
					const indexOfColor = _this.mappedPixels.findIndex(
						f => f.name == pixel.name
					);
					_this.mappedPixels[indexOfColor].count++;
				}
			});

			this.mappedPixels.sort((a, b) => (a.count > b.count ? -1 : 1));
		}
	}
};
</script>
<style>
.deets {
	list-style-type: none;
}
.deets__pixel {
	display: flex;
}
.deets__pixel-name {
	width: 10rem;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
