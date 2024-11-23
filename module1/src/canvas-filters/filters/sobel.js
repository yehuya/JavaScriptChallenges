import { grayscale } from "./colors";

const getPixel = (imageData, x, y) => {
    const { data, width } = imageData;
    const i = (y * width + x) * 4;
    return data[i];
}

const applyKernel = (imageData, cb) => {
    const { data, width, height } = imageData;
    const bit = new Uint8ClampedArray(data.length);

    for(let x = 0 ; x < width ; x++) {
        for(let y = 0 ; y < height ; y++) {
            const matrix = [
                [getPixel(imageData, x - 1, y - 1), getPixel(imageData, x, y - 1), getPixel(imageData, x + 1, y - 1)],
                [getPixel(imageData, x - 1, y), getPixel(imageData, x, y), getPixel(imageData, x + 1, y)],
                [getPixel(imageData, x - 1, y + 1), getPixel(imageData, x, y + 1), getPixel(imageData, x + 1, y + 1)]
            ];

            const value = cb(matrix);

            bit[(y * width + x) * 4] = value;
            bit[(y * width + x) * 4 + 1] = value;
            bit[(y * width + x) * 4 + 2] = value;
            bit[(y * width + x) * 4 + 3] = 255;
        }
    }

    return new ImageData(bit, width, height);
}

export const sobelY = (source) => {
    const sobelY = [
        -1, -2, -1,
        0, 0, 0,
        1, 2, 1
    ];

    return applyKernel(grayscale(source), (matrix) => {
        let pixelY = 0;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const pixel = matrix[i][j];
                const weightY = sobelY[i * 3 + j];

                pixelY += pixel * weightY;
            }
        }

        return pixelY;
    });
}

export const sobelX = (source) => {
    const sobelX = [
        -1, 0, 1,
        -2, 0, 2,
        -1, 0, 1
    ];

    return applyKernel(grayscale(source), (matrix) => {
        let pixelX = 0;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const pixel = matrix[i][j];
                const weightX = sobelX[i * 3 + j];

                pixelX += pixel * weightX;
            }
        }

        return pixelX
    });
}

export const sobel = (source) => {
    const sobelX = [
        -1, 0, 1,
        -2, 0, 2,
        -1, 0, 1
    ];

    const sobelY = [
        -1, -2, -1,
        0, 0, 0,
        1, 2, 1
    ];

    return applyKernel(grayscale(source), (matrix) => {
        let pixelX = 0;
        let pixelY = 0;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const pixel = matrix[i][j];
                const weightX = sobelX[i * 3 + j];
                const weightY = sobelY[i * 3 + j];

                pixelX += pixel * weightX;
                pixelY += pixel * weightY;
            }
        }

        return Math.sqrt(pixelX**2 + pixelY**2);
    });
}