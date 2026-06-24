// js/upgradeUI.js

import { ctx, canvas, LARGURA, ALTURA } from './map.js';
import { player } from './Models/Player.js';

export let escolhendoUpgrade = false;

export function abrirUpgrade() {
    escolhendoUpgrade = true;
}

// Botões de upgrade
const botoes = [
    { 
        label: "ATK", 
        descricao: () => player.ataque,
        aplicar: () => { player.ataque += 1; }
    },
    { 
        label: "Vel", 
        descricao: () => Math.round(player.speed * 10),
        aplicar: () => { player.speed += 0.1; }
    },
    { 
        label: "HP",  
        descricao: () => player.hp / 10,
        aplicar: () => { player.hp += 10; }
    },
];

export function drawUpgrade() {
    if (!escolhendoUpgrade) return;

    // Fundo escuro
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(0, 0, LARGURA, ALTURA);

    // Painel central
    const painelW = 500;
    const painelH = 300;
    const painelX = LARGURA / 2 - painelW / 2;
    const painelY = ALTURA  / 2 - painelH / 2;

    ctx.fillStyle = "#111";
    ctx.fillRect(painelX, painelY, painelW, painelH);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(painelX, painelY, painelW, painelH);

    // Sprite do player (lado esquerdo)
    const spriteSize = 120;
    const spriteX = painelX + 40;
    const spriteY = painelY + painelH / 2 - spriteSize / 2;
    ctx.drawImage(
        player.animacao.frames[0],
        spriteX, spriteY, spriteSize, spriteSize
    );

    // Painel de stats (lado direito)
    const statsX = painelX + 200;
    const statsW = 260;
    const statsH = 220;
    const statsY = painelY + painelH / 2 - statsH / 2;

    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.strokeRect(statsX, statsY, statsW, statsH);

    // Título Stats
    ctx.fillStyle = "white";
    ctx.font = "bold 18px GamerFonte";
    ctx.textAlign = "center";
    ctx.fillText("Stats", statsX + statsW / 2, statsY + 24);

    // Linhas de atributo
    const linhaH = 50;
    botoes.forEach((b, i) => {
        const linhaY = statsY + 50 + i * linhaH;

        // Label
        ctx.fillStyle = "white";
        ctx.font = "16px GamerFonte";
        ctx.textAlign = "right";
        ctx.fillText(b.label + ":", statsX + 40, linhaY + 18);

        // Caixa de valor
        const caixaX = statsX + 50;
        const caixaW = 150;
        const caixaH = 26;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(caixaX, linhaY, caixaW, caixaH);

        ctx.fillStyle = "white";
        ctx.font = "bold 16px GamerFonte";
        ctx.textAlign = "center";
        ctx.fillText(b.descricao(), caixaX + caixaW / 2, linhaY + 18);

        // Botão +
        const btnX = caixaX + caixaW + 8;
        const btnSize = 26;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(btnX, linhaY, btnSize, btnSize);

        ctx.fillStyle = "white";
        ctx.font = "bold 20px GamerFonte";
        ctx.textAlign = "center";
        ctx.fillText("+", btnX + btnSize / 2, linhaY + 19);

        // Guarda posição do botão pra detectar clique
        b._btnX = btnX;
        b._btnY = linhaY;
        b._btnSize = btnSize;
    });

    ctx.textAlign = "left";
}

export function handleUpgradeClick(clickX, clickY) {
    if (!escolhendoUpgrade) return;

    botoes.forEach((b) => {
        if (clickX >= b._btnX && clickX <= b._btnX + b._btnSize &&
            clickY >= b._btnY && clickY <= b._btnY + b._btnSize) {
            b.aplicar();
            escolhendoUpgrade = false;
        }
    });
}