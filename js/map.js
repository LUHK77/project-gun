const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Cada bloco do mapa terá 32 pixels
const blocoTamanho = 32;
const chunkSize = 10;

function geraBloco(tileX, tileY) {
    // Área segura de 5x5 tiles ao redor do spawn
    if (Math.abs(tileX) <= 2 && Math.abs(tileY) <= 2) {
        return "grass";
    }
    // Descobre em qual chunk esse tile está
    const chunkX = Math.floor(tileX / chunkSize);
    const chunkY = Math.floor(tileY / chunkSize);

    // Gera uma "seed" para esse chunk
    const seed = Math.abs(chunkX * 37 + chunkY * 71);

    // Apenas alguns chunks terão pedra (20% de chance)
    if (seed % 10 !== 0) {
        return "grass";
    }

    // Escolhe uma posição fixa para a pedra dentro do chunk
    const pedraX = seed % chunkSize;
    const pedraY = Math.floor(seed / chunkSize) % chunkSize;

    // Calcula a posição do tile dentro do chunk
    const localX = ((tileX % chunkSize) + chunkSize) % chunkSize;
    const localY = ((tileY % chunkSize) + chunkSize) % chunkSize;

    // Se este tile for o escolhido, desenha pedra
    if (localX === pedraX && localY === pedraY) {
        return "stone";
    }

    return "grass";
}

// -------------------------
// Desenha mapa
// -------------------------
function ehSolido(tileX, tileY) {
    return geraBloco(tileX, tileY) === "stone";
}

function drawMap() {

    /*
        A câmera fica centralizada no jogador.
        camX e camY representam qual parte
        do mundo está sendo exibida.
    */

    const camX = player.x - canvas.width / 2;
    const camY = player.y - canvas.height / 2;

    // Descobre quais tiles aparecem na tela
    const firstTileX = Math.floor(camX / blocoTamanho);
    const firstTileY = Math.floor(camY / blocoTamanho);

    const lastTileX =
        firstTileX + Math.ceil(canvas.width / blocoTamanho) + 1;

    const lastTileY =
        firstTileY + Math.ceil(canvas.height / blocoTamanho) + 1;

    // Desenha somente os tiles visíveis
    for (let y = firstTileY; y <= lastTileY; y++) {

        for (let x = firstTileX; x <= lastTileX; x++) {
            const screenX = x * blocoTamanho - camX;
            const screenY = y * blocoTamanho - camY;

            const tile = geraBloco(x, y);

            if (tile === "grass") {
                ctx.fillStyle = "#3f8f3f";
                ctx.fillRect(screenX, screenY, blocoTamanho, blocoTamanho);

                ctx.strokeStyle = "#2d6a2d"; // Cor da borda
                ctx.lineWidth = 2;           // Espessura   
                ctx.strokeRect(screenX, screenY, blocoTamanho, blocoTamanho);
            } else {
               const tamanhoPedra = 64;

               ctx.fillStyle = "#666";
               ctx.fillRect(screenX, screenY, blocoTamanho, blocoTamanho);

                ctx.strokeStyle = "#121312"; // Cor da borda
                ctx.lineWidth = 2;           // Espessura   
                ctx.strokeRect(screenX, screenY, blocoTamanho, blocoTamanho);
            }
            
            ctx.fillRect(
                x * blocoTamanho - camX,
                y * blocoTamanho - camY,
                blocoTamanho,
                blocoTamanho
            );
        }
    }
}