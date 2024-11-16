const lenna = new Image();
lenna.src = "https://upload.wikimedia.org/wikipedia/en/7/7d/Lenna_%28test_image%29.png";
lenna.crossOrigin = "Anonymous";

const getCanvasContext = (id) => {
    const canvas = document.getElementById(id);
    return canvas.getContext("2d");
}

const red = (imageData) => {
    const { data, width, height } = imageData;
    const ctx = getCanvasContext("red")
    const bits = new Uint8ClampedArray(data.length);

    for (let i = 0; i < bits.length; i += 4) {
        bits[i] = 255;
        bits[i + 1] = data[i+1];
        bits[i + 2] = data[i+2];
        bits[i + 3] = data[i+3];
    }

    ctx.putImageData(new ImageData(bits, width, height), 0, 0);
}

const grayscale = (imageData) => {
    const { data, width, height } = imageData;
    const ctx = getCanvasContext("grayscale")
    const bits = new Uint8ClampedArray(data.length);

    for (let i = 0; i < bits.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        const gray = r * 0.299 + g * 0.587 + b * 0.114;
        bits[i] = bits[i + 1] = bits[i + 2] = gray;
        bits[i + 3] = a;
    }

    ctx.putImageData(new ImageData(bits, width, height), 0, 0);
}

const blackwhite = (imageData) => {
    const { data, width, height } = imageData;
    const ctx = getCanvasContext("blackwhite")
    const bits = new Uint8ClampedArray(data.length);

    for (let i = 0; i < bits.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        const gray = r * 0.299 + g * 0.587 + b * 0.114;
        bits[i] = bits[i + 1] = bits[i + 2] = gray > 130 ? 255 : 0;
        bits[i + 3] = a;
    }

    ctx.putImageData(new ImageData(bits, width, height), 0, 0);
}

const sepia = (imageData) => {
    const { data, width, height } = imageData;
    const ctx = getCanvasContext("sepia")
    const bits = new Uint8ClampedArray(data.length);

    for (let i = 0; i < bits.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        const newRed = 0.393 * r + 0.769 * g + 0.189 * b
        const newGreen = 0.349 * r + 0.686 * g + 0.168 * b
        const newBlue = 0.272 * r + 0.534 * g + 0.131 * b

        bits[i] = newRed;
        bits[i + 1] = newGreen;
        bits[i + 2] = newBlue
        bits[i + 3] = a;
    }

    ctx.putImageData(new ImageData(bits, width, height), 0, 0);
}

const noise = (imageData) => {
    const { data, width, height } = imageData;
    const ctx = getCanvasContext("noise")
    const bits = new Uint8ClampedArray(data.length);

    for (let i = 0; i < bits.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        const currentPixel = i/4;
        const x = currentPixel % width;
        const y = (currentPixel - x) / width;

        if(x > width / 4 && x < (width / 4 * 3) && y > height / 4 && y < (height / 4 * 3)) {
            bits[i] = r;
            bits[i + 1] = g;
            bits[i + 2] = b;

        } else {
            bits[i] = Math.random() * 255;
            bits[i + 1] = Math.random() * 255;
            bits[i + 2] = Math.random() * 255;
        }

        bits[i + 3] = a;
    }

    ctx.putImageData(new ImageData(bits, width, height), 0, 0);
}

const noise2 = (imageData) => {
    const { data, width, height } = imageData;
    const ctx = getCanvasContext("noise2")
    const bits = new Uint8ClampedArray(data.length);

    for (let i = 0; i < bits.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        const currentPixel = i/4;
        const x = currentPixel % width;
        const y = (currentPixel - x) / width;

        if(x > width / 4 && x < (width / 4 * 3) && y > height / 4 && y < (height / 4 * 3)) {
            bits[i] = r;
            bits[i + 1] = g;
            bits[i + 2] = b;

        } else {
            bits[i] = Math.random() * 1000;
            bits[i + 1] = Math.random() * 1000;
            bits[i + 2] = Math.random() * 1000;
        }

        bits[i + 3] = a;
    }

    ctx.putImageData(new ImageData(bits, width, height), 0, 0);
}

const noise3 = (imageData) => {
    const { data, width, height } = imageData;
    const ctx = getCanvasContext("noise3")
    const bits = new Uint8ClampedArray(data.length);

    const animation = () => {
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

        ctx.putImageData(new ImageData(bits, width, height), 0, 0);
        
        setTimeout(() => {
            requestAnimationFrame(animation)
        }, 100);
    }

    requestAnimationFrame(animation)
}

const opacity = (imageData) => {
    const { data, width, height } = imageData;
    const ctx = getCanvasContext("opacity")
    const bits = new Uint8ClampedArray(data.length);

    for (let i = 0; i < bits.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        const currentPixel = i/4;
        const x = currentPixel % width;
        const y = (currentPixel - x) / width;

        const opacityY = (y / height) * 255;
        const opacityX = (x / width) * 255;
        const opacityMagnitude = Math.sqrt(opacityX**2 + opacityY **2);

        bits[i] = r;
        bits[i + 1] = g;
        bits[i + 2] = b;
        bits[i + 3] = opacityMagnitude;    
    }

    ctx.putImageData(new ImageData(bits, width, height), 0, 0);
}

const microsoft = (imageData) => {
    const { data, width, height } = imageData;
    const ctx = getCanvasContext("microsoft")
    const bits = new Uint8ClampedArray(data.length);

    for (let i = 0; i < bits.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        const currentPixel = i/4;
        const x = currentPixel % width;
        const y = (currentPixel - x) / width;

        if(x < width / 2 && y < height / 2) {
            bits[i] = 255;
            bits[i + 1] = g;
            bits[i + 2] = b;
        } else if(x > width / 2 && y < height / 2) {
            bits[i] = r;
            bits[i + 1] = 255;
            bits[i + 2] = b;
        } else if(x < width / 2 && y >  height / 2) {
            bits[i] = r;
            bits[i + 1] = g;
            bits[i + 2] = 255;
        } else if(x > width / 2 && y > height / 2) {
            bits[i] = r * 2;
            bits[i + 1] = g * 2;
            bits[i + 2] = 0;
        } else {
            bits[i] = 255;
            bits[i + 1] = 255;
            bits[i + 2] = 255;
        }

        bits[i + 3] = a;
    }

    ctx.putImageData(new ImageData(bits, width, height), 0, 0);
}

lenna.onload = () => {
    const canvas = document.getElementById("original");
    const ctx = canvas.getContext("2d");
    const canvases = [...document.querySelectorAll("canvas")]
    canvases.forEach(canvas => {
        canvas.width = lenna.width;
        canvas.height = lenna.height;
    });

    ctx.drawImage(lenna, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    red(imageData);
    grayscale(imageData);
    blackwhite(imageData);
    sepia(imageData);
    microsoft(imageData);
    noise(imageData);
    noise2(imageData);
    noise3(imageData);
    opacity(imageData);
};