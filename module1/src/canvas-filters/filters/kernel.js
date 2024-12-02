import { grayscale } from "./colors";

const kernelSobelX = [
    -1, 0, 1,
    -2, 0, 2,
    -1, 0, 1
];

const kernelSobelY = [
    -1, -2, -1,
    0, 0, 0,
    1, 2, 1
];

const kernelSharpen = [
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0
];

const kernelGaussianBlur = [
    1/16, 2/16, 1/16,
    2/16, 4/16, 2/16,
    1/16, 2/16, 1/16
];

const getPixel = (source, x, y, channel) => {
    // padding
    x = Math.min(source.width - 1, Math.max(0, x));
    y = Math.min(source.height - 1, Math.max(0, y));

    const { data, width } = source;
    const i = (y * width + x) * 4 + channel;
    return data[i];
}

const convolution = (matrix, kernel) => {
    return matrix.reduce((acc, pixel, i) => acc + pixel * kernel[i], 0);
}

const apply3x3Kernel = (source, channels, cb) => {
    const { data, width, height } = source;
    const dist = new Uint8ClampedArray(data.length);

    for(let x = 0 ; x < width ; x++) {
        for(let y = 0 ; y < height ; y++) {
            const pixelIndex = (y * width + x) * 4;

            for(let c = 0 ; c < channels ; c++) {
                const matrix = [
                    getPixel(source, x - 1, y - 1, c), getPixel(source, x, y - 1, c), getPixel(source, x + 1, y - 1, c),
                    getPixel(source, x - 1, y, c), getPixel(source, x, y, c), getPixel(source, x + 1, y, c),
                    getPixel(source, x - 1, y + 1, c), getPixel(source, x, y + 1, c), getPixel(source, x + 1, y + 1, c)
                ];

                for(let j = c ; j < 4 - channels + c; j++) {
                    dist[pixelIndex + j] = cb(matrix);
                }
            }

            dist[pixelIndex + 3] = data[pixelIndex + 3];
        }
    }

    return new ImageData(dist, width, height);
}

export const sharpen = (source) => apply3x3Kernel(source, 3, (matrix) => convolution(matrix, kernelSharpen));
export const gaussianBlur = (source) => apply3x3Kernel(source, 3, (matrix) => convolution(matrix, kernelGaussianBlur));
export const sobelY = (source) => apply3x3Kernel(grayscale(source), 1, (matrix) => convolution(matrix, kernelSobelY));
export const sobelX = (source) => apply3x3Kernel(grayscale(source), 1, (matrix) => convolution(matrix, kernelSobelX));
export const sobel = (source) => apply3x3Kernel(grayscale(source), 1, (matrix) => {
    const gX = convolution(matrix, kernelSobelX);
    const gY = convolution(matrix, kernelSobelY);

    return Math.sqrt(gX**2 + gY**2);
});

// ############################################################
// SIMPLE 3x3 KERNEL EXAMPLE (ONE CHANNEL)

// const img = new ImageData();

// const kernel = [
//     0, 1, 0,
//     1, 5, 1,
//     0, 1, 0
// ]

// const p = (x, y) => img.data[(y * img.width + x) * 4];

// for(let x = 0 ; x < img.width ; x++) {
//     for(let y = 0 ; y < img.height ; y++) {
//         const matrix = [
//             p(x-1, y-1), p(x, y-1), p(x+1, y-1),
//             p(x-1, y), p(x, y), p(x+1, y),
//             p(x-1, y+1), p(x, y+1), p(x+1, y+1)
//         ];

//         let newPixelValue = 0;

//         for(let i = 0 ; i < matrix.length ; i++) {
//             newPixelValue += matrix[i] * kernel[i];
//         }

//         img.data[(y * img.width + x) * 4] = newPixelValue;
//     }
// }
// ############################################################