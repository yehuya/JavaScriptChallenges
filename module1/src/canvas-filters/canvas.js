export const getCanvasContext = (id) => {
    const canvas = document.getElementById(id);
    return canvas.getContext("2d");
}

export const cloneImageData = (imageData) => structuredClone(imageData);

export const filter = (canvasId, filter) => (imageData) => {
    const ctx = getCanvasContext(canvasId);
    filter(imageData, ctx);
}

export const applyFilter = (canvasId, filter) => (...args) => {
    const ctx = getCanvasContext(canvasId);
    ctx.putImageData(filter.apply(null, args), 0, 0);
}

export const applyAnimation = (canvasId, filter, timeout = 100) => (...args) => {
    const animation = () => {
        const ctx = getCanvasContext(canvasId);
        ctx.putImageData(filter.apply(null, args), 0, 0);
    
        setTimeout(() => requestAnimationFrame(animation), timeout);
    }

    requestAnimationFrame(animation);
}

export const loadImages = (arr) => {
    const images = arr.map(src => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.crossOrigin = "Anonymous";
            img.onload = () => resolve(img);
        });
    });

    return Promise.all(images);
}