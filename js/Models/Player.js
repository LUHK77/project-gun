// js/Models/Player.js

import { canvas, ctx, blocoTamanho, ehSolido, LARGURA, ALTURA } from '../map.js';
import { abrirUpgrade } from '../upgradeUI.js';

const retrato = new Image();
retrato.src = "assets/player/retrato.png";
// Classe do player que é responsavel por todas as funções gerais de movimentação e combate
export class Player {
    static framesIdle = [];
    static framesMove = [];
    static framesDamage = [];
    // Carrega os sprites do player que ficam nos arquvos assets
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
    // Atributos basicos do player 
    constructor() {
        this.x = 0;
        this.y = 0;
        this.size = 28;
        this.sprite = 64;
        this.pontosUpgrade = 0;

        this.speed = 1;
        this.hp = 100;
        this.maxHp = 100;

        this.ataque = 10;

        this.level = 1;
        this.xp = 0;

        this.ultimoDano = 0;

        this.retrato = {x: 10, y: 10,w: 60, h: 60};
        
        this.xpProximoLevel = 200; // xp necessário pro próximo level
        // Atributos das animações do player
        this.animacao = {
            frame: 0,
            timer: 0,
            velocidade: 4,
            frames: Player.framesIdle
        };

        this.keys = {};

        window.addEventListener("keydown", (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });

        window.addEventListener("keyup", (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }
    // metodo que realiza o upgrade no player permitindo aumentar seus atributos
    levelUp() {
        this.level++;
        this.xp = 0;
        this.xpProximoLevel = this.level * 100;
        this.pontosUpgrade += 1;
        abrirUpgrade();
    }
    // metodo para aumentar o xp do player
    ganharXP(qtd) {
        this.xp += qtd;
        if (this.xp >= this.xpProximoLevel) {
            this.levelUp();
        }
    }
    // metodo de verificação de colisão do player
    bateu(x, y) {
        const e = Math.floor((x - this.size / 2) / blocoTamanho);
        const d = Math.floor((x + this.size / 2) / blocoTamanho);
        const c = Math.floor((y - 12 - this.size / 2) / blocoTamanho);
        const b = Math.floor((y + 12 + this.size / 2) / blocoTamanho);

        return (
            ehSolido(e, c) ||
            ehSolido(d, c) ||
            ehSolido(e, b) ||
            ehSolido(d, b)
        );
    }
    // metodo para atualiza a animação se ele estiver se movendo ou parado
    updateAnimacao(movendo, dt) {
        this.animacao.timer += dt * 60;

        if (this.animacao.timer >= this.animacao.velocidade) {
            this.animacao.timer = 0;
            this.animacao.frame = (this.animacao.frame + 1) % 9;
        }

        this.animacao.frames = movendo
            ? Player.framesMove
            : Player.framesIdle;
    }
    // metodo que atualiza a posição do player de acordo com sua movimentação
    update(dt) {
        const vel = this.speed * 200 * dt;

        let dx = 0;
        let dy = 0;

        if (this.keys["w"] || this.keys["arrowup"]) dy--;
        if (this.keys["s"] || this.keys["arrowdown"]) dy++;
        if (this.keys["a"] || this.keys["arrowleft"]) dx--;
        if (this.keys["d"] || this.keys["arrowright"]) dx++;

        const movendo = dx !== 0 || dy !== 0;
        this.updateAnimacao(movendo, dt);

        // Impede que o player fique mais rapido na diagonal
        const len = Math.hypot(dx, dy);
        if (len > 0) {
            dx /= len;
            dy /= len;
        }

        const nx = this.x + dx * vel;
        if (!this.bateu(nx, this.y)) this.x = nx;

        const ny = this.y + dy * vel;
        if (!this.bateu(this.x, ny)) this.y = ny;
    }
    // metodo que faz o desenho do player e suas informações na tela
    draw(mouse) {
        const px = LARGURA / 2;
        const py = ALTURA / 2;

        const piscando = Date.now() - this.ultimoDano < 100;
        const frames = piscando ? Player.framesDamage : this.animacao.frames;

        // ======================
        // PLAYER
        // ======================
        ctx.save();
        ctx.translate(px, py);

        if (mouse.x < px) ctx.scale(-1, 1);

        ctx.drawImage(
            frames[this.animacao.frame],
            -this.sprite / 2,
            -this.sprite / 2,
            this.sprite,
            this.sprite
        );

        ctx.restore();

        ctx.drawImage(
            retrato,
            this.retrato.x,
            this.retrato.y,
            this.retrato.w,
            this.retrato.h
        );

        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(
            this.retrato.x,
            this.retrato.y,
            this.retrato.w,
            this.retrato.h
        );

        // ======================
        // HP BAR
        // ======================
        const barraL = 100;
        const barraA = 20;

        ctx.fillStyle = "white";
        ctx.font = "bold 22px GamerFonte";
        const offset = -20;

        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;

        ctx.strokeRect(
            10 + barraL + offset,
            10,
            this.maxHp + 6,
            barraA + 6
        );

        const hpMax = 100;

        ctx.fillStyle = "white";
        ctx.fillRect(
            10 + barraL + offset + 3,
            13,
            (this.hp / hpMax) * barraL,
            barraA
        );

        // ======================
        // XP BAR
        // ======================
        const xpW = 900;
        const xpH = 16;
        const xpX = LARGURA / 2 - xpW / 2;
        const xpY = ALTURA - 30;

        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(xpX, xpY, xpW, xpH);

        ctx.fillStyle = "white";
        ctx.fillRect(
            xpX,
            xpY,
            xpW * (this.xp / this.xpProximoLevel),
            xpH
        );

        ctx.strokeStyle = "white";
        ctx.strokeRect(xpX, xpY, xpW, xpH);

        ctx.fillStyle = "white";
        ctx.font = "bold 22px GamerFonte";
        ctx.textAlign = "center";
        ctx.fillText(`LV ${this.level}`, LARGURA / 2, xpY - 5);
        ctx.textAlign = "left";
    }
}

Player.carregarSprites();

export const player = new Player();