import { Enemy } from "../../objects/enemy/enemy";
import { PointOrb } from "../../objects/pointOrb/PointOrb";
import { SaveZone } from "../../objects/saveZone/SaveZone";
import { gameObjectManager } from "../global";

const saveZoneWidth = 300;

export function generateLevel({
  enemyCount,
  pointOrbCount,
  difficulty = 1,
  enemySize,
}: {
  enemyCount: number;
  pointOrbCount: number;
  difficulty?: number;
  enemySize: { min: number; max: number };
}) {
  clearLevel();

  // Player position
  if (gameObjectManager.player) {
    gameObjectManager.player.position.x = saveZoneWidth / 2;
    gameObjectManager.player.position.y = window.innerHeight / 2;
  }

  // Create SaveZone
  const saveZoneStart = new SaveZone(
    { x: saveZoneWidth / 2, y: window.innerHeight / 2 },
    { x: saveZoneWidth, y: window.innerHeight }
  );
  const saveZoneEnd = new SaveZone(
    { x: window.innerWidth - saveZoneWidth / 2, y: window.innerHeight / 2 },
    { x: saveZoneWidth, y: window.innerHeight }
  );
  saveZoneStart.create();
  saveZoneEnd.create();

  // Create enemies
  Array.from({ length: enemyCount }).forEach(() => {
    const enemy = new Enemy(
      getRandomPosition({
        minX: saveZoneWidth + enemySize.max / 2,
        maxX: window.innerWidth - saveZoneWidth - enemySize.max / 2,
        minY: enemySize.max / 2,
        maxY: window.innerHeight - enemySize.max / 2,
      }),
      getRandomSize(enemySize.min, enemySize.max),
      {
        x: (Math.random() - 0.5) * difficulty * 100,
        y: (Math.random() - 0.5) * difficulty * 100,
      }
    );

    enemy.create();
  });

  // Create pointOrbs
  Array.from({ length: pointOrbCount }).forEach(() => {
    const pointOrb = new PointOrb(
      getRandomPosition({
        minX: saveZoneWidth + 50,
        maxX: window.innerWidth - saveZoneWidth - 50,
        minY: 50,
        maxY: window.innerHeight - 50,
      })
    );

    pointOrb.create();
    pointOrbCount--;
  });
}

function clearLevel() {
  // gameObjectManager.player =[]
  gameObjectManager.enemies = [];
  gameObjectManager.pointOrbs = [];
  gameObjectManager.saveZones = [];
}

function getRandomPosition({
  minX,
  maxX,
  minY,
  maxY,
}: {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}) {
  return {
    x: Math.random() * (maxX - minX) + minX,
    y: Math.random() * (maxY - minY) + minY,
  };
}

function getRandomSize(minSize: number, maxSize: number) {
  return Math.random() * (maxSize - minSize) + minSize;
}
