import { GameObjectLoopMethods } from './GameObject/GameObjectLoopMethods';

export abstract class Module implements GameObjectLoopMethods {
  beforeUpdate?(deltaTime: number): void;
  onUpdate?(deltaTime: number): void;
  afterUpdate?(deltaTime: number): void;
}
