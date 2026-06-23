// js/Models/Player.js

import { canvas, ctx, blocoTamanho, ehSolido } from '../map.js';

export class Player {
    static framesIdle   = [];
    static framesMove   = [];
    static framesDamage = [];

    static carregarSprites() {
        for (let i = 0; i <= 8; i++) {
            const idle = new Image();
            idle.src = `assets/player/PlayerDefault/sprite_${i}.png`;
            Player.framesIdle.push(idle);

            const move = new Image();
            move.src = `assets/player/PlayerMove/sprite_${i}.png`;
            Player.framesMove.push(move);

            const damage = new Image();
            damage.src = `assets/enemys/zombie/hit/sprite_${i}.png`;
            Player.framesDamage.push(damage);
        }
    }

    constructor() {
        this.x = 0;
        this.y = 0;
        this.size = 28;
        this.sprite = 64;
        this.speed = 0.8;
        this.hp = 100;
        this.ultimoDano = 0;

        this.animacao = {
            frame: 0,
            timer: 0,
            velocidade: 4,
            frames: Player.framesIdle,
        };

        this.keys = {};
        window.addEventListener("keydown", (e) => { this.keys[e.key.toLowerCase()] = true; });
        window.addEventListener("keyup",   (e) => { this.keys[e.key.toLowerCase()] = false; });
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

    updateAnimacao(movendo, deltaTime) {
        this.animacao.timer += deltaTime * 60;
        if (this.animacao.timer >= this.animacao.velocidade) {
            this.animacao.timer = 0;
            this.animacao.frame = (this.animacao.frame + 1) % 9;
        }
        this.animacao.frames = movendo ? Player.framesMove : Player.framesIdle;
    }

    update(deltaTime, mouse) {
        const velocidade = this.speed * 200 * deltaTime;

        let dx = 0;
        let dy = 0;

        if (this.keys["w"] || this.keys["arrowup"])    dy--;
        if (this.keys["s"] || this.keys["arrowdown"])  dy++;
        if (this.keys["a"] || this.keys["arrowleft"])  dx--;
        if (this.keys["d"] || this.keys["arrowright"]) dx++;

        const movendo = dx !== 0 || dy !== 0;
        this.updateAnimacao(movendo, deltaTime);

        const tamanho = Math.sqrt(dx * dx + dy * dy);
        if (tamanho > 0) { dx /= tamanho; dy /= tamanho; }

        const novoX = this.x + dx * velocidade;
        if (!this.bateu(novoX, this.y)) this.x = novoX;

        const novoY = this.y + dy * velocidade;
        if (!this.bateu(this.x, novoY)) this.y = novoY;
    }

    draw(mouse) {
        const px = 1440 / 2;
        const py = 850  / 2;

        const piscando = Date.now() - this.ultimoDano < 100;
        const frames = piscando ? Player.framesDamage : this.animacao.frames;

        ctx.save();
        ctx.translate(px, py);
        if (mouse.x < px) ctx.scale(-1, 1);
        ctx.drawImage(frames[this.animacao.frame], -this.sprite / 2, -this.sprite / 2, this.sprite, this.sprite);
        ctx.restore();

        // Barra de vida
        const barraL = 100;
        const barraA = 20;

        ctx.fillStyle = "white";
        ctx.font = "bold 22px GamerFonte";
        ctx.fillText("HP:", 65, 11 + barraA);

        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(10 + barraL, 10, barraL + 6, barraA + 6);

        ctx.fillStyle = "white";
        ctx.fillRect(10 + barraL + 3, 13, this.hp, barraA);
    }
}

Player.carregarSprites();

export const player = new Player();