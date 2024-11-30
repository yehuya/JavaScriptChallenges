export const noise1 = (source) => {
    const { data, width, height } = source;
    const dist = new Uint8ClampedArray(data.length);

    for (let i = 0; i < dist.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        const currentPixel = i/4;
        const x = currentPixel % width;
        const y = Math.floor(currentPixel / width);

        if(x > width / 4 && x < (width / 4 * 3) && y > height / 4 && y < (height / 4 * 3)) {
            dist[i] = r;
            dist[i + 1] = g;
            dist[i + 2] = b;

        } else {
            dist[i] = Math.random() * 255;
            dist[i + 1] = Math.random() * 255;
            dist[i + 2] = Math.random() * 255;
        }

        dist[i + 3] = a;
    }

    return new ImageData(dist, width, height);
}

export const noise2 = (source) => {
    const { data, width, height } = source;
    const dist = new Uint8ClampedArray(data.length);

    for (let i = 0; i < dist.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        const currentPixel = i/4;
        const x = currentPixel % width;
        const y = Math.floor(currentPixel / width)

        if(x > width / 4 && x < (width / 4 * 3) && y > height / 4 && y < (height / 4 * 3)) {
            dist[i] = r;
            dist[i + 1] = g;
            dist[i + 2] = b;

        } else {
            dist[i] = Math.random() * 1000;
            dist[i + 1] = Math.random() * 1000;
            dist[i + 2] = Math.random() * 1000;
        }

        dist[i + 3] = a;
    }

    return new ImageData(dist, width, height);
}

export const noise3 = (source) => {
    const { data, width, height } = source;
    const dist = new Uint8ClampedArray(data.length);

    for (let i = 0; i < dist.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        const currentPixel = i/4;
        const x = currentPixel % width;
        const y = Math.floor(currentPixel / width)

        if(x > width / 4 && x < (width / 4 * 3) && y > height / 4 && y < (height / 4 * 3)) {
            dist[i] = r;
            dist[i + 1] = g;
            dist[i + 2] = b;

        } else {
            const val = Math.random() * 255 > 128 ? 255 : 0;
            
            dist[i] = val;
            dist[i + 1] = val;
            dist[i + 2] = val;
        }

        dist[i + 3] = a;
    }

    return new ImageData(dist, width, height);
}

export const noise4 = (source) => {
    const { data, width, height } = source;
    const bits = new Uint8ClampedArray(data.length);

    for (let i = 0; i < bits.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        bits[i] = r * Math.random() * 2.55;
        bits[i + 1] = g * Math.random() * 2.55;
        bits[i + 2] = b * Math.random() * 2.55;    
        bits[i + 3] = a;
    }

    return new ImageData(bits, width, height);
}