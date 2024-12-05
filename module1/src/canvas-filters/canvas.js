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

export const applyFilterOffscreen = (canvasId, filter, worker) => async (imageData) => {
    const offscreen = document.getElementById(canvasId).transferControlToOffscreen()
    const bitmap = await createImageBitmap(imageData);

    worker.postMessage({ canvas: offscreen, bitmap, filterName: filter.name }, [offscreen]);
}

export const applyAnimation = (canvasId, filter) => (...args) => {
    const ctx = getCanvasContext(canvasId);

    const animation = () => {
        ctx.putImageData(filter.apply(null, args), 0, 0);
        requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
}

export const setCanvasSize = (selector, width, height) => {
    [...document.querySelectorAll(selector)].forEach(canvas => {
        canvas.width = width;
        canvas.height = height;
    });
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