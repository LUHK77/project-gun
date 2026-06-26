// ZombieBird.js

import { ctx } from '../map.js';
import { player } from './Player.js';
import { Enemy } from './Enemy.js';
import { spawnEnemyBullet } from './Bullet.js';

export class ZombieBird extends Enemy {
    static frames = [];
    static framesDano = [];
    // Carrega os sprites do inimigo Zombie Bird, incluindo os frames normais e os frames de dano
    static carregarSprites() {
        for (let i = 0; i <= 8; i++) {
            const img = new Image();
            img.src = `assets/enemys/zombie_bird/sprite_${i}.png`;
            ZombieBird.frames.push(img);

            const imgDano = new Image();
            imgDano.src = `assets/enemys/zombie_bird/hit/sprite_${i}.png`;
            ZombieBird.framesDano.push(imgDano);
        }
    }
    // Define os atributos específicos do inimigo Zombie Bird
    constructor(x, y) {
        super(x, y);

        this.speed = 1.2;
        this.hp = 40;
        this.damage = 15;
        this.sprite = 64;
        this.xp = 30;

        // ataque à distância
        this.attackCooldown = 2000; // 2 segundos
        this.lastAttack = 0;

        // distância máxima para atacar
        this.attackRange = 300;
    }
    // metodo que atualiza a pocição o Zombie Bird de acordo com a do player
    update(deltaTime) {
        super.update(deltaTime);

        const dist = Math.hypot(
            player.x - this.x,
            player.y - this.y
        );

        const agora = Date.now();
        // verifica se o player esta no renge do ataque e o ataca se estiver
        if (
            dist <= this.attackRange &&
            agora - this.lastAttack >= this.attackCooldown
        ) {
            this.shoot();
            this.lastAttack = agora;
        }
    }
    // metodo de ataque especial a distancia do Zombie Bird
    shoot() {
        const angulo = Math.atan2(
            player.y - this.y,
            player.x - this.x
        );

        spawnEnemyBullet(
            this.x,
            this.y,
            angulo,
            this.damage,
            32
        );
    }
    // Desenha o inimigo Zombie Bird na tela, aplicando a animação correta com base no estado de dano e na posição do jogador
    draw(camX, camY) {
        const piscando =
            Date.now() - this.ultimoDano < 100;

        const frames = piscando
            ? ZombieBird.framesDano
            : ZombieBird.frames;

        ctx.save();

        ctx.translate(
            this.x - camX,
            this.y - camY
        );

        if (player.x < this.x) {
            ctx.scale(-1, 1);
        }

        ctx.drawImage(
            frames[this.animacao.frame],
            -this.sprite / 2,
            -this.sprite / 2,
            this.sprite,
            this.sprite
        );

        ctx.restore();
    }
}

ZombieBird.carregarSprites();