import { CircleShape, Shapes } from '../../core/types/Shape';
import { Position } from '../../core/types/Position';
import { gameObjectManager } from '../../core/global';
import { GameObject } from '../../core/common/GameObject';
import { doItemsCollide } from '../../core/utils/collision/doItemsCollide';
import { HSLA } from '../../core/utils/hsla';
import { RenderCharacterModel } from './character.model';
import { CharacterMovement } from './character.movement';
import { CharacterLevels } from './character.levels';
import { CharacterCharacteristics } from './character.characteristics';
import { CharacterCollision } from './character.collision';
import { ISkill } from './skills/ISkill';

export abstract class Character extends GameObject<CircleShape> {
  public readonly UIColor: HSLA;
  public abstract firstSkill: ISkill;
  public abstract secondSkill: ISkill;

  public readonly characterMovement: CharacterMovement;
  public readonly characteristics: CharacterCharacteristics;
  public readonly collision: CharacterCollision;
  public readonly level: CharacterLevels;
  public isDead: boolean;
  public timeToDeath: number | undefined;
  public color: HSLA;

  constructor(startPosition: Position, size: number, color: HSLA) {
    super(startPosition, { shape: Shapes.circle, size });

    this.UIColor = color.clone();
    this.characterMovement = new CharacterMovement(this);
    this.level = new CharacterLevels();
    this.characteristics = new CharacterCharacteristics(this.level);
    this.collision = new CharacterCollision(this);
    this.color = color.clone();
    this.isDead = false;
  }

  public override create(): void {
    super.create();
    this.level.init();
  }

  public revive(): void {
    this.isDead = false;
    this.characterMovement.unblock();
    this.timeToDeath = undefined;

    gameObjectManager.enemies.forEach((enemy) => {
      if (doItemsCollide(this, enemy).doesCollide === true) {
        this.die();
      }
    });
  }

  public die(): void {
    if (this.characteristics.MStatus.isAppliedStatusByName('immortal')) return;

    this.isDead = true;
    this.characterMovement.block();
    this.timeToDeath = 3;
  }

  public override onUpdate(deltaTime: number): void {
    // Update death timer
    if (this.isDead) {
      if (this.timeToDeath === undefined) return;

      this.timeToDeath -= deltaTime;
      if (this.timeToDeath <= 0) {
        // FIX ME GAME OVER не сделано еще!!!!!!!!!!
        // this.delete();
        this.revive();
      }
    }

    // Должно быть первым что-бы правильно просчитать скорость игрока и эго эффекты
    this.characteristics.onUpdate(deltaTime);

    this.firstSkill.onUpdate(deltaTime);
    this.secondSkill.onUpdate(deltaTime);

    this.characterMovement.onUpdate(deltaTime);
  }

  public override afterUpdate(deltaTime: number): void {
    this.collision.afterUpdate(deltaTime);
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    RenderCharacterModel.showMana(ctx, this);

    if (this.isDead) {
      RenderCharacterModel.dead(ctx, this);
    } else {
      RenderCharacterModel.default(ctx, this);
    }
  }
}
