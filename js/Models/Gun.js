// js/Models/Gun.js

import { ctx, canvas, LARGURA, ALTURA } from '../map.js';
import { player } from './Player.js';
import { spawnBullet } from './Bullet.js';

export const mouse = { x: 0, y: 0 };
export let angulo = 0;

// Atualiza a posição do mouse e calcula o ângulo em relação ao centro do canvas
window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    angulo = Math.atan2(mouse.y - ALTURA / 2, mouse.x - LARGURA / 2);
});

// Classe Gun representa uma arma no jogo, com propriedades e métodos
export class Gun {
    constructor() {
        this.dano = 0; // Dano da arma
        this.sprite = 0; // Sprite da arma
        this.spriteRecoil = 0; // Sprite da arma recarregando
        this.cadencia = 0; // velocidade de cada disparo
        this.ultimoTiro = 0; // Timestamp do último disparo
        this.atirando = false; // Indica se a arma está atirando
        this.segurando = false; // Indica se o botão de disparo está sendo pressionado
        this.balas = 0; // Número de balas restantes
        this.maxBalas = 0; // Número máximo de balas
        this.recarregando = false; // Indica se a arma está recarregando
        this.tempoRecarga = 0; // Tempo necessário para recarregar a arma
        this.inicioRecarga = 0; // Timestamp do início da recarga
        this.tamanhoBalas = 0; // Tamanho das balas disparadas pela arma
        
        // Propriedades de animação da arma
        this.animacao = {
            frame: 0, // Frame atual da animação
            timer: 0, // Timer para controlar a velocidade da animação
            velocidade: 2, // Velocidade da animação
        };
    }

    recarregar() {
        if (this.recarregando || this.balas >= this.maxBalas) return; // evita recarregar à toa
        this.recarregando = true;
        this.atirando = false;
        this.inicioRecarga = Date.now();
        this.animacao.frame = 0;
        this.animacao.timer = 0;
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
            this.recarregar();
        }
    }

    update(deltaTime, angulo) {
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

        // Atira automaticamente enquanto segura o botão
        if (this.segurando) {
            this.atirar(angulo); // precisa receber angulo aqui
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
        const px = LARGURA / 2;
        const py = ALTURA / 2;
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