import {red, green, blue, yellow, invert, grayscale, blackAndWhite, sepia } from "./filters/colors";
import { microsoft } from "./filters/microsoft";
import { opacity } from "./filters/opacity";
import { sobel, sobelX, sobelY} from "./filters/sobel"
import { noise1, noise2, noise3} from "./filters/noises";
import { filter, applyFilter, applyAnimation } from "./canvas";

const lenna = new Image();
lenna.src = "https://upload.wikimedia.org/wikipedia/en/7/7d/Lenna_%28test_image%29.png";
lenna.crossOrigin = "Anonymous";

const iloveyou = new Image();
// lenna.src = "https://images.pexels.com/photos/3825303/pexels-photo-3825303.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
iloveyou.crossOrigin = "Anonymous";


const filters = [
    applyFilter("invert", invert),
    applyFilter("red", red),
    applyFilter("green", green),
    applyFilter("blue", blue),
    applyFilter("yellow", yellow),
    applyFilter("grayscale", grayscale),
    applyFilter("blackAndWhite", blackAndWhite),
    applyFilter("sepia", sepia),
    applyFilter("noise1", noise1),
    applyFilter("noise2", noise2),
    applyFilter("opacity", opacity),
    applyFilter("sobelY", sobelY),
    applyFilter("sobelX", sobelX),
    applyFilter("sobel", sobel),
    applyAnimation("noise3", noise3),
    filter("microsoft", microsoft),
]


lenna.onload = () => {
    const canvas = document.getElementById("original");
    const ctx = canvas.getContext("2d");
    const canvases = [...document.querySelectorAll("canvas")]
    canvases.forEach(canvas => {
        canvas.width = lenna.width;
        canvas.height = lenna.height;
    });

    ctx.drawImage(lenna, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    filters.forEach(filter => filter(imageData));
};