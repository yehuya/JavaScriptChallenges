import { red, green, blue, yellow } from "./colors";

export const microsoft = (source, ctx) => {
    const {width, height} = source;

    const redImageData = red(source);
    const greenImageData = green(source);
    const blueImageData = blue(source);
    const yellowImageData = yellow(source);

    ctx.putImageData(redImageData, 0, 0, 0, 0, width / 2, height / 2);
    ctx.putImageData(greenImageData, 0, 0, width / 2, 0, width / 2 , height / 2);
    ctx.putImageData(blueImageData, 0, 0, 0, height / 2, width / 2, height / 2);
    ctx.putImageData(yellowImageData, 0, 0, width / 2, height / 2, width / 2, height / 2);
}