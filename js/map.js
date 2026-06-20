const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Tamanho de cada tile em pixels
const blocoTamanho = 32;
const chunkSize = 10;

/**
 * Retorna o tipo de tile ("grass" ou "stone") para uma posição (tileX, tileY).
 * - Área segura de 5x5 ao redor do spawn sempre é grama.
 * - Fora disso, usa seed baseada no chunk para espalhar pedras de forma determinística.
 */
function geraBloco(tileX, tileY) {
    // Área segura ao redor do spawn (sempre grama)
    if (Math.abs(tileX) <= 2 && Math.abs(tileY) <= 2) {
        return "grass";
    }

    // Descobre em qual chunk esse tile está
    const chunkX = Math.floor(tileX / chunkSize);
    const chunkY = Math.floor(tileY / chunkSize);

    // Seed determinística para o chunk
    const seed = Math.abs(chunkX * 37 + chunkY * 71);

    // Apenas 10% dos chunks terão pedra
    if (seed % 10 !== 0) return "grass";

    // Posição fixa da pedra dentro do chunk
    const pedraX = seed % chunkSize;
    const pedraY = Math.floor(seed / chunkSize) % chunkSize;

    // Posição local do tile dentro do chunk
    const localX = ((tileX % chunkSize) + chunkSize) % chunkSize;
    const localY = ((tileY % chunkSize) + chunkSize) % chunkSize;

    if (localX === pedraX && localY === pedraY) return "stone";

    return "grass";
}

/**
 * Retorna true se o tile na posição (tileX, tileY) for sólido (bloqueante).
 */
function ehSolido(tileX, tileY) {
    return geraBloco(tileX, tileY) === "stone";
}

/**
 * Desenha apenas os tiles visíveis na tela, com a câmera centralizada no player.
 */
function drawMap() {
    const camX = player.x - canvas.width / 2;
    const camY = player.y - canvas.height / 2;

    const firstTileX = Math.floor(camX / blocoTamanho);
    const firstTileY = Math.floor(camY / blocoTamanho);
    const lastTileX  = firstTileX + Math.ceil(canvas.width  / blocoTamanho) + 1;
    const lastTileY  = firstTileY + Math.ceil(canvas.height / blocoTamanho) + 1;

    for (let y = firstTileY; y <= lastTileY; y++) {
        for (let x = firstTileX; x <= lastTileX; x++) {
            const screenX = x * blocoTamanho - camX;
            const screenY = y * blocoTamanho - camY;
            const tile = geraBloco(x, y);

            // Gera uma grama e define o tamanho e pocição dela
            if (tile === "grass") {
                ctx.fillStyle = "#3f8f3f";
                ctx.fillRect(screenX, screenY, blocoTamanho, blocoTamanho);
                ctx.strokeStyle = "#2d6a2d";
                ctx.lineWidth = 2;
                ctx.strokeRect(screenX, screenY, blocoTamanho, blocoTamanho);
            } else {
            // Gera uma pedra e define o tamanho e pocição dela
                ctx.fillStyle = "#666";
                ctx.fillRect(screenX, screenY, blocoTamanho, blocoTamanho);
                ctx.strokeStyle = "#121312";
                ctx.lineWidth = 2;
                ctx.strokeRect(screenX, screenY, blocoTamanho, blocoTamanho);
            }
        }
    }
}
