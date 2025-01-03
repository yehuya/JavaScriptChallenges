// Add your code here
// .....


/// ###################################################### DON'T EDIT ###################################################### ///
const loadTime = document.getElementById("loadTime");
const gallery = document.getElementById("gallery");
const urls = [];

for(let i = 0 ; i < 1000000 ; i+= 12345) {
    const color = i.toString(16).padStart(6, '0');
    urls.push(`https://placehold.co/600x600/${color}/FFFFFF/png?text=Cache&no_cache=${new Date().getTime()}`)
}

const images = urls.map((url) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => {
        img.parentElement.removeChild(img)
        reject();
    };
    img.onload = () => resolve();
    img.src = url;

    gallery.append(img);
}));

Promise.allSettled(images).then(() => {
    loadTime.innerText = `Images load time: ${performance.now()}`;
});
/// ###################################################### DON'T EDIT ###################################################### ///