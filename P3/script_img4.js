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
        this.image.src = 'enemies/enemy4.png';
        this.speed = Math.floor(Math.random() * 200 + 50);
        this.spriteWidth = 213;
        this.spriteHeight = 213;
        this.width = this.spriteWidth / 3;
        this.height = this.spriteHeight / 3;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        this.newX = Math.random() * (canvas.width - this.width);
        this.newY = Math.random() * (canvas.height - this.height);
        this.spriteFrames = 6;
        this.flapSpeed = Math.random()*4+1;
    }
    update(){
        if(gameFrame % 250 == 0){
            this.newX = Math.random() * (canvas.width);
            this.newY = Math.random() * (canvas.height);
        }
        let dx = this.x - this.newX;
        let dy = this.y - this.newY;
        this.x -= dx/this.speed;
        this.y -= dy/this.speed;

        // Enemies go toward mouse
        // if(gameFrame % 120 == 0){
        //     // console.log(this.newX,this.newY);
        //     canvas.addEventListener("mousemove", (e) => {
        //         this.newX = e.offsetX;
        //         this.newY = e.offsetY;
        //     });
        // }
        // this.x = this.newX - this.width/2;
        // this.y = this.newY - this.height/2;
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

console.log(enemiesArray);

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