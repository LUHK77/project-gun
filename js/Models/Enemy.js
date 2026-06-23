// js/Models/Enemy.js

import { ctx, blocoTamanho, ehSolido } from '../map.js';
import { player } from './Player.js';

export class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 20;
        this.speed = 1;
        this.sprite = 64;
        this.damage = 10;
        this.hp = 40;

        this.animacao = {
            frame: 0,
            timer: 0,
            velocidade: 4,
        };

        this.ultimoAtaque = 0;
        this.ultimoDano = 0;
        this.timerDano = 0;
    }

    bateu(x, y) {
        const esquerda = Math.floor((x - this.size / 2) / blocoTamanho);
        const direita  = Math.floor((x + this.size / 2) / blocoTamanho);
        const cima     = Math.floor((y - 12 - this.size / 2) / blocoTamanho);
        const baixo    = Math.floor((y + 12 + this.size / 2) / blocoTamanho);

        return (
            ehSolido(esquerda, cima)  ||
            ehSolido(direita,  cima)  ||
            ehSolido(esquerda, baixo) ||
            ehSolido(direita,  baixo)
        );
    }

    updateAnimacao(deltaTime) {
        this.animacao.timer += deltaTime * 60;
        if (this.animacao.timer >= this.animacao.velocidade) {
            this.animacao.timer = 0;
            this.animacao.frame = (this.animacao.frame + 1) % 9;
        }
    }

    update(deltaTime) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        this.updateAnimacao(deltaTime);

        if (this.timerDano > 0) this.timerDano--;

        if (dist < (player.size / 2) + (this.size / 2)) {
            const agora = Date.now();
            if (agora - this.ultimoAtaque > 1000) {
                player.hp -= this.damage;
                player.ultimoDano = agora;
                this.ultimoAtaque = agora;
            }
        }

        if (dist < 1) return;

        const vx = (dx / dist) * this.speed * 100 * deltaTime;
        const vy = (dy / dist) * this.speed * 100 * deltaTime;

        if (!this.bateu(this.x + vx, this.y)) this.x += vx;
        if (!this.bateu(this.x, this.y + vy)) this.y += vy;
    }

    draw(camX, camY) {}
}

// ── GERENCIAMENTO ─────────────────────────────────────────────────────────────

export const enemies = [];

export function updateEnemies(deltaTime) {
    for (const e of enemies) e.update(deltaTime);
}

export function drawEnemies() {
    const camX = player.x - 1440 / 2;
    const camY = player.y - 850  / 2;
    for (const e of enemies) e.draw(camX, camY);
}