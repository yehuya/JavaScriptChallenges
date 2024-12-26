import {red, green, blue, yellow, invert, grayscale, blackAndWhite, sepia } from "./filters/colors";
import { microsoft } from "./filters/microsoft";
import { opacity } from "./filters/opacity";
import { mask1, mask2, mask3, mask4, mask5, mask6, mask7 } from "./filters/masks";
import { sobel, sobelX, sobelY, sharpen, gaussianBlur} from "./filters/kernel";
import { noise1, noise2, noise3, noise4} from "./filters/noises";
import { filter, applyFilter, applyFilterOffscreen, applyAnimation, loadImages, getCanvasContext, setCanvasSize } from "./canvas";
import flowerSrc from "./images/flower.jpg";
import maskSrc from "./images/mask.jpg";
import bgSrc from "./images/bg.jpg";

const worker1 = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
const worker2 = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });

const [flower, mask, bg] = await loadImages([flowerSrc, maskSrc, bgSrc]);

const flowerFilters = () => {
    const filters = [
        applyFilter("invert", invert),
        applyFilter("red", red),
        applyFilter("green", green),
        applyFilter("blue", blue),
        applyFilter("yellow", yellow),
        applyFilter("grayscale", grayscale),
        applyFilter("binary", blackAndWhite),
        applyFilter("sepia", sepia),
        applyFilterOffscreen("noise1", noise1, worker1),
        applyFilterOffscreen("noise2", noise2, worker1),
        applyFilterOffscreen("noise3", noise3, worker1),
        applyFilterOffscreen("sharpen", sharpen, worker2),
        applyFilterOffscreen("gaussian-blur", gaussianBlur, worker2),
        applyFilter("opacity", opacity),
        applyFilter("sobelY", sobelY),
        applyFilter("sobelX", sobelX),
        applyFilter("sobel", sobel),
        applyAnimation("noise4", noise4),
        filter("microsoft", microsoft),
    ];
    
    setCanvasSize(".flower canvas", flower.width, flower.height);
    
    const ctx = getCanvasContext("original-flower");
    ctx.drawImage(flower, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, flower.width, flower.height);
    
    filters.forEach(filter => filter(imageData));
}

flowerFilters();


const maskFilters = () => {
    const filters = [
        applyFilter("mask1", mask1),
        applyFilter("mask2", mask2),
        applyFilter("mask3", mask3),
        applyFilter("mask4", mask4),
        applyAnimation("mask5", mask5),
        applyFilter("mask6", mask6),
        applyFilter("mask7", mask7),
    ];
    
    const ctxMask = getCanvasContext('original-mask');
    const ctxBg = getCanvasContext('original-bg');

    setCanvasSize(".mask canvas", mask.width, mask.height);

    ctxMask.drawImage(mask, 0, 0);
    ctxBg.drawImage(bg, 0, 0, mask.width, mask.height);

    const maskImageData = ctxMask.getImageData(0, 0, mask.width, mask.height);
    const bgImageData = ctxBg.getImageData(0, 0, mask.width, mask.height);

    filters.forEach(filter => filter(maskImageData, bgImageData));
}

maskFilters();