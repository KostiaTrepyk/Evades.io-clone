export const GAMECONFIG = {
  /** When pressed SHIFT */
  characterSlowRatio: 0.5,
  /** Size of each cell in the game grid */
  cellSize: 50,
  /** Speed of the character per point of movement */
  speedPerPoint: 50,
  /** Game FPS */
  fpsGame: 180,

  renderingOrder: {
    player: 4,
    enemy: 5,
    projectile: 6,
    pointOrb: 2,
    saveZone: 0,
    portal: 1,
  },
} as const;
