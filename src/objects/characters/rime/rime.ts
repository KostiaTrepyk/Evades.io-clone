import { GameObject } from '../../../core/common/GameObject';
import { doItemsCollide } from '../../../core/utils/collision/doItemsCollide';
import { gameObjectManager } from '../../../core/global';
import { Position } from '../../../core/types/Position';
import { Character } from '../../character/character';
import { CommonSkill } from '../../character/skills/commonSkill';
import { RIMECONFIG } from '../../../configs/characters/rime.config';
import { MMoveDirection } from '../../../core/modules/movement/MMoveDirection';
import { drawCircle } from '../../../core/utils/canvas/drawCircle';

export class Rime extends Character {
  public override firstSkill: CommonSkill;
  public override secondSkill: CommonSkill;
  private secondSkillRangeVisibility: boolean;

  private _mMoveDirection: MMoveDirection;

  constructor(startPosition: Position) {
    super(startPosition, RIMECONFIG.size, RIMECONFIG.color.default.clone());

    this._mMoveDirection = new MMoveDirection();
    this.secondSkillRangeVisibility = false;

    this.firstSkill = new CommonSkill(this, {
      keyCode: 'KeyJ',
      energyUsage: () => RIMECONFIG.fistSpell.energyUsage,
      cooldown: () => RIMECONFIG.fistSpell.cooldown,
      onUse: this.firstSkillHandler.bind(this),
      condition: () => {
        if (this.isDead) return false;
        if (this.level.upgrades.firstSpell.current <= 0) return false;
        return true;
      },
    });

    this.secondSkill = new CommonSkill(this, {
      keyCode: 'KeyK',
      // Побор энергии будет в onUse так как у нас две стадии спела.
      energyUsage: () => 0,
      cooldown: () => {
        if (this.secondSkillRangeVisibility === false)
          return RIMECONFIG.secondSpell.cooldown;
        return 0;
      },
      onUse: this.secondSkillHandler.bind(this),
      condition: () => {
        if (this.isDead) return false;
        if (this.level.upgrades.secondSpell.current <= 0) return false;
        return true;
      },
    });
  }

  public override onUpdate(deltaTime: number): void {
    super.onUpdate(deltaTime);

    this._mMoveDirection.onUpdate();
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    if (this.secondSkillRangeVisibility === true) {
      const currentSkillLevel = this.level.upgrades.secondSpell.current;
      const radius = RIMECONFIG.secondSpell.radius[currentSkillLevel - 1];

      drawCircle(ctx, {
        size: radius * 2,
        position: this.position,
        fill: {
          color: RIMECONFIG.secondSpell.rangeColor,
        },
      });
    }

    super.onRender(ctx);
  }

  private firstSkillHandler(): void {
    const currentSkillLevel = this.level.upgrades.firstSpell.current;
    const distance = RIMECONFIG.fistSpell.distance[currentSkillLevel - 1];
    this.teleportForward(distance);
  }

  private secondSkillHandler(): void {
    if (this.secondSkillRangeVisibility === true) {
      const currentSkillLevel = this.level.upgrades.secondSpell.current;
      const radius = RIMECONFIG.secondSpell.radius[currentSkillLevel - 1];
      const freezeDuration =
        RIMECONFIG.secondSpell.freezeTime[currentSkillLevel - 1];
      const energyUsage = RIMECONFIG.secondSpell.energyUsage;

      const isEnoughEnergy = this.characteristics.removeEnergy(energyUsage);
      if (isEnoughEnergy === false) return;

      this.freezeEnemy(radius, freezeDuration);
      this.secondSkillRangeVisibility = false;
    } else {
      this.secondSkillRangeVisibility = true;
    }
  }

  private teleportForward(distance: number) {
    let teleportDistance = distance;

    this.position.x += teleportDistance * this._mMoveDirection.moveDirection.x;
    this.position.y += teleportDistance * this._mMoveDirection.moveDirection.y;
  }

  private freezeEnemy(radius: number, duration: number) {
    const freezer = new GameObject(this.position, {
      shape: 'circle',
      size: radius * 2,
    });

    const enemiesToFreeze = gameObjectManager.enemies.filter(
      (enemy) => doItemsCollide(freezer, enemy).doesCollide === true
    );

    enemiesToFreeze.forEach((enemy) => enemy.freeze(duration));
  }
}
