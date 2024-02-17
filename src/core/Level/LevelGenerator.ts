import { Enemy } from "../../objects/enemy/enemy";
import { PointOrb } from "../../objects/pointOrb/PointOrb";
import { Portal } from "../../objects/portal/portal";
import { SaveZone } from "../../objects/saveZone/SaveZone";
import { gameObjectManager, renderer } from "../global";

const saveZoneWidth = 300;

export interface GenerateLevelOptions {
  enemyCount: number;
  pointOrbCount: number;
  enemySpeed: number;
  enemySize: { min: number; max: number };
  playerPosition?: "start" | "end";
}

export function generateLevel({
  enemyCount,
  pointOrbCount,
  enemySpeed = 1,
  enemySize,
  playerPosition = "start",
}: GenerateLevelOptions) {
  clearLevel();

  // Player position
  if (gameObjectManager.player) {
    const player = gameObjectManager.player;
    if (playerPosition === "start") {
      player.position.x = player.objectModel.size / 2 + 50;
    } else if (playerPosition === "end") {
      player.position.x =
        renderer.canvasSize.x - player.objectModel.size / 2 - 50;
    }
  }

  // Create SaveZone
  const saveZoneStart = new SaveZone(
    { x: saveZoneWidth / 2, y: renderer.canvasSize.y / 2 },
    { x: saveZoneWidth, y: renderer.canvasSize.y }
  );
  const saveZoneEnd = new SaveZone(
    {
      x: renderer.canvasSize.x - saveZoneWidth / 2,
      y: renderer.canvasSize.y / 2,
    },
    { x: saveZoneWidth, y: renderer.canvasSize.y }
  );
  saveZoneStart.create();
  saveZoneEnd.create();

  // Create Portals
  const portalStart = new Portal(
    { x: 25, y: renderer.canvasSize.y / 2 },
    { x: 50, y: renderer.canvasSize.y },
    "prevLevel"
  );
  const portalEnd = new Portal(
    {
      x: renderer.canvasSize.x - 25,
      y: renderer.canvasSize.y / 2,
    },
    { x: 50, y: renderer.canvasSize.y },
    "nextLevel"
  );
  portalStart.create();
  portalEnd.create();

  // Create enemies
  Array.from({ length: enemyCount }).forEach(() => {
    const enemy = new Enemy(
      getRandomPosition({
        minX: saveZoneWidth + (enemySize.max / 2 + 2),
        maxX: renderer.canvasSize.x - saveZoneWidth - (enemySize.max / 2 + 2),
        minY: enemySize.max / 2 + 2,
        maxY: renderer.canvasSize.y - (enemySize.max / 2 + 2),
      }),
      getRandomSize(enemySize.min, enemySize.max),
      getRandomVelocity(enemySpeed * 25)
    );

    enemy.create();
  });

  // Create pointOrbs
  Array.from({ length: pointOrbCount }).forEach(() => {
    const pointOrb = new PointOrb(
      getRandomPosition({
        minX: saveZoneWidth + 50,
        maxX: renderer.canvasSize.x - saveZoneWidth - 50,
        minY: 50,
        maxY: renderer.canvasSize.y - 50,
      })
    );

    pointOrb.create();
    pointOrbCount--;
  });
}

function clearLevel() {
  gameObjectManager.enemies = [];
  gameObjectManager.pointOrbs = [];
  gameObjectManager.saveZones = [];
  gameObjectManager.portals = [];
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

function getRandomVelocity(speed: number): { x: number; y: number } {
  const randomX = Math.random() * speed;
  const randomY = speed - randomX;

  const xDirection = Math.random() < 0.5 ? -1 : 1;
  const x = randomX * xDirection;

  const yDirection = Math.random() < 0.5 ? -1 : 1;
  const y = randomY * yDirection;

  return { x, y };
}

function getRandomSize(minSize: number, maxSize: number) {
  return Math.random() * (maxSize - minSize) + minSize;
}
