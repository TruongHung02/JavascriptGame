const canvas = document.getElementById('canvas1');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');
CANVAS_WIDTH = canvas.width = 500;
CANVAS_HEIGHT = canvas.height = 1000;
const numberOfEnemies = 10;
const enemiesArray = [];

let gameFrame = 0;

class Enemy {
    constructor(){
        this.image = new Image();
        this.image.src = 'enemies/enemy2.png';
        this.speed = Math.random() * 2;
        this.spriteWidth = 266;
        this.spriteHeight = 188;
        this.width = this.spriteWidth / 3;
        this.height = this.spriteHeight / 3;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        this.spriteFrames = 6;
        this.flapSpeed = Math.random()*4+1;
        this.angle = 0.2;
        this.angleSpeed = Math.random() * 0.2;
        this.curve = Math.random() * 7;
    }
    update(){
        if(gameFrame % 2 == 0)
        {
            this.x -= this.speed;
            this.y += this.curve * Math.sin(this.angle);
            this.angle += this.angleSpeed;
            if(this.x + this.width < 0){
                this.x = canvas.width;
            }
        }
    }
    draw(){
        let frameX = Math.floor(gameFrame/this.flapSpeed) % this.spriteFrames * this.spriteWidth;
        let frameY = 0;
        ctx.drawImage(this.image, frameX, frameY, this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height);
    }
}
// const enemy1 = new Enemy();
for(let i=0;i<numberOfEnemies;i++){
    enemiesArray.push(new Enemy());
}

function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    for(let i=0;i<numberOfEnemies;i++){
        enemiesArray[i].update();
        enemiesArray[i].draw();
    }
    gameFrame++;
    requestAnimationFrame(animate)
}

animate();