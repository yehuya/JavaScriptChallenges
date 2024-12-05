import {red, green, blue, yellow, invert, grayscale, blackAndWhite, sepia } from "./filters/colors";
import { microsoft } from "./filters/microsoft";
import { opacity } from "./filters/opacity";
import { mask1, mask2, mask3, mask4, mask5, mask6, mask7 } from "./filters/masks";
import { sobel, sobelX, sobelY, sharpen, gaussianBlur} from "./filters/kernel";
import { noise1, noise2, noise3, noise4} from "./filters/noises";
import { filter, applyFilter, applyFilterOffscreen, applyAnimation, loadImages, getCanvasContext } from "./canvas";
import flowerSrc from "./images/flower.jpg";

const worker1 = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
const worker2 = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });

const [flower, iloveu, bg] = await loadImages([
    flowerSrc,
    "https://images.pexels.com/photos/3825303/pexels-photo-3825303.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/750854/pexels-photo-750854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
]);

const flowerFilters = () => {
    const filters = [
        applyFilter("invert", invert),
        applyFilter("red", red),
        applyFilter("green", green),
        applyFilter("blue", blue),
        applyFilter("yellow", yellow),
        applyFilter("grayscale", grayscale),
        applyFilter("blackAndWhite", blackAndWhite),
        applyFilter("sepia", sepia),
        applyFilterOffscreen("noise1", noise1, worker1),
        applyFilterOffscreen("noise2", noise2, worker1),
        applyFilterOffscreen("noise3", noise3, worker1),
        applyFilterOffscreen("sharpen", sharpen, worker2),
        applyFilterOffscreen("gaussianBlur", gaussianBlur, worker2),
        applyFilter("opacity", opacity),
        applyFilter("sobelY", sobelY),
        applyFilter("sobelX", sobelX),
        applyFilter("sobel", sobel),
        applyAnimation("noise4", noise4),
        filter("microsoft", microsoft),
    ];
    
    const canvases = [...document.querySelectorAll(".flower canvas")];
    canvases.forEach(canvas => {
        canvas.width = flower.width;
        canvas.height = flower.height;
    });
    
    const ctx = getCanvasContext("original");
    ctx.drawImage(flower, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, flower.width, flower.height);
    
    filters.forEach(filter => filter(imageData));
}

flowerFilters();


const maskFilters = () => {
    const filters = [
        applyFilter("mask1", mask1),
        applyFilter("mask2", mask2),
        applyAnimation("mask3", mask3),
        applyAnimation("mask4", mask4),
        applyAnimation("mask5", mask5),
        applyAnimation("mask6", mask6),
        applyAnimation("mask7", mask7),
    ];
    
    const ctxMask = getCanvasContext('originalMask');
    const ctxBG = getCanvasContext('originalBackground');

    const canvases = [...document.querySelectorAll(".iloveu canvas")];
    canvases.forEach(canvas => {
        canvas.width = iloveu.width;
        canvas.height = iloveu.height;
    });

    ctxMask.drawImage(iloveu, 0, 0);
    ctxBG.drawImage(bg, 0, 0, iloveu.width, iloveu.height);

    const maskImageData = ctxMask.getImageData(0, 0, iloveu.width, iloveu.height);
    const bgImageData = ctxBG.getImageData(0, 0, iloveu.width, iloveu.height);

    filters.forEach(filter => filter(maskImageData, bgImageData));
}

maskFilters();