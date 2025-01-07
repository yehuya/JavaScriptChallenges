if("serviceWorker" in window.navigator) {
    try {
        const registration = await window.navigator.serviceWorker.register(new URL('./sw.js', import.meta.url), {
            scope: "/module2/gallery/solution/"
        });

        if (registration.installing) {
            console.log("Service worker installing");
        } else if (registration.waiting) {
            console.log("Service worker installed");
        } else if (registration.active) {
            console.log("Service worker active");
        }

    } catch(e) {
        console.log(`Service worker registration failed with ${e}`);
    }
}

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