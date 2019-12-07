<template>
	<div>
		<h2>Pixel Deets</h2>
		<canvas ref="finalResult" />
		<ul class="deets" @mouseleave="highlightPixels">
			<li
				class="deets__pixel"
				v-for="pixel in mappedPixels"
				:key="pixel.id"
				:data-name="pixel.name"
				@mouseover="highlightPixels"
			>
				<div class="deets__pixel-color" :style="bgColor(pixel)"></div>
				<div class="deets__pixel-name">{{ pixel.name }}</div>
				<div class="deets__pixel-count">{{ pixel.count }}</div>
			</li>
		</ul>
		<button @click="exportStats">Export</button>
	</div>
</template>

<script>
import { mapState } from "vuex";
import jsPDF from "jspdf";

export default {
	data() {
		return {
			mappedPixels: []
		};
	},
	methods: {
		highlightPixels(e) {
			//https://github.com/vuejs/vue/issues/2236
			const highlight = e.currentTarget.classList.contains(".deets")
				? null
				: e.currentTarget.dataset.name;

			console.log(e.currentTarget.dataset.name);
			this.$emit("on-highlight-pixels", highlight);
		},
		bgColor(pixel) {
			return { backgroundColor: pixel.hex };
		},
		drawFinalResult() {
			var canvas = this.$refs.finalResult;
			canvas.width = this.width;
			canvas.height = this.height;

			var ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.imageSmoothingEnabled = false;

			let buffer = [];
			for (var y = 0; y < this.height; y++) {
				for (var x = 0; x < this.width; x++) {
					var pos = (y * this.width + x) * 4; // position in buffer based on x and y
					buffer[pos] = 9; // some R value [0, 255]
					buffer[pos + 1] = 9; // some G value
					buffer[pos + 2] = 9; // some B value
					buffer[pos + 3] = 255; // set alpha channel
				}
			}

			//ctx.drawImage(img, 0, 0);
		},
		drawCircle(doc, rgb, y) {
			console.log(rgb);
			doc.setLineWidth(0.2);
			doc.setDrawColor(0);
			doc.setFillColor(rgb.r, rgb.g, rgb.b);
			doc.circle(120, y, 4, "FD");
		},
		scaledImageForPdf() {
			const pdfImgWidth = 500;
			const pdfImgHeight = 200;
			const excessWidth = this.width / pdfImgWidth;
			const excessHeight = this.height / pdfImgHeight;

			let scaler = 1;
			if (excessWidth > 1.0 || excessHeight > 1.0) {
				scaler =
					excessWidth > excessHeight ? excessWidth : excessHeight;
			}
			const actualWidth = this.width / scaler;
			const actualHeight = this.height / scaler;
			return { width: actualWidth, height: actualHeight };
		},
		exportStats() {
			console.log(this.mappedPixels);
			const doc = new jsPDF();
			doc.text("Hello world!", 10, 10);

			const {
				width: imgWidth,
				height: imgHeight
			} = this.scaledImageForPdf();
			doc.addImage(this.base64, "PNG", 10, 10, imgWidth, imgHeight);

			let y = 15;
			this.mappedPixels.forEach(p => {
				const rgbSplit = p.rgb.split(",");
				const rgb = {
					r: parseInt(rgbSplit[0]),
					g: parseInt(rgbSplit[1]),
					b: parseInt(rgbSplit[2])
				};
				this.drawCircle(doc, rgb, y);
				doc.text(`${p.code}-${p.name} : ${p.count}`, 130, y + 2);
				y += 9;
			});
			doc.save("a4.pdf");
		}
	},
	computed: {
		...mapState(["pixelData", "base64", "width", "height"])
	},
	watch: {
		pixelData(newPixelData) {
			if (!newPixelData) return;

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
	margin: 0;
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
.deets__pixel-color {
	width: 1rem;
	height: 1rem;
	border-radius: 50%;
}
</style>
