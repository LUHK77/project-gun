//js/Models/EvilBunny.js
import { ctx } from '../map.js';
import { player } from './Player.js';
import { Enemy } from './Enemy.js';

export class EvilBunny extends Enemy {
    static frames      = [];
    static framesDano  = [];
    // Carrega os sprites do inimigo EvilBunny, incluindo os frames normais e os frames de dano
    static carregarSprites() {
        for (let i = 0; i <= 8; i++) {
            const img = new Image();
            img.src = `assets/enemys/evil_bunny/sprite_${i}.png`;
            EvilBunny.frames.push(img);

            const imgDano = new Image();
            imgDano.src = `assets/enemys/evil_bunny/hit/sprite_${i}.png`;
            EvilBunny.framesDano.push(imgDano);
        }
    }
    // Define os atributos específicos do inimigo EvilBunny
    constructor(x, y) {
        super(x, y);
        this.speed  = 2.5;
        this.hp     = 40;
        this.damage = 35;
        this.sprite = 64;
        this.xp    = 40;
    }
    // Desenha o inimigo EvilBunny na tela, aplicando a animação correta com base no estado de dano e na posição do jogador
    draw(camX, camY) {
        const piscando = Date.now() - this.ultimoDano < 100;
        const frames = piscando ? EvilBunny.framesDano : EvilBunny.frames;

        ctx.save();
        ctx.translate(this.x - camX, this.y - camY);
        if (player.x < this.x) ctx.scale(-1, 1);
        ctx.drawImage(frames[this.animacao.frame], -this.sprite / 2, -this.sprite / 2, this.sprite, this.sprite);
        ctx.restore();
    }
}

EvilBunny.carregarSprites();