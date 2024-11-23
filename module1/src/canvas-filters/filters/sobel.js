import { grayscale } from "./colors";

const matrixSobelX = [
    -1, 0, 1,
    -2, 0, 2,
    -1, 0, 1
];

const matrixSobelY = [
    -1, -2, -1,
    0, 0, 0,
    1, 2, 1
];

const getPixel = (source, x, y) => {
    const { data, width } = source;
    const i = (y * width + x) * 4;
    return data[i];
}

const applyKernel = (source, cb) => {
    const { data, width, height } = source;
    const dist = new Uint8ClampedArray(data.length);

    for(let x = 0 ; x < width ; x++) {
        for(let y = 0 ; y < height ; y++) {
            const matrix = [
                [getPixel(source, x - 1, y - 1), getPixel(source, x, y - 1), getPixel(source, x + 1, y - 1)],
                [getPixel(source, x - 1, y), getPixel(source, x, y), getPixel(source, x + 1, y)],
                [getPixel(source, x - 1, y + 1), getPixel(source, x, y + 1), getPixel(source, x + 1, y + 1)]
            ];

            const value = cb(matrix);

            dist[(y * width + x) * 4] = value;
            dist[(y * width + x) * 4 + 1] = value;
            dist[(y * width + x) * 4 + 2] = value;
            dist[(y * width + x) * 4 + 3] = 255;
        }
    }

    return new ImageData(dist, width, height);
}

export const sobelY = (source) => applyKernel(grayscale(source), (matrix) => {
    let pixelY = 0;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const pixel = matrix[i][j];
            const weightY = matrixSobelY[i * 3 + j];

            pixelY += pixel * weightY;
        }
    }

    return pixelY;
});

export const sobelX = (source) => applyKernel(grayscale(source), (matrix) => {
    let pixelX = 0;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const pixel = matrix[i][j];
            const weightX = matrixSobelX[i * 3 + j];

            pixelX += pixel * weightX;
        }
    }

    return pixelX
});

export const sobel = (source) => applyKernel(grayscale(source), (matrix) => {
    let pixelX = 0;
    let pixelY = 0;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const pixel = matrix[i][j];
            const weightX = matrixSobelX[i * 3 + j];
            const weightY = matrixSobelY[i * 3 + j];

            pixelX += pixel * weightX;
            pixelY += pixel * weightY;
        }
    }

    return Math.sqrt(pixelX**2 + pixelY**2);
});