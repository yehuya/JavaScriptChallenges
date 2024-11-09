
const message = document.getElementById("message");
const file = document.getElementById("file");
const img = document.getElementById("img")
const app = document.getElementById("app");
const clock = document.getElementById("clock");

const worker = new Worker(new URL("./worker.js", import.meta.url));
worker.onmessage = (event) => {
    message.textContent = event.data;
}

document.addEventListener("DOMContentLoaded", () => {
    setInterval(() => {
        const date = new Date();
        const hours = `${date.getHours()}0`.slice(0, 2);
        const minutes = `${date.getMinutes()}0`.slice(0, 2);
        const seconds = `${date.getSeconds()}0`.slice(0, 2);
        const milliseconds = `${date.getMilliseconds()}000`.slice(0, 3);

        clock.textContent = `${hours}:${minutes}:${seconds}.${milliseconds}`;
    });
});

file.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
        const canvas = document.createElement("canvas");
        const img = new Image();

        app.innerHTML = "";
        app.appendChild(img);
        app.appendChild(canvas);
  
        img.onload = async () => {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            const offscreen = canvas.transferControlToOffscreen();
            const bitmap = await createImageBitmap(img);
            
            worker.postMessage({ canvas: offscreen, bitmap }, [offscreen]);
        }

        img.src = event.target.result;      
    }

    reader.readAsDataURL(file);
});