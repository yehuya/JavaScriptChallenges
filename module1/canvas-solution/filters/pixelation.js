const p = (x, y, c, imageData) => imageData.data[(y * imageData.width + x)*4 + c]; 
const setP = (v, x, y, c, imageData) => imageData.data[(y * imageData.width + x)*4 + c] = v;

export const pixelation = (source, w = 29) => {
    const imageData = structuredClone(source);

    for(let x = 0 ; x < imageData.width ; x+=w) {
        for(let y = 0 ; y < imageData.height ; y+=w) {
            for(let c = 0 ; c < 4 ; c++) {
                const m = [];

                for(let i = x ; i < x+w && i < imageData.width ; i++) {
                    for(let j = y ; j < y+w && j < imageData.height ; j++) {
                        m.push(p(i, j, c, imageData))       
                    }
                }

                const mean = Math.floor(m.reduce((acc, c) => acc + c, 0) / m.length);

                for(let i = x ; i < x+w && i < imageData.width ; i++) {
                    for(let j = y ; j < y+w && j < imageData.height ; j++) {
                        setP(mean, i, j, c, imageData)   
                    }
                }
            }
        }
    }

    return imageData;
} 