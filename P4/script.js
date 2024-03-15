const canvas = document.getElementById('canvas1');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 700;
const explosions = []

let gameFrame = 0;

class Explosion{
    constructor(x, y) {
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.width = this.spriteWidth*0.5;
        this.height = this.spriteHeight*0.5;
        this.x = x - this.width * 0.5;
        this.y = y - this.height * 0.5;
        this.image = new Image();
        this.image.src = 'boom.png';
        this.sound = new Audio();
        this.sound.src = 'boom.wav';
        this.frame = 0;
    }
    update(){
        if(this.frame == 0) this.sound.play();
        if(gameFrame % 10 == 0){
            ++this.frame;
        }
    }
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height );
    }
}

canvas.addEventListener("click", function(e){
    createAnimation(e);
});
// canvas.addEventListener("mousemove", function(e){
//     createAnimation(e);
// });

function createAnimation(e){
    explosions.push(new Explosion(e.offsetX, e.offsetY));
}
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i=0; i < explosions.length; ++i){
        explosions[i].update();
        if(explosions[i].frame > 4){
            explosions.splice(i,1);
            --i;
            continue;
        }
        explosions[i].draw();
    }
    gameFrame++;
    requestAnimationFrame(animate);
}

animate();