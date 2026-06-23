// js/ui.js

import { ctx, canvas } from './map.js';
import { player } from './Models/Player.js';
import { enemies } from './Models/Enemy.js';
import { gun } from './Models/Pistol.js';

const largura = 1440;
const altura  = 850;

let timerMorte = 0;
let tempoInicio = Date.now();
let tempoJogo = 0;

export let taxaSpawn = 3000;
export let intervalSpawn = null;

// ── TIMER ─────────────────────────────────────────────────────────────────────

export function updateTimer(spawnEnemy) {
    if (player.hp > 0) {
        tempoJogo = Math.floor((Date.now() - tempoInicio) / 1000);

        const novasTaxa = Math.max(500, 3000 - Math.floor(tempoJogo / 60) * 500);
        if (novasTaxa !== taxaSpawn) {
            taxaSpawn = novasTaxa;
            clearInterval(intervalSpawn);
            intervalSpawn = setInterval(spawnEnemy, taxaSpawn);
        }
    }
}

export function drawTimer() {
    const minutos  = Math.floor(tempoJogo / 60).toString().padStart(2, "0");
    const segundos = (tempoJogo % 60).toString().padStart(2, "0");

    ctx.fillStyle = "white";
    ctx.font = "bold 32px GamerFonte";
    ctx.textAlign = "center";
    ctx.fillText(`${minutos}:${segundos}`, largura / 2, 40);
    ctx.textAlign = "left";
}

// ── GAME OVER ─────────────────────────────────────────────────────────────────

export function drawGameOver() {
    timerMorte++;

    ctx.fillStyle = "rgba(20, 20, 20)";
    ctx.fillRect(0, 0, largura, altura);

    const tremX = Math.sin(timerMorte * 0.3) * 6;
    const tremY = Math.cos(timerMorte * 0.2) * 4;

    ctx.textAlign = "center";

    for (let i = 4; i >= 1; i--) {
        const opacidade = i * 0.06;
        const offsetX = Math.sin((timerMorte - i * 3) * 0.3) * 6;
        const offsetY = Math.cos((timerMorte - i * 3) * 0.2) * 4;
        ctx.fillStyle = `rgba(255, 0, 0, ${opacidade})`;
        ctx.font = "bold 64px GamerFonte";
        ctx.fillText("VOCE MORREU", largura / 2 + offsetX, altura / 2 - 80 + offsetY);
    }

    ctx.fillStyle = "white";
    ctx.font = "bold 64px GamerFonte";
    ctx.fillText("VOCE MORREU", largura / 2 + tremX, altura / 2 - 80 + tremY);

    const minutos  = Math.floor(tempoJogo / 60).toString().padStart(2, "0");
    const segundos = (tempoJogo % 60).toString().padStart(2, "0");
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "24px GamerFonte";
    ctx.fillText(`Voce sobreviveu por ${minutos}:${segundos}`, largura / 2, altura / 2 - 20);

    const btnW = 260;
    const btnH = 60;
    const btnX = largura / 2 - btnW / 2;
    const btnY = altura / 2 + 20;

    ctx.fillStyle = "#7c2a21";
    ctx.fillRect(btnX, btnY, btnW, btnH);
    ctx.fillStyle = "white";
    ctx.font = "bold 28px GamerFonte";
    ctx.fillText("Tentar Novamente", largura / 2, btnY + 42);

    ctx.textAlign = "left";
}

// ── REINÍCIO ──────────────────────────────────────────────────────────────────

export function reiniciarJogo(spawnEnemy) {
    timerMorte = 0;
    tempoInicio = Date.now();
    tempoJogo = 0;
    taxaSpawn = 3000;

    player.x = 0;
    player.y = 0;
    player.hp = 100;
    player.ultimoDano = 0;

    enemies.length = 0;

    gun.balas = gun.maxBalas;
    gun.recarregando = false;
    gun.atirando = false;
    gun.ultimoTiro = 0;

    clearInterval(intervalSpawn);
    intervalSpawn = setInterval(spawnEnemy, taxaSpawn);
}

// ── INPUT ─────────────────────────────────────────────────────────────────────

export function initUI(spawnEnemy) {
    intervalSpawn = setInterval(spawnEnemy, taxaSpawn);

    canvas.addEventListener("click", (e) => {
        if (player.hp > 0) return;

        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const btnW = 260;
        const btnH = 60;
        const btnX = largura / 2 - btnW / 2;
        const btnY = altura / 2 + 20;

        if (clickX >= btnX && clickX <= btnX + btnW &&
            clickY >= btnY && clickY <= btnY + btnH) {
            reiniciarJogo(spawnEnemy);
        }
    });
}