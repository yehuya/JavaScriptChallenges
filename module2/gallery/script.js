const gallery = document.getElementById("gallery");
const images = [];

window.addEventListener('load', () => console.timeEnd("PageLoadLoadingTime"))

for(let i = 0 ; i < 100 ; i++) {
    images.push(`https://picsum.photos/id/${i}/500/500?x=${new Date().getTime()}`);
}

images.map(src => {
    const img = new Image();
    img.onerror = () => img.parentElement.removeChild(img);
    img.src = src;
    gallery.append(img);
});

window.addEventListener("load", () => {
    console.log(`Page load time: ${performance.now()}`)
});