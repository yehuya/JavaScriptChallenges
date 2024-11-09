const grayscale = (imageData) => {
    const { data, width, height } = imageData;
    const bit = new Uint8ClampedArray(data.length);

    for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        const gray = red * 0.299 + green * 0.587 + blue * 0.114;
        bit[i] = bit[i + 1] = bit[i + 2] = gray;
        bit[i + 3] = data[i + 3];
    }

    return new ImageData(bit, width, height);
}

const getPixel = (imageData, x, y) => {
    const { data, width } = imageData;
    const i = (y * width + x) * 4;
    return data[i];
}

function gaussianBlur(imageData) {
    const { width, height, data } = imageData;
    const kernel = [
        [1, 4, 7, 4, 1],
        [4, 16, 26, 16, 4],
        [7, 26, 41, 26, 7],
        [4, 16, 26, 16, 4],
        [1, 4, 7, 4, 1]
    ];
    const kernelSize = 5;
    const kernelSum = 273; // Sum of all kernel values
    const halfKernelSize = Math.floor(kernelSize / 2);

    const blurredData = new Uint8ClampedArray(data.length);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0;

            for (let ky = -halfKernelSize; ky <= halfKernelSize; ky++) {
                for (let kx = -halfKernelSize; kx <= halfKernelSize; kx++) {
                    const px = Math.min(width - 1, Math.max(0, x + kx));
                    const py = Math.min(height - 1, Math.max(0, y + ky));
                    const pixelIndex = (py * width + px) * 4;
                    const kernelValue = kernel[ky + halfKernelSize][kx + halfKernelSize];

                    r += data[pixelIndex] * kernelValue;
                    g += data[pixelIndex + 1] * kernelValue;
                    b += data[pixelIndex + 2] * kernelValue;
                }
            }

            const index = (y * width + x) * 4;
            blurredData[index] = r / kernelSum;
            blurredData[index + 1] = g / kernelSum;
            blurredData[index + 2] = b / kernelSum;
            blurredData[index + 3] = data[index + 3]; // Alpha channel
        }
    }

    return new ImageData(blurredData, width, height);
}

function applyDilation(imageData) {
    const { width, height, data } = imageData;
    const dilatedData = new Uint8ClampedArray(data.length);
    const structuringElement = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ];
    const halfSize = Math.floor(structuringElement.length / 2);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let max = 0;

            for (let ky = -halfSize; ky <= halfSize; ky++) {
                for (let kx = -halfSize; kx <= halfSize; kx++) {
                    const px = Math.min(width - 1, Math.max(0, x + kx));
                    const py = Math.min(height - 1, Math.max(0, y + ky));
                    const pixelIndex = (py * width + px) * 4;

                    if (data[pixelIndex] > max) {
                        max = data[pixelIndex];
                    }
                }
            }

            const index = (y * width + x) * 4;
            dilatedData[index] = max;
            dilatedData[index + 1] = max;
            dilatedData[index + 2] = max;
            dilatedData[index + 3] = data[index + 3]; // Alpha channel
        }
    }

    return new ImageData(dilatedData, width, height);
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

const sobel = (imageData) => {
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

    return applyKernel(imageData, (matrix) => {
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

const putImageData = (ctx, imageData) => {
    requestAnimationFrame(() => ctx.putImageData(imageData, 0, 0));
}

self.addEventListener("message", async (event) => {
    console.time("worker"); 
    self.postMessage("Processing image...");

    const { canvas, bitmap } = event.data;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0);
    console.timeLog("worker", "Image drawn");

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const grayscaleData = grayscale(imageData);
    console.timeLog("worker", "Grayscale");

    const blurredData = gaussianBlur(grayscaleData);
    console.timeLog("worker", "Blur");

    const sobelData = sobel(blurredData);
    console.timeLog("worker", "Sobel");

    const dilatedData = applyDilation(blurredData);
    console.timeLog("worker", "Dilation");

    const dilatedData2 = applyDilation(sobelData);
    console.timeLog("worker", "Dilation 2");

    const dilatedData3 = applyDilation(dilatedData2);
    console.timeLog("worker", "Dilation 3");

    putImageData(ctx, dilatedData3);

    console.timeEnd("worker");
    self.postMessage("Image processed!");
});