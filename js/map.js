// js/map.js
export const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");

// Corrige escala em telas de alto DPI
const dpr = window.devicePixelRatio || 1;
export const LARGURA = window.innerWidth;
export const ALTURA  = window.innerHeight;

canvas.width  = LARGURA * dpr;
canvas.height = ALTURA  * dpr;
canvas.style.width  = LARGURA + "px";
canvas.style.height = ALTURA  + "px";
ctx.scale(dpr, dpr);

// Sprites dos tiles
const imgSolo = [new Image(), new Image(), new Image()];
imgSolo[0].src = "assets/map/sprite_0.png";
imgSolo[1].src = "assets/map/sprite_1.png";
imgSolo[2].src = "assets/map/sprite_2.png";

const imgStone = new Image();
imgStone.src = "assets/map/pedra_0.png";

export const blocoTamanho = 64;
const chunkSize = 10;

export function geraBloco(tileX, tileY) {
    if (Math.abs(tileX) <= 2 && Math.abs(tileY) <= 2) return "grass";

    const chunkX = Math.floor(tileX / chunkSize);
    const chunkY = Math.floor(tileY / chunkSize);
    const seed = Math.abs(chunkX * 37 + chunkY * 71);

    if (seed % 2 !== 0) return "grass";

    const pedraX = seed % chunkSize;
    const pedraY = Math.floor(seed / chunkSize) % chunkSize;
    const localX = ((tileX % chunkSize) + chunkSize) % chunkSize;
    const localY = ((tileY % chunkSize) + chunkSize) % chunkSize;

    if (localX === pedraX && localY === pedraY) return "stone";
    return "grass";
}

export function ehSolido(tileX, tileY) {
    let validade = geraBloco(tileX, tileY) === "stone";
    return validade;
}

export function drawMap(playerX, playerY) {
    const camX = playerX - LARGURA / 2;
    const camY = playerY - ALTURA / 2;

    const firstTileX = Math.floor(camX / blocoTamanho);
    const firstTileY = Math.floor(camY / blocoTamanho);
    const lastTileX  = firstTileX + Math.ceil(LARGURA / blocoTamanho) + 1;
    const lastTileY  = firstTileY + Math.ceil(ALTURA  / blocoTamanho) + 1;

    for (let y = firstTileY; y <= lastTileY; y++) {
        for (let x = firstTileX; x <= lastTileX; x++) {
            const screenX = x * blocoTamanho - camX;
            const screenY = y * blocoTamanho - camY;
            const tile = geraBloco(x, y);

            if (tile === "grass") {
                const variacao = Math.abs((x * 374761393 + y * 668265263) >>> 0) % 3;
                ctx.drawImage(imgSolo[variacao], screenX, screenY, blocoTamanho, blocoTamanho);
            } else {
                ctx.drawImage(imgStone, screenX, screenY, blocoTamanho, blocoTamanho);
            }
        }
    }
}