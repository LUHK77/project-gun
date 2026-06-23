// js/Models/Gun.js

import { ctx, canvas } from '../map.js';
import { player } from './Player.js';
import { spawnBullet } from './Bullet.js';

export const mouse = { x: 0, y: 0 };
export let angulo = 0;

window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    angulo = Math.atan2(mouse.y - 850 / 2, mouse.x - 1440 / 2);
});

export class Gun {
    constructor() {
        this.dano = 0;
        this.sprite = 0;
        this.spriteRecoil = 0;
        this.cadencia = 0;
        this.ultimoTiro = 0;
        this.atirando = false;
        this.balas = 0;
        this.maxBalas = 0;
        this.recarregando = false;
        this.tempoRecarga = 0;
        this.inicioRecarga = 0;
        this.tamanhoBalas = 0;

        this.animacao = {
            frame: 0,
            timer: 0,
            velocidade: 3,
        };
    }

    atirar(angulo) {
        if (this.recarregando || this.balas <= 0) return;

        const agora = Date.now();
        if (agora - this.ultimoTiro < this.cadencia) return;

        this.ultimoTiro = agora;
        this.atirando = true;
        this.balas--;
        this.animacao.frame = 0;
        this.animacao.timer = 0;
        spawnBullet(angulo, this.dano, this.tamanhoBalas);

        if (this.balas <= 0) {
            this.recarregando = true;
            this.atirando = false;
            this.inicioRecarga = Date.now();
            this.animacao.frame = 0;
            this.animacao.timer = 0;
        }
    }

    update(deltaTime) {
        const agora = Date.now();

        if (this.recarregando) {
            this.animacao.timer += deltaTime * 60;
            if (this.animacao.timer >= this.animacao.velocidade) {
                this.animacao.timer = 0;
                this.animacao.frame = (this.animacao.frame + 1) % 8;
            }
            if (agora - this.inicioRecarga >= this.tempoRecarga) {
                this.recarregando = false;
                this.balas = this.maxBalas;
                this.animacao.frame = 0;
            }
            return;
        }

        if (this.atirando) {
            this.animacao.timer += deltaTime * 60;
            if (this.animacao.timer >= this.animacao.velocidade) {
                this.animacao.timer = 0;
                this.animacao.frame++;
                if (this.animacao.frame >= 8) {
                    this.animacao.frame = 0;
                    this.atirando = false;
                }
            }
        }
    }

    draw() {}

    drawBarra() {
        const px = 1440 / 2;
        const py = 850  / 2;
        const barraX = px - 20;
        const barraY = py + player.sprite / 2 + 8;
        const barraW = 40;
        const barraH = 6;

        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(barraX, barraY, barraW, barraH);

        ctx.fillStyle = this.recarregando ? "gray" : "white";
        ctx.fillRect(barraX, barraY, barraW * (this.balas / this.maxBalas), barraH);

        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.strokeRect(barraX, barraY, barraW, barraH);
    }
}