import { GameObject } from '../../../core/common/GameObject';
import { doItemsIntersect } from '../../../core/doItemsIntersect';
import { gameObjectManager, userInput } from '../../../core/global';
import { HSLA } from '../../../core/helpers/hsla';
import { Position } from '../../../core/types/Position';
import { Character } from '../../character/character';
import { CommonSkill } from '../../character/skills/commonSkill';
import { Skill } from '../../character/skills/skill';
import { Enemy } from '../../enemy/enemy';

export class Rime extends Character {
  public override firstSkill: CommonSkill;
  public override secondSkill: Skill;
  private secondSkillRangeVisibility: boolean;

  private spellsUpgrades = {
    first: { manaUsage: 10, distance: [100, 150, 200, 250, 300] },
    second: { manaUsage: 12 },
  };

  private moveDirection: { x: -1 | 0 | 1; y: -1 | 0 | 1 };

  constructor(startPosition: Position, size: number) {
    super(startPosition, size, new HSLA(230, 85, 50, 100));
    this.firstSkill = new CommonSkill(this, {
      key: 'KeyJ',
      cooldown: 1_000,
      energyUsage: 10,
      onUse: this.teleportForward.bind(this),
      condition: () => {
        if (this.isDead) return false;
        if (this.level.upgrades.firstSpell.current <= 0) return false;
        return true;
      },
    });
    this.secondSkill = new Skill(this, {
      key: 'KeyK',
      energyUsage: 15,
      onUse: this.secondSkillNextStage.bind(this),
      condition: () => {
        if (this.isDead) return false;
        if (this.level.upgrades.secondSpell.current <= 0) return false;
        return true;
      },
    });
    this.moveDirection = { x: 0, y: 0 };
    this.secondSkillRangeVisibility = false;
  }

  public override onUpdate(deltaTime: number): void {
    super.onUpdate(deltaTime);

    this.calculateMovementDirection();
    console.log(this.secondSkill.isAvailable());
    

    this.firstSkill.onUpdate();
    this.secondSkill.onUpdate(deltaTime);
  }

  public override onRender(ctx: CanvasRenderingContext2D): void {
    super.onRender(ctx);

    if (this.secondSkillRangeVisibility) {
      ctx.beginPath();
      const color = this.color.clone();
      color.setAlpha = 0.2;
      color.setLightness = 50;
      color.setHue = this.color.getHue - 30;
      ctx.fillStyle = color.toString();
      ctx.arc(this.position.x, this.position.y, 100 * 2, 0, 360);
      ctx.fill();
    }
  }

  private teleportForward() {
    this.firstSkill.applyEnergyUsage();
    let teleportRange =
      this.spellsUpgrades.first.distance[
        this.level.upgrades.firstSpell.current - 1
      ];

    this.position.x += teleportRange * this.moveDirection.x;
    this.position.y += teleportRange * this.moveDirection.y;
  }

  private secondSkillNextStage() {
    if (this.secondSkillRangeVisibility) {
      this.freezeEnemy();
      this.characteristics.energy.current -= 15;
      this.secondSkill.setCooldown = 5_000;
      this.secondSkillRangeVisibility = false;
    } else {
      this.secondSkillRangeVisibility = true;
    }
  }

  private freezeEnemy() {
    const radius = 200;
    const freezeDuration = 2500;

    const freezer = new GameObject(this.position, {
      shape: 'circle',
      size: radius * 2,
    });

    const enemiesToFreeze = gameObjectManager.enemies.filter((enemy) =>
      doItemsIntersect(freezer, enemy)
    );

    enemiesToFreeze.forEach((enemy) => {
      this.applyFreezeEffect(enemy, freezeDuration);
    });
  }

  private applyFreezeEffect(enemy: Enemy, duration: number) {
    enemy.isFreezed = true;

    setTimeout(() => {
      enemy.isFreezed = false;
    }, duration);
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
