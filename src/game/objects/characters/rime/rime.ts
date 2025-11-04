import { RIMECONFIG } from '@config/characters/rime.config';
import { CircleObject } from '@core/common/CircleObject/CircleObject';
import { gameObjectManager } from '@core/global';
import { MMoveDirection } from '@core/modules/movement/player/MMoveDirection';
import { CharacterBase } from '@game/objects/characterBase/characterBase';
import { CommonSkill } from '@game/skills/commonSkill';
import type { Position } from '@shared-types/Position';
import { drawCircle } from '@utils/canvas/drawCircle';
import { doItemsCollide } from '@utils/collision/doItemsCollide';

const freezeStatusId = Symbol('Rime stun');

export class Rime extends CharacterBase {
  public override firstSkill: CommonSkill;
  public override secondSkill: CommonSkill;
  private secondSkillRangeVisibility: boolean;

  private readonly MMoveDirection: MMoveDirection;

  constructor(startPosition: Position) {
    super(startPosition, RIMECONFIG.radius, RIMECONFIG.color.default.clone());

    this.MMoveDirection = new MMoveDirection();
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
        if (this.secondSkillRangeVisibility === false) return RIMECONFIG.secondSpell.cooldown;
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

  public override beforeUpdate(): void {
    super.beforeUpdate();
    this.MMoveDirection.beforeUpdate();
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    if (this.secondSkillRangeVisibility === true) {
      const currentSkillLevel = this.level.upgrades.secondSpell.current;
      const radius = RIMECONFIG.secondSpell.radius[currentSkillLevel - 1];

      drawCircle(ctx, {
        radius,
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
      const freezeDuration = RIMECONFIG.secondSpell.freezeTime[currentSkillLevel - 1];
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
    const teleportDistance = distance;

    this.position.x += teleportDistance * this.MMoveDirection.moveDirection.x;
    this.position.y += teleportDistance * this.MMoveDirection.moveDirection.y;
  }

  private freezeEnemy(radius: number, duration: number) {
    const freezer = new CircleObject(this.position, radius);

    const enemiesToFreeze = gameObjectManager.enemies.filter(
      enemy => doItemsCollide(freezer, enemy).doesCollide === true,
    );

    enemiesToFreeze.forEach(enemyToFreeze => {
      // Skip if enemy has disabled statuses.
      if (enemyToFreeze.isStatusesDisabled === true) return;

      enemyToFreeze.EnemyStatus.MStatus.applyStatus({
        id: freezeStatusId,
        name: 'stunned',
        duration: duration,
      });
    });
  }
}
