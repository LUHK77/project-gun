// js/Models/Pistol.js

import { ctx, LARGURA, ALTURA } from '../map.js';
import { Gun, mouse, angulo } from './Gun.js';
// A classe Pistol representa uma arma específica no jogo, herdando da classe Gun e definindo propriedades e métodos específicos para a pistola
export class Pistol extends Gun {
    static spriteIdle   = new Image();
    static framesShot   = [];
    static framesReload = [];

    static carregarSprites() {
        Pistol.spriteIdle.src = `assets/guns/pistol/pistolD.png`;

        for (let i = 0; i <= 7; i++) {
            const img = new Image();
            img.src = `assets/guns/pistol/pistolShot/sprite_${i}.png`;
            Pistol.framesShot.push(img);
        }

        for (let i = 0; i <= 8; i++) {
            const img = new Image();
            img.src = `assets/guns/pistol/pistolReload/sprite_${i}.png`;
            Pistol.framesReload.push(img);
        }
    }
    // Construtor da classe Pistol, inicializando as propriedades específicas da pistola
    constructor() {
        super();
        this.dano = 10;
        this.sprite = 50;
        this.spriteRecoil = 30;
        this.cadencia = 500;
        this.balas = 6;
        this.maxBalas = 6;
        this.tempoRecarga = 2000;
        this.tamanhoBalas = 40;
    }
    // Desenha a pistola na tela, aplicando a animação correta com base no estado de disparo, recarga e na posição do mouse
    draw() {
        const px = LARGURA / 2;
        const py = ALTURA / 2;

        let sprite;
        let tamanho;

        if (this.recarregando) {
            sprite = Pistol.framesReload[this.animacao.frame];
            tamanho = this.spriteRecoil;
        } else if (this.atirando) {
            sprite = Pistol.framesShot[this.animacao.frame];
            tamanho = this.sprite;
        } else {
            sprite = Pistol.spriteIdle;
            tamanho = this.sprite;
        }

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angulo);
        if (mouse.x < px) ctx.scale(1, -1);
        ctx.drawImage(sprite, -15, -tamanho / 2 + 5, tamanho, tamanho);
        ctx.restore();
    }
}

Pistol.carregarSprites();
export const gun = new Pistol();