import { cloneImageData } from "../canvas";
import { blackAndWhite } from "./colors";
import { sobel } from "./sobel";

export const mask1 = (maskSource, backgroundSource, threshold = 100) => {
    const dist = cloneImageData(backgroundSource);
    const mask = blackAndWhite(maskSource, threshold);

    for (let i = 0; i < dist.data.length; i += 4) {
        const maskVal = mask.data[i];

        if(maskVal === 255) {
            dist.data[i] = maskSource.data[i]; 
            dist.data[i+1] = maskSource.data[i+1]; 
            dist.data[i+2] = maskSource.data[i+2]; 
            dist.data[i+3] = maskSource.data[i+3]; 
        }
    }

    return dist;
}

export const mask2 = (maskSource, backgroundSource, threshold = 100) => {
    const dist = cloneImageData(backgroundSource);
    const mask = blackAndWhite(maskSource, threshold);

    for (let i = 0; i < dist.data.length; i += 4) {
        const maskVal = mask.data[i];
        const y = (i / 4) % mask.width;

        if(maskVal === 255) {
            dist.data[i+2] = 255;
            dist.data[i+3] = y / mask.height * 255;
        }
    }

    return dist;
}

export const mask3 = (maskSource, backgroundSource, threshold = 100) => {
    const dist = cloneImageData(backgroundSource);
    const mask = blackAndWhite(maskSource, threshold);

    for (let i = 0; i < dist.data.length; i += 4) {
        const maskVal = mask.data[i];
    
        if(maskVal != 255) {
            dist.data[i+3] = 0;
        }
    }

    return dist;
}

export const mask4 = (maskSource, backgroundSource, threshold = 100) => {
    const dist = cloneImageData(backgroundSource);
    const edges = blackAndWhite(sobel(maskSource), threshold);

    for (let i = 0; i < dist.data.length; i += 4) {
        const edgesVal = edges.data[i];

        if(edgesVal === 255) {
            dist.data[i] = 255;
            dist.data[i+1] = 255;
            dist.data[i+2] = 255;

        }
    }

    return dist;
}

export const mask5 = (maskSource, backgroundSource, threshold = 100) => {
    const dist = cloneImageData(backgroundSource);
    const mask = blackAndWhite(maskSource, threshold);
    const edges = blackAndWhite(sobel(maskSource), threshold);

    for (let i = 0; i < dist.data.length; i += 4) {
        const maskVal = mask.data[i];
        const edgesVal = edges.data[i];

        if(edgesVal === 255) {
            dist.data[i] = 255;
            dist.data[i+1] = 255;

        } else if(maskVal === 255) {
            dist.data[i] *= Math.random() * 2.55; 
            dist.data[i+1] *= Math.random() * 2.55; 
            dist.data[i+2] *= Math.random() * 2.55; 
        }
    }

    return dist;
}