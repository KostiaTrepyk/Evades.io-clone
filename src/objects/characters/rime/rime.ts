import { GameObject } from '../../../core/common/GameObject';
import { doItemsIntersect } from '../../../core/doItemsIntersect';
import { gameObjectManager, userInput } from '../../../core/global';
import { HSLA } from '../../../core/helpers/hsla';
import { Position } from '../../../core/types/Position';
import { Character } from '../../character/character';
import { CommonSkill } from '../../character/skills/commonskill';

export class Rime extends Character {
  public override firstSkill: CommonSkill;
  public override secondSkill: CommonSkill;
  private secondSkillRangeVisibility: boolean;

  private spellsUpgrades = {
    first: { distance: [100, 150, 200, 250, 300] },
    second: { radius: [150, 180, 220, 260, 300] },
  };

  private moveDirection: { x: -1 | 0 | 1; y: -1 | 0 | 1 };

  constructor(startPosition: Position, size: number) {
    super(startPosition, size, new HSLA(230, 85, 50, 100));
    this.firstSkill = new CommonSkill(this, {
      key: 'KeyJ',
      energyUsage: 10,
      onUse: this.firstSkillHandler.bind(this),
    });
    this.secondSkill = new CommonSkill(this, {
      key: 'KeyK',
      energyUsage: 30,
      onUse: this.secondSkillHandler.bind(this),
    });
    this.moveDirection = { x: 0, y: 0 };
    this.secondSkillRangeVisibility = false;
  }

  public override onUpdate(deltaTime: number): void {
    super.onUpdate(deltaTime);

    this.calculateMovementDirection();

    this.firstSkill.onUpdate();
    this.secondSkill.onUpdate();
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    super.onRender(ctx);

    if (this.secondSkillRangeVisibility) {
      const currentSkillLevel = this.level.upgrades.secondSpell.current;
      const radius = this.spellsUpgrades.second.radius[currentSkillLevel - 1];
      ctx.beginPath();
      const color = this.color.clone();
      color.setAlpha = 0.2;
      color.setLightness = 50;
      color.setHue = this.color.getHue - 30;
      ctx.fillStyle = color.toString();
      ctx.arc(this.position.x, this.position.y, radius, 0, 360);
      ctx.fill();
    }
  }

  private firstSkillHandler(): void {
    if (this.isDead) return;
    if (this.level.upgrades.firstSpell.current <= 0) return;
    if (!this.firstSkill.isEnoughEnergy()) return;

    const currentSkillLevel = this.level.upgrades.firstSpell.current;
    const distance = this.spellsUpgrades.first.distance[currentSkillLevel - 1];

    this.firstSkill.applyEnergyUsage();
    this.firstSkill.setCooldown = 0.5;
    this.teleportForward(distance);
  }

  private secondSkillHandler() {
    if (this.isDead) return;
    if (this.level.upgrades.secondSpell.current <= 0) return;
    if (!this.secondSkill.isEnoughEnergy()) return;

    if (this.secondSkillRangeVisibility) {
      const currentSkillLevel = this.level.upgrades.secondSpell.current;
      const radius = this.spellsUpgrades.second.radius[currentSkillLevel - 1];
      const freezeDuration = 2;

      this.secondSkill.applyEnergyUsage();
      this.freezeEnemy(radius, freezeDuration);
      this.secondSkill.setCooldown = 1;
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

    const enemiesToFreeze = gameObjectManager.enemies.filter((enemy) =>
      doItemsIntersect(freezer, enemy)
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
