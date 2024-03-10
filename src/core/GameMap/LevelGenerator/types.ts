export enum EnemyTypes {
  'CommonEnemy' = 'CommonEnemy',
  'EnemyEnergyBurner' = 'EnemyEnergyBurner',
}

export interface CommonEnemyOptions {
  type: EnemyTypes.CommonEnemy;
  count: number;
  size: { min: number; max: number };
  speed: number;
}

export interface EnemyEnergyBurnerOptions {
  type: EnemyTypes.EnemyEnergyBurner;
  count: number;
  speed: number;
}
