export const getCanvasContext = (id) => {
    const canvas = document.getElementById(id);
    return canvas.getContext("2d");
}

export const cloneImageData = (imageData) => structuredClone(imageData);

export const filter = (canvasId, filter) => (imageData) => {
    const ctx = getCanvasContext(canvasId);
    filter(imageData, ctx);
}

export const applyFilter = (canvasId, filter) => (imageData) => {
    const ctx = getCanvasContext(canvasId);
    ctx.putImageData(filter(imageData), 0, 0);
}

export const applyAnimation = (canvasId, filter, timeout = 100) => (imageData) => {
    const animation = () => {
        const ctx = getCanvasContext(canvasId);
        ctx.putImageData(filter(imageData), 0, 0);
    
        setTimeout(() => requestAnimationFrame(animation), timeout);
    }

    requestAnimationFrame(animation);
}