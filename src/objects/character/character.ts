import { CircleShape, Shapes } from '../../core/types/Shape';
import { Position } from '../../core/types/Position';
import { GameObject } from '../../core/common/GameObject/GameObject';
import { HSLA } from '../../core/utils/hsla';
import { RenderCharacterModel } from './character.model';
import { CharacterMovement } from './character.movement';
import { CharacterLevels } from './character.levels';
import { CharacterCharacteristics } from './character.characteristics';
import { CharacterCollision } from './character.collision';
import { ISkill } from './skills/ISkill';
import { CHARACTERCONFIG } from '../../configs/characters/character.config';
import { time } from '../../core/global';

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

  public override beforeUpdate(): void {
    this.characteristics.beforeUpdate();
  }

  public override onUpdate(): void {
    this.characteristics.onUpdate();

    // Update death timer
    if (this._isDead) {
      if (this._timeToDeath === undefined) return;

      this._timeToDeath -= time.deltaTime;
      if (this._timeToDeath <= 0) {
        // FIX ME GAME OVER не сделано еще!!!!!!!!!!
        // this.delete();
        this.revive();
      }
    }

    this.firstSkill.onUpdate();
    this.secondSkill.onUpdate();

    this.characterMovement.onUpdate();
  }

  public override afterUpdate(): void {
    this.collision.afterUpdate();
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
