// document.addEventListener('load', function(){
const canvas = document.getElementById('canvas1');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 800;

class Game {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.enemies = [];
        this.enemyInterval = 200;
        this.enemyTimer = 0;
        this.enemyTypes = ['worm','ghost','spider'];
    }
    update(deltaTime) {
        this.enemies = this.enemies.filter(object => !object.markedForDeletion);
        if (this.enemyTimer > this.enemyInterval) {
            this.#addNewEnemy();
            this.enemyTimer = 0;
        } else {
            this.enemyTimer += deltaTime;
        }

        this.enemies.forEach(object => object.update(deltaTime));
    }
    draw() {
        this.enemies.forEach(object => object.draw(this.ctx));
    }
    //private method start with #
    #addNewEnemy() {
        const radomEnemy = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
        if(radomEnemy == 'worm') this.enemies.push(new Worm(this));
        if(radomEnemy == 'ghost') this.enemies.push(new Ghost(this));
        if(radomEnemy == 'spider') this.enemies.push(new Spider(this));
        this.enemies.sort((a,b) => a.y - b.y);
    }
}

class Enemy {
    constructor(game) {
        this.game = game;
        console.log(game);
        this.markedForDeletion = false;
        this.frame = 0;
        this.frameInterval = 100;
        this.timeSinceLastFrame = 0;
    }
    update(deltaTime) {
        this.x -= this.vx;
        if (this.x + this.width < 0) this.markedForDeletion = true;
        if (this.y + this.height < 0) this.markedForDeletion = true;
        this.timeSinceLastFrame += deltaTime;
        if(this.timeSinceLastFrame >= this.frameInterval){
            this.frame = (++this.frame) % 6;
            this.timeSinceLastFrame = 0;
        }
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth,this.spriteHeight,
            this.x, this.y, this.width, this.height);
    }
}

class Worm extends Enemy {
    constructor(game) {
        super(game);
        this.spriteWidth = 229;
        this.spriteHeight = 171;
        this.width = this.spriteWidth*0.5;
        this.height = this.spriteHeight*0.5;
        this.x = this.game.width;
        this.y = this.game.height - this.height;
        //access element with js using its id
        this.image = worm;
        this.vx = Math.random() * 2;
    }
}

class Spider extends Enemy {
    constructor(game) {
        super(game);
        this.spriteWidth = 310;
        this.spriteHeight = 175;
        this.width = this.spriteWidth*0.5;
        this.height = this.spriteHeight*0.5;
        this.x = (this.game.width - this.width) * Math.random();
        this.y = 0 - this.height;
        //access element with js using its id
        this.image = spider;
        this.vx = 0;
        this.vy = 1;
        this.maxLength = Math.random() * 0.6 * this.game.height;
    }
    update(deltaTime){
        super.update(deltaTime);
        if(this.y > this.maxLength){
            this.vy *= -1;
        }
        this.y += this.vy;
    }

    draw(ctx){
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.5, 0);
        ctx.lineTo(this.x + this.width * 0.5, this.y);
        ctx.stroke();
        super.draw(ctx);
    }
}

class Ghost extends Enemy {
    constructor(game) {
        super(game);
        this.spriteWidth = 261;
        this.spriteHeight = 209;
        this.width = this.spriteWidth*0.5;
        this.height = this.spriteHeight*0.5;
        this.x = this.game.width;
        this.y = this.game.height * 0.6 * Math.random();
        //access element with js using its id
        this.image = ghost;
        this.vx = Math.random() * 2;
        this.angle = 0;
    }
    update(deltaTime){
        super.update(deltaTime);
        this.y += Math.sin(this.angle);
        this.angle += 0.02;
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = 0.7;
        super.draw(ctx);
        ctx.restore();
    }
}

const game = new Game(ctx, canvas.width, canvas.height);
let lastTime = 1;
function animate(timeStamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    game.update(deltaTime);
    game.draw();
    requestAnimationFrame(animate);
}
animate(0);
// });