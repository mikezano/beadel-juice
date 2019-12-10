import jsPDF from "jspdf";
import chroma from "chroma-js";

export default class BeadExport {
	doc = null;
	pdfImgWidth = 250;
	pdfImgHeight = 200;
	base64OriginalImage = null;
	base64PerlerImage = null;
	mappedPixels = null;
	imageWidth = null;
	imageHeight = null;
	colorStatsElement = null;

	constructor(
		base64OriginalImage,
		base64PerlerImage,
		imageWidth,
		imageHeight,
		mappedPixels,
		colorStatsElement
	) {
		this.base64OriginalImage = base64OriginalImage;
		this.base64PerlerImage = base64PerlerImage;
		this.mappedPixels = mappedPixels;
		this.imageWidth = imageWidth;
		this.imageHeight = imageHeight;
		this.colorStatsElement = colorStatsElement;
		this.doc = new jsPDF();
	}

	export() {
		this.doc.setFontSize(10);
		const {
			width: scaledWidth,
			height: scaledHeight
		} = this.scaledImageForPdf();

		this.doc.addImage(
			this.base64OriginalImage,
			"PNG",
			10,
			10,
			scaledWidth,
			scaledHeight
		);

		this.doc.addImage(
			this.base64PerlerImage,
			"PNG",
			100,
			10,
			scaledWidth,
			scaledHeight
		);

		this.writeMappedPixels();
		//this.doc.fromHTML(this.colorStatsElement, 0, 200);
		this.doc.save("a4.pdf");
	}

	drawBead(rgb, x, y) {
		this.doc.setLineWidth(0.2);
		this.doc.setDrawColor(0);
		this.doc.setFillColor(rgb[0], rgb[1], rgb[2]);
		this.doc.circle(x, y, 2, "FD");
	}

	scaledImageForPdf() {
		const excessWidth = this.imageWidth / this.pdfImgWidth;
		const excessHeight = this.imageHeight / this.pdfImgHeight;

		let scaler = 1;
		if (excessWidth > 1.0 || excessHeight > 1.0) {
			scaler = excessWidth > excessHeight ? excessWidth : excessHeight;
		}
		const actualWidth = this.imageWidth / scaler;
		const actualHeight = this.imageHeight / scaler;
		return { width: actualWidth, height: actualHeight };
	}

	writeMappedPixels() {
		let y = 15;
		this.mappedPixels.forEach((p, i) => {
			const rgb = chroma(p.hex).rgba();
			const x = i % 2 === 0 ? 10 : 130;
			this.drawBead(rgb, x, y + this.imageHeight);

			this.doc.text(
				`${p.code}-${p.name} : ${p.count}`,
				x + 3,
				y + this.imageHeight + 1.5
			);
			y += 4;
		});
	}
}
