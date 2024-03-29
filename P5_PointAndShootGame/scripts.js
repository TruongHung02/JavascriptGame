const canvas = document.getElementById('canvas1');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');
// canvas.width = 800;
canvas.height = 720;
canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
const collisionCanvas = document.getElementById('collisionCanvas');
/** @type {CanvasRenderingContext2D} */
const collisionCtx = collisionCanvas.getContext('2d', {willReadFrequently: true});

// collisionCanvas.width = 800;
collisionCanvas.height = 720;
collisionCanvas.width = window.innerWidth;
// collisionCanvas.height = window.innerHeight;
let score = 0;
let gameOver = false;
ctx.font = '60px Impact';

let timeToNextRaven = 0;
let lastTime = 0;
const ravenInterval = 500;

let ravens = [];
class Raven{
    constructor() {
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.sizeModifier = Math.random() * 0.3 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = 'raven.png';
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;
        this.randomColors = [
            Math.floor(Math.random()*255),
            Math.floor(Math.random()*255),
            Math.floor(Math.random()*255)];
        this.color = `rgb(${this.randomColors[0]},${this.randomColors[1]},${this.randomColors[2]})`;
        this.hasTrail = Math.random() > 0.5;
    }
    update(deltaTime){
        if(this.y < 0 || this.y + this.height > canvas.height){
            this.directionY *= -1;
        }
        this.x -= this.directionX;
        this.y += this.directionY;
        if(this.x < -this.width) this.markedForDeletion = true;
        this.timeSinceFlap += deltaTime;
        if(this.timeSinceFlap > this.flapInterval){
            this.timeSinceFlap = 0;
            this.frame = (++this.frame) % this.maxFrame;
            if(this.hasTrail){
                particles.push(new Particle(this.x, this.y, this.width, this.color))
                particles.push(new Particle(this.x, this.y, this.width, this.color))
                particles.push(new Particle(this.x, this.y, this.width, this.color))
                particles.push(new Particle(this.x, this.y, this.width, this.color))
                particles.push(new Particle(this.x, this.y, this.width, this.color))
                particles.push(new Particle(this.x, this.y, this.width, this.color))
            }
        }
        if(this.x + this.width < 0) gameOver = true;
    }
    draw(){
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height);
    }
}

let explosions = []
class Explosion{
    constructor(x, y, size) {
        this.image = new Image();
        this.image.src = 'boom.png';
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = 'boom.wav';
        this.timeSinceLastFrame = 0;
        this.frameInterval = 100;
        this.markedForDeletion = false;
    }
    update(deltaTime){
        if(this.frame === 0) this.sound.play();
        this.timeSinceLastFrame += deltaTime;
        if(this.timeSinceLastFrame > this.frameInterval){
            ++this.frame;
            this.timeSinceLastFrame = 0;
        }
        if(this.frame > 4) this.markedForDeletion = true;
    }
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.size, this.size);
    }
}

let particles = [];
class Particle{
    constructor(x, y, size, color) {
        this.size = size;
        this.x = x + this.size * 0.5 + Math.random()*50-25;
        this.y = y + this.size * 0.3 + Math.random()*50-25;
        this.radius = Math.random() * this.size * 0.1;
        this.maxRadius = Math.random()*20+35;
        this.markedForDeletion = false;
        this.speedX = Math.random()*1+0.5;
        this.color = color;
    }
    update(){
        this.x += this.speedX;
        this.radius += 0.5;
        if(this.radius > this.maxRadius - 5) this.markedForDeletion = true;
    }
    draw(){
        ctx.save();
        ctx.globalAlpha = 1 - this.radius/this.maxRadius;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function drawScore(){
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 45, 70);
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 50, 75);
}

function drawGameOver(){
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('GAME OVER Score: ' + score, canvas.width/2, canvas.height/2);
    ctx.fillStyle = 'white';
    ctx.fillText('GAME OVER Score: ' + score, canvas.width/2 + 5, canvas.height/2 + 5);
}

window.addEventListener('click', function(e){
    const detectPixelColor = collisionCtx.getImageData(e.offsetX, e.offsetY, 1, 1);
    const pc = detectPixelColor.data;
    ravens.forEach(object => {
        if(object.randomColors[0] == pc[0] &&
            object.randomColors[1] == pc[1] &&
            object.randomColors[2] == pc[2]){
                //collision detected
            object.markedForDeletion = true;
            ++score;
            explosions.push(new Explosion(object.x, object.y, object.width));
        }
    })
})

class Layer{
    constructor() {
        this.width = 2400;
        this.height = 720;
        this.x = 0;
        this.y = 0;
        this.image = new Image();
        this.image.src = 'background_single.png';
        this.speedX = 1;
    }
    update(){
        if(this.x >= 0) this.x = -this.width;
        else this.x += this.speedX;
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}
const layer1 = new Layer();
function animate(timestamp){
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltaTime;
    if(timeToNextRaven > ravenInterval){
        ravens.push(new Raven());
        ravens.sort((a,b) => a - b);
        timeToNextRaven = 0; 
    }
    layer1.update();
    layer1.draw();
    drawScore();
    [...particles, ...ravens, ...explosions].forEach(object => object.update(deltaTime));
    [...particles, ...ravens, ...explosions].forEach(object => object.draw());
    ravens = ravens.filter(object => !object.markedForDeletion);
    explosions = explosions.filter(object => !object.markedForDeletion);
    particles = particles.filter(object => !object.markedForDeletion);
    // if(!gameOver) requestAnimationFrame(animate);
    // else drawGameOver();
    requestAnimationFrame(animate);
}
animate(0);
