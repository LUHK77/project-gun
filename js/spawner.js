import { Zombie } from './Models/Zombie.js';
import { EvilBunny } from './Models/EvilBunny.js';
import { ZombieDog } from './Models/ZombieDog.js';
import { player } from './Models/Player.js';
import { enemies } from './Models/Enemy.js';

export function spawnEnemy() {
    const angulo = Math.random() * Math.PI * 2;
    const distancia = 400 + Math.random() * 200;

    let inimigoEspecial = Math.floor(Math.random() * 100 + 1); // 10% de chance de spawnar um inimigo especial (EvilBunny)
    if (inimigoEspecial <= 10) {
        enemies.push(new EvilBunny(
            player.x + Math.cos(angulo) * distancia,
            player.y + Math.sin(angulo) * distancia
        ));
    } else if (inimigoEspecial <= 20) { // 10% de chance de spawnar um inimigo especial (ZombieDog)
        enemies.push(new ZombieDog(
            player.x + Math.cos(angulo) * distancia,
            player.y + Math.sin(angulo) * distancia
        ));
    }
     else {
        enemies.push(new Zombie(
            player.x + Math.cos(angulo) * distancia,
            player.y + Math.sin(angulo) * distancia
        ));
    }
}