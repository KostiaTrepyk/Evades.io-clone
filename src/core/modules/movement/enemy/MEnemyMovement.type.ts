import { Module } from '../../../common/Module';

export abstract class AMEnemyMovement implements Module {
  public abstract afterUpdate(): void;
}
