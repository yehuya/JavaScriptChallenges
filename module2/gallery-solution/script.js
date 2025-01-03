window.navigator.serviceWorker.register(new URL('./sw.js', import.meta.url), {
    scope: "/module2/gallery-solution/"
});

const gallery = document.getElementById("gallery");
const urls = [];

for(let i = 0 ; i < 1000000 ; i+= 12345) {
    const color = i.toString(16).padStart(6, '0');
    urls.push(`https://placehold.co/600x600/${color}/FFFFFF/png?no_cache=${new Date().getTime()}`)
}

urls.forEach(url => {
    const img = new Image();
    img.onerror = () => img.parentElement.removeChild(img);
    img.src = url;
    gallery.append(img);
});