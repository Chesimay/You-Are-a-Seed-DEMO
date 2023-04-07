import {getNonNullElement, createDefinedSpan, addButtonListener} from "./main";

let begun = false;
type Color = { r: number, g: number, b: number }

function awakening() {
	//only run this function once
	if (!begun) {
		begun = true;

		//in 2 seconds, make the first button visible and clickable
		setTimeout(() => {
			getNonNullElement("water").style.opacity = "1";
			addButtonListener("water", "H2O_testa", 1);
		}, 2000);

		//swap the text in the initial header
		const dry = getNonNullElement("dry_INTRO");
		
		dry.textContent = "Water contacted your ";
		dry.appendChild(createDefinedSpan("testa", "seed coating"));
		dry.appendChild(document.createTextNode("!"));

		//change the document's title
		document.title = "The Seed Awakens";

		//fade to the new background color and text color
		fadeColor({ r: 0, g: 0, b: 0 }, { r: 250, g: 235, b: 215 }, '--background', 2000);
		fadeColor({ r: 250, g: 235, b: 215 }, { r: 0, g: 0, b: 0 }, '--text-color', 2000);
	}
}

function fadeColor(startColor: Color, endColor: Color, colorVar: string, duration: number) { //duration in milliseconds
	const interval = 10; // 10 milliseconds
	const steps = duration / interval;
	const stepSize = 1 / steps;
	let progress = 0;

	//every 10 millisecond, blend the colors a bit more toward the end color
	const timer = setInterval(() => {
		progress += stepSize;
		//exit the loop when the blending is complete
		if (progress >= 1) {
			clearInterval(timer);
		}
		//update the current color
		const currentColor = blendColors(startColor, endColor, progress);
		//actually change the variable based on the name of the CSS var passed in
		document.documentElement.style.setProperty(colorVar, currentColor);
	}, interval);
}

function blendColors(startColor: Color, endColor: Color, progress: number): string {
	const r = Math.round(startColor.r + (endColor.r - startColor.r) * progress);
	const g = Math.round(startColor.g + (endColor.g - startColor.g) * progress);
	const b = Math.round(startColor.b + (endColor.b - startColor.b) * progress);
	return `rgb(${r}, ${g}, ${b})`;
}
export { awakening }