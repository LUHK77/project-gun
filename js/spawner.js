import { Zombie } from './Models/Zombie.js';
import { player } from './Models/Player.js';
import { enemies } from './Models/Enemy.js';

export function spawnEnemy() {
    const angulo = Math.random() * Math.PI * 2;
    const distancia = 400 + Math.random() * 200;

    enemies.push(new Zombie(
        player.x + Math.cos(angulo) * distancia,
        player.y + Math.sin(angulo) * distancia
    ));
}