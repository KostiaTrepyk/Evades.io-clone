import type { Module } from 'modules/Module';

export abstract class AMEnemyMovement implements Module {
  public abstract afterUpdate(): void;
}
