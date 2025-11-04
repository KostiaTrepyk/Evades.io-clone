import type { Module } from '@core/common/Module';

export abstract class AMEnemyMovement implements Module {
  public abstract afterUpdate(): void;
}
