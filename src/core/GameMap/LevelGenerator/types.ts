export enum EnemyTypes {
  'CommonEnemy' = 'CommonEnemy',
  'EnemyEnergyBurner' = 'EnemyEnergyBurner',
  'EnemySpeedReduction' = 'EnemySpeedReduction',
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

export interface EnemySpeedReductionOptions {
  type: EnemyTypes.EnemySpeedReduction;
  count: number;
  speed: number;
}
