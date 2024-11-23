import { cloneImageData } from "../canvas";

export const red = (source) => {
    const dist = cloneImageData(source);

    for (let i = 0; i < dist.data.length; i += 4) {
        dist.data[i] = 255;
    }

    return dist;
}

export const green = (source) => {
    const dist = cloneImageData(source);
    
    for (let i = 0; i < dist.data.length; i += 4) {
        dist.data[i+1] = 255;
    }

    return dist;
}

export const blue = (source) => {
    const dist = cloneImageData(source);
    
    for (let i = 0; i < dist.data.length; i += 4) {
        dist.data[i+2] = 255;
    }

    return dist;
}

export const yellow = (source) => {
    const dist = cloneImageData(source);
    
    for (let i = 0; i < dist.data.length; i += 4) {
        dist.data[i] *= 2.5;
        dist.data[i+1] *= 2.5;
        dist.data[i+2] = 0;
    }

    return dist;
}

export const invert = (source) => {
    const dist = cloneImageData(source);
    const { data } = dist;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i+1];
        data[i + 2] = 255 - data[i+2];
    }

    return dist;
}

export const grayscale = (source) => {
    const { data, width, height } = source;
    const arr = new Uint8ClampedArray(data.length);

    for (let i = 0; i < arr.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        const gray = r * 0.299 + g * 0.587 + b * 0.114;
        arr[i] = arr[i + 1] = arr[i + 2] = gray;
        arr[i + 3] = a;
    }

    return new ImageData(arr, width, height);
}

export const blackAndWhite = (source, threshold = 130) => {
    const dist = grayscale(source);
    const { data } = dist;

    for (let i = 0; i < data.length; i += 4) {
        const val = data[i];
     
        data[i] = data[i + 1] = data[i + 2] = val > threshold ? 255 : 0;
    }

    return dist;
}

export const sepia = (source) => {
    const { data, width, height } = source;
    const dist = new Uint8ClampedArray(data.length);

    for (let i = 0; i < dist.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        dist[i] = 0.393 * r + 0.769 * g + 0.189 * b;
        dist[i + 1] = 0.349 * r + 0.686 * g + 0.168 * b;
        dist[i + 2] = 0.272 * r + 0.534 * g + 0.131 * b;
        dist[i + 3] = a;
    }

    return new ImageData(dist, width, height);
}