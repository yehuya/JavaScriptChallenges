import {noise1, noise2, noise3} from "./filters/noises";

const filtersMap = {
    noise1,
    noise2,
    noise3,
}

globalThis.onmessage = (e) => {
    const { canvas, bitmap, filterName} = e.data;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const filter = filtersMap[filterName](imageData);
    ctx.putImageData(filter, 0, 0);
}