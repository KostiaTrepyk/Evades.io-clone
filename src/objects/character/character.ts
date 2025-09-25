import { CircleShape, Shapes } from '../../core/types/Shape';
import { Position } from '../../core/types/Position';
import { gameObjectManager } from '../../core/global';
import { GameObject } from '../../core/common/GameObject';
import { doItemsIntersect } from '../../core/utils/doItemsIntersect';
import { HSLA } from '../../core/utils/hsla';
import { RenderCharacterModel } from './character.model';
import { CharacterMovement } from './character.movement';
import { CharacterLevels } from './character.levels';
import { CharacterCharacteristics } from './character.characteristics';
import { CharacterCollision } from './character.collision';
import { ISkill } from './skills/ISkill';

export class Character extends GameObject<CircleShape> {
  public UIColor: HSLA;
  public firstSkill: ISkill | undefined;
  public secondSkill: ISkill | undefined;

  public characterMovement: CharacterMovement;
  public characteristics: CharacterCharacteristics;
  public collision: CharacterCollision;
  public level: CharacterLevels;
  public isDead: boolean;
  public timeToDeath: number | undefined;
  public color: HSLA;

  constructor(startPosition: Position, size: number, color: HSLA) {
    super(startPosition, { shape: Shapes.circle, size });

    this.UIColor = color.clone();
    this.characterMovement = new CharacterMovement(this, startPosition, size);
    this.level = new CharacterLevels(this);
    this.characteristics = new CharacterCharacteristics(this);
    this.collision = new CharacterCollision(this);
    this.color = color.clone();
    this.isDead = false;
  }

  public override create() {
    super.create();
    this.level.init();
  }

  public revive(): void {
    this.isDead = false;
    this.characterMovement.unblock();
    this.timeToDeath = undefined;

    gameObjectManager.enemies.forEach((enemy) => {
      if (doItemsIntersect(this, enemy)) {
        this.die();
      }
    });
  }

  public die(): void {
    if (this.characteristics.statuses.includes('immortal')) return;

    this.isDead = true;
    this.characterMovement.block();
    this.timeToDeath = 10;
  }

  public override onUpdate(deltaTime: number): void {
    // Update death timer
    if (this.isDead) {
      if (!this.timeToDeath) return;

      this.timeToDeath -= deltaTime;
      if (this.timeToDeath <= 0) {
        // GAME OVER
        // this.delete();
        this.revive();
      }
    }

    this.characteristics.onUpdate(deltaTime);
    this.characterMovement.onUpdate(deltaTime);

    this.characteristics.reset();
  }

  public override afterUpdate(deltaTime: number): void {
    this.collision.afterUpdate(deltaTime);
  }

  public override onRender(ctx: CanvasRenderingContext2D) {
    RenderCharacterModel.showMana(ctx, this);

    if (this.isDead) {
      RenderCharacterModel.dead(ctx, this);
    } else {
      RenderCharacterModel.default(ctx, this);
    }
  }
}
