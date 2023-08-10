const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 144;
canvas.height = 256;
document.body.appendChild(canvas);

const images = {
    bg: { src: "images/background.png", ready: false },
    bird: { src: "images/bird.png", ready: false },
    upper: [{ src: "images/upper.png", ready: false }, { src: "images/upper.png", ready: false }, { src: "images/upper.png", ready: false }],
    lower: [{ src: "images/lower.png", ready: false }, { src: "images/lower.png", ready: false }, { src: "images/lower.png", ready: false }]
};

for (const key in images) {
    if (Array.isArray(images[key])) {
        images[key].forEach(img => {
            img.image = new Image();
            img.image.onload = () => img.ready = true;
            img.image.src = img.src;
        });
    } else {
        images[key].image = new Image();
        images[key].image.onload = () => images[key].ready = true;
        images[key].image.src = images[key].src;
    }
}

const bird = {
    xspeed: 0,
    yspeed: 0,
    xacc: 0,
    yacc: 200,
    x: 2,
    y: 2,
    score: 0
};

const bars = [
    { xspeed: -30, x: 20, y: -100 },
    { xspeed: -30, x: 75, y: -50 },
    { xspeed: -30, x: 130, y: -70 },
    { xspeed: -30, x: 20, y: 150 },
    { xspeed: -30, x: 75, y: 135 },
    { xspeed: -30, x: 130, y: 160 }
];

const keysDown = {};
addEventListener("keydown", e => keysDown[e.keyCode] = true, false);
addEventListener("keyup", e => {
    delete keysDown[e.keyCode];
    isJumping = false;
}, false);

let isJumping = false;
const difficulty = -40;

const update = (modifier) => {
    bird.score += modifier;

    if (38 in keysDown && !isJumping) {
        bird.yspeed = -100;
        isJumping = true;
    }

    bird.x += bird.xspeed * modifier;
    bird.y += bird.yspeed * modifier;
    bird.xspeed += bird.xacc * modifier;
    bird.yspeed += bird.yacc * modifier;

    bars.forEach((bar, index) => {
        bar.x += bar.xspeed * modifier;

        if (bar.x < -25) {
            if (index < 3) {
                bar.y = difficulty + 10 - Math.random() * 50;
            } else {
                bar.y = -difficulty + 160 - Math.random() * 50;
            }
            bar.x = 144;
        }

        // collision detection
        if (bird.y > 256 || (index < 3 && bar.x < 15 && bird.y < bar.y + 135) || (index >= 3 && bar.x < 15 && bird.y > bar.y - 10)) {
            reset();
        }
    });
};

const render = () => {
    if (images.bg.ready) ctx.drawImage(images.bg.image, 0, 0);
    if (images.bird.ready) ctx.drawImage(images.bird.image, bird.x, bird.y);

    bars.forEach((bar, index) => {
        if (index < 3 && images.upper[index].ready) ctx.drawImage(images.upper[index].image, bar.x, bar.y);
        if (index >= 3 && images.lower[index - 3].ready) ctx.drawImage(images.lower[index - 3].image, bar.x, bar.y);
    });

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("score: " + bird.score, 12, 32);
};

const reset = () => {
    bird.xspeed = 0;
    bird.yspeed = 0;
    bird.x = 0;
    bird.y = 120;
    bird.score = 0;
};

const main = () => {
    const now = Date.now();
    const delta = now - then;
    update(delta / 1000);
    render();
    then = now;
    requestAnimationFrame(main);
};

let then = Date.now();
reset();
main();
