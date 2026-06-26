// ZombieBird.js

import { ctx } from '../map.js';
import { player } from './Player.js';
import { Enemy } from './Enemy.js';
import { spawnEnemyBullet } from './Bullet.js';

export class ZombieBird extends Enemy {
    static frames = [];
    static framesDano = [];

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

    update(deltaTime) {
        super.update(deltaTime);

        const dist = Math.hypot(
            player.x - this.x,
            player.y - this.y
        );

        const agora = Date.now();

        if (
            dist <= this.attackRange &&
            agora - this.lastAttack >= this.attackCooldown
        ) {
            this.shoot();
            this.lastAttack = agora;
        }
    }

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