<template>
	<div>
		<h2>Pixel Deets</h2>
		<ul class="deets">
			<li
				class="deets__pixel"
				v-for="pixel in mappedPixels"
				:key="pixel.id"
				:data-name="pixel.name"
				@mouseover="highlightPixels"
			>
				<div class="deets__pixel-color" :style="bgColor(pixel)">*</div>
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
		};
	},
	methods: {
		highlightPixels(e) {
			//https://github.com/vuejs/vue/issues/2236

			console.log(e.currentTarget.dataset.name);
			this.$emit("on-highlight-pixels", e.currentTarget.dataset.name);
		},
		bgColor(pixel) {
			return { backgroundColor: pixel.hex };
		}
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
	text-align: left;
	padding: 0.2rem 0.4rem;
	margin: 0;
}
.deets__pixel {
	display: flex;
	padding: 0.2rem 0;
}
.deets__pixel:hover {
	background-color: #555;
	cursor: pointer;
}
.deets__pixel-name {
	width: 10rem;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
