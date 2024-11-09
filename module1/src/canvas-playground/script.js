const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const lenna = new Image();
lenna.src = "https://upload.wikimedia.org/wikipedia/en/7/7d/Lenna_%28test_image%29.png";
lenna.crossOrigin = "Anonymous";

lenna.onload = () => {
    canvas.width = lenna.width;
    canvas.height = lenna.height;
    ctx.drawImage(lenna, 0, 0);
};