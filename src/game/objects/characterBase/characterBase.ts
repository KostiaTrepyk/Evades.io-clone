import { CharacterCharacteristics } from './character.characteristics';
import { CharacterCollision } from './character.collision';
import { CharacterLevels } from './character.levels';
import { RenderCharacterModel } from './character.model';
import { CharacterMovement } from './character.movement';

import { GAMECONFIG } from '@config/game.config';
import { CHARACTERCONFIG } from '@config/objects/character.config';
import { CircleObject } from '@core/common/CircleObject/CircleObject';
import { time } from '@core/global';
import type { ISkill } from '@game/skills/ISkill';
import type { HSLA } from '@utils/hsla';

export abstract class CharacterBase extends CircleObject {
  public override renderId: number = GAMECONFIG.renderingOrder.player;

  public abstract firstSkill: ISkill;
  public abstract secondSkill: ISkill;

  private readonly _characterMovement: CharacterMovement;
  public readonly characteristics: CharacterCharacteristics;
  private readonly _collision: CharacterCollision;
  public readonly level: CharacterLevels;
  private _isDead: boolean;
  private _timeToDeath: number | undefined;
  public color: { current: HSLA; readonly default: HSLA };

  constructor(radius: number, color: HSLA) {
    // Start position will be set by LevelGenerator
    super({ x: 0, y: 0 }, radius);

    this._characterMovement = new CharacterMovement(this);
    this.level = new CharacterLevels();
    this.characteristics = new CharacterCharacteristics(this.level);
    this._collision = new CharacterCollision(this);
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

    this._characterMovement.onUpdate();
  }

  public override afterUpdate(): void {
    this._collision.afterUpdate();
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
    this._characterMovement.unblock();
    this._timeToDeath = undefined;
  }

  public die(): void {
    if (this.characteristics.MStatus.isAppliedStatusByName('immortal')) return;
    if (this._isDead === true) return;

    this._isDead = true;
    this._characterMovement.block();
    this._timeToDeath = CHARACTERCONFIG.timeToDeath;
  }

  public get timeToDeath(): CharacterBase['_timeToDeath'] {
    return this._timeToDeath;
  }

  public get isDead(): CharacterBase['_isDead'] {
    return this._isDead;
  }
}
