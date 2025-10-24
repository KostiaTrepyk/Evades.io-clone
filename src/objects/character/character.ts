import { CircleShape, Shapes } from '../../core/types/Shape';
import { Position } from '../../core/types/Position';
import { gameObjectManager } from '../../core/global';
import { GameObject } from '../../core/common/GameObject/GameObject';
import { doItemsCollide } from '../../core/utils/collision/doItemsCollide';
import { HSLA } from '../../core/utils/hsla';
import { RenderCharacterModel } from './character.model';
import { CharacterMovement } from './character.movement';
import { CharacterLevels } from './character.levels';
import { CharacterCharacteristics } from './character.characteristics';
import { CharacterCollision } from './character.collision';
import { ISkill } from './skills/ISkill';
import { CHARACTERCONFIG } from '../../configs/characters/character.config';

export abstract class Character extends GameObject<CircleShape> {
  public abstract firstSkill: ISkill;
  public abstract secondSkill: ISkill;

  private readonly characterMovement: CharacterMovement;
  public readonly characteristics: CharacterCharacteristics;
  private readonly collision: CharacterCollision;
  public readonly level: CharacterLevels;
  private _isDead: boolean;
  private _timeToDeath: number | undefined;
  public color: { current: HSLA; readonly default: HSLA };

  constructor(startPosition: Position, size: number, color: HSLA) {
    super(startPosition, { shape: Shapes.circle, size });

    this.characterMovement = new CharacterMovement(this);
    this.level = new CharacterLevels();
    this.characteristics = new CharacterCharacteristics(this.level);
    this.collision = new CharacterCollision(this);
    this.color = { current: color.clone(), default: color.clone() };
    this._isDead = false;
  }

  public override beforeUpdate(deltaTime: number): void {
    this.characteristics.beforeUpdate(deltaTime);
  }

  public override onUpdate(deltaTime: number): void {
    this.characteristics.onUpdate(deltaTime);

    // Update death timer
    if (this._isDead) {
      if (this._timeToDeath === undefined) return;

      this._timeToDeath -= deltaTime;
      if (this._timeToDeath <= 0) {
        // FIX ME GAME OVER не сделано еще!!!!!!!!!!
        // this.delete();
        this.revive();
      }
    }

    this.firstSkill.onUpdate(deltaTime);
    this.secondSkill.onUpdate(deltaTime);

    this.characterMovement.onUpdate(deltaTime);
  }

  public override afterUpdate(deltaTime: number): void {
    this.collision.afterUpdate(deltaTime);
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    RenderCharacterModel.showMana(ctx, this);

    if (this._isDead) {
      RenderCharacterModel.dead(ctx, this);
    } else {
      RenderCharacterModel.default(ctx, this);
    }
  }

  public override init(): void {
    super.init();
    this.level.init();
  }

  public revive(): void {
    this._isDead = false;
    this.characterMovement.unblock();
    this._timeToDeath = undefined;
  }

  public die(): void {
    if (this.characteristics.MStatus.isAppliedStatusByName('immortal')) return;
    if (this._isDead === true) return;

    this._isDead = true;
    this.characterMovement.block();
    this._timeToDeath = CHARACTERCONFIG.timeToDeath;
  }

  get timeToDeath(): Character['_timeToDeath'] {
    return this._timeToDeath;
  }

  get isDead(): Character['_isDead'] {
    return this._isDead;
  }
}
