import { GameObject } from '../../../core/common/GameObject';
import { doItemsCollide } from '../../../core/utils/collision/doItemsCollide';
import { gameObjectManager, userInput } from '../../../core/global';
import { Position } from '../../../core/types/Position';
import { Character } from '../../character/character';
import { CommonSkill } from '../../character/skills/commonSkill';
import { RIMECONFIG } from '../../../configs/characters/rime.config';
import { MoveDirection } from '../../../core/types/moveDirection';

export class Rime extends Character {
  public override firstSkill: CommonSkill;
  public override secondSkill: CommonSkill;
  private secondSkillRangeVisibility: boolean;

  private moveDirection: MoveDirection;

  constructor(startPosition: Position) {
    super(startPosition, RIMECONFIG.size, RIMECONFIG.color.default.clone());

    this.moveDirection = { x: 0, y: 0 };
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
      // Побор энергии будет в onUse так как у нас 2 стадии спела.
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

    this.calculateMovementDirection();

    this.firstSkill.onUpdate();
    this.secondSkill.onUpdate();
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    if (this.secondSkillRangeVisibility) {
      const currentSkillLevel = this.level.upgrades.secondSpell.current;
      const radius = RIMECONFIG.secondSpell.radius[currentSkillLevel - 1];
      const color = RIMECONFIG.secondSpell.rangeColor.clone();

      ctx.beginPath();
      ctx.fillStyle = color.toString();
      ctx.arc(this.position.x, this.position.y, radius, 0, 360);
      ctx.fill();
    }

    super.onRender(ctx);
  }

  private firstSkillHandler(): void {
    const currentSkillLevel = this.level.upgrades.firstSpell.current;
    const distance = RIMECONFIG.fistSpell.distance[currentSkillLevel - 1];
    this.teleportForward(distance);
  }

  private secondSkillHandler(): void {
    // Проверка на ману
    if (
      this.characteristics.energy.current < RIMECONFIG.secondSpell.energyUsage
    ) {
      return;
    }

    if (this.secondSkillRangeVisibility) {
      const currentSkillLevel = this.level.upgrades.secondSpell.current;
      const radius = RIMECONFIG.secondSpell.radius[currentSkillLevel - 1];
      const freezeDuration =
        RIMECONFIG.secondSpell.freezeTime[currentSkillLevel - 1];

      this.characteristics.energy.current -= RIMECONFIG.secondSpell.energyUsage;
      this.freezeEnemy(radius, freezeDuration);
      this.secondSkillRangeVisibility = false;
    } else {
      this.secondSkillRangeVisibility = true;
    }
  }

  private teleportForward(distance: number) {
    let teleportDistance = distance;

    this.position.x += teleportDistance * this.moveDirection.x;
    this.position.y += teleportDistance * this.moveDirection.y;
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

  private calculateMovementDirection() {
    if (
      !userInput.isKeypress('KeyW') &&
      !userInput.isKeypress('KeyS') &&
      !userInput.isKeypress('KeyA') &&
      !userInput.isKeypress('KeyD')
    )
      return;

    // Only update moveDirection if a movement key is pressed
    this.moveDirection.x = 0;
    this.moveDirection.y = 0;

    if (userInput.isKeypress('KeyW')) {
      this.moveDirection.y = 1;
    } else if (userInput.isKeypress('KeyS')) {
      this.moveDirection.y = -1;
    }

    if (userInput.isKeypress('KeyA')) {
      this.moveDirection.x = -1;
    } else if (userInput.isKeypress('KeyD')) {
      this.moveDirection.x = 1;
    }

    // Normalize diagonal movement
    if (this.moveDirection.x !== 0 && this.moveDirection.y !== 0) {
      const diagonalFactor = 1 / Math.sqrt(2);
      this.moveDirection.x *= diagonalFactor;
      this.moveDirection.y *= diagonalFactor;
    }

    // Reverse y-direction
    this.moveDirection.y *= -1;
  }
}
