import flowerSrc from "../canvas-solution/images/flower.jpg";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const flower = new Image();
flower.src = flowerSrc;
flower.crossOrigin = "Anonymous";

flower.onload = () => {
    canvas.width = flower.width;
    canvas.height = flower.height;
    ctx.drawImage(flower, 0, 0);
};