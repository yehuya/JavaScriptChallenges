export const opacity = (source) => {
    const { data, width, height } = source;
    const bits = new Uint8ClampedArray(data.length);

    for (let i = 0; i < bits.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const currentPixel = i / 4;
        const x = currentPixel % width;
        const y = Math.floor(currentPixel / width);

        const opacityY = (y / height) * 255;
        const opacityX = (x / width) * 255;
        const opacityMagnitude = Math.sqrt(opacityX**2 + opacityY **2);

        bits[i] = r;
        bits[i + 1] = g;
        bits[i + 2] = b;
        bits[i + 3] = opacityMagnitude;    
    }

    return new ImageData(bits, width, height);
}