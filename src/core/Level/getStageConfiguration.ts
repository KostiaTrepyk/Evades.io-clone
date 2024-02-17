import { GenerateLevelOptions } from "./LevelGenerator";

type Stages = "common" | "large" | "fast" | "many";

export function getStageConfiguration(
  difficulty: number,
  stages: Stages
): GenerateLevelOptions {
  switch (stages) {
    case "common":
      return {
        enemyCount: Math.min(difficulty + 5, 25),
        enemySize: { min: 55, max: 55 },
        enemySpeed: difficulty / 2,
        playerPosition: "start",
        pointOrbCount: 30,
      };
    case "many":
      return {
        enemyCount: Math.max(5, Math.min(difficulty * 4, 125)),
        enemySize: { min: 50, max: 50 },
        enemySpeed: difficulty / 12,
        playerPosition: "start",
        pointOrbCount: 30,
      };
    case "large":
      return {
        enemyCount: Math.min(difficulty / 3 + 3, 30),
        enemySize: { min: 60, max: 350 },
        enemySpeed: Math.min((difficulty - 5) / 5, 50),
        playerPosition: "start",
        pointOrbCount: 30,
      };
    case "fast":
      return {
        enemyCount: Math.max(5, Math.min(difficulty + 3, 20)),
        enemySize: { min: 45, max: 45 },
        enemySpeed: Math.min((difficulty + 25) / 2, 70),
        playerPosition: "start",
        pointOrbCount: 30,
      };
    default:
      throw new Error("Unknown stage");
  }
}
