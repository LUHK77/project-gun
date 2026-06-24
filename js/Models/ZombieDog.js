// zombie.js
import { ctx } from '../map.js';
import { player } from './Player.js';
import { Enemy } from './Enemy.js';

export class ZombieDog extends Enemy {
    static frames      = [];
    static framesDano  = [];

    static carregarSprites() {
        for (let i = 0; i <= 8; i++) {
            const img = new Image();
            img.src = `assets/enemys/zombie_dog/sprite_${i}.png`;
            ZombieDog.frames.push(img);

            const imgDano = new Image();
            imgDano.src = `assets/enemys/zombie_dog/hit/sprite_${i}.png`;
            ZombieDog.framesDano.push(imgDano);
        }
    }

    constructor(x, y) {
        super(x, y);
        this.speed  = 1.7;
        this.hp     = 120;
        this.damage = 30;
        this.sprite = 96;
        this.size = 30;
        this.exp = 60;
    }

    draw(camX, camY) {
        const piscando = Date.now() - this.ultimoDano < 100;
        const frames = piscando ? ZombieDog.framesDano : ZombieDog.frames;

        ctx.save();
        ctx.translate(this.x - camX, this.y - camY);
        if (player.x < this.x) ctx.scale(-1, 1);
        ctx.drawImage(frames[this.animacao.frame], -this.sprite / 2, -this.sprite / 2, this.sprite, this.sprite);
        ctx.restore();
    }
}

ZombieDog.carregarSprites();