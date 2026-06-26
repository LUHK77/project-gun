// zombie.js
import { ctx } from '../map.js';
import { player } from './Player.js';
import { Enemy } from './Enemy.js';

export class Zombie extends Enemy {
    static frames      = [];
    static framesDano  = [];
    // Carrega os sprites do inimigo Zombie, incluindo os frames normais e os frames de dano
    static carregarSprites() {
        for (let i = 0; i <= 8; i++) {
            const img = new Image();
            img.src = `assets/enemys/zombie/sprite_${i}.png`;
            Zombie.frames.push(img);

            const imgDano = new Image();
            imgDano.src = `assets/enemys/zombie/hit/sprite_${i}.png`;
            Zombie.framesDano.push(imgDano);
        }
    }
    // Define os atributos específicos do inimigo Zombie
    constructor(x, y) {
        super(x, y);
        this.speed  = 1;
        this.hp     = 40;
        this.damage = 10;
        this.sprite = 64;
        this.xp    = 20;
    }
    // Desenha o inimigo Zombie na tela, aplicando a animação correta com base no estado de dano e na posição do jogador
    draw(camX, camY) {
        const piscando = Date.now() - this.ultimoDano < 100;
        const frames = piscando ? Zombie.framesDano : Zombie.frames;

        ctx.save();
        ctx.translate(this.x - camX, this.y - camY);
        if (player.x < this.x) ctx.scale(-1, 1);
        ctx.drawImage(frames[this.animacao.frame], -this.sprite / 2, -this.sprite / 2, this.sprite, this.sprite);
        ctx.restore();
    }
}

Zombie.carregarSprites();