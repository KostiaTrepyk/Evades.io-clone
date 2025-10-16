import { GameObject } from '../../core/common/GameObject';
import { HSLA } from '../../core/utils/hsla';
import { Position } from '../../core/types/Position';
import { Velocity } from '../../core/types/Velocity';
import { CircleShape } from '../../core/types/Shape';
import { drawCircle } from '../../core/utils/canvas/drawCircle';
import { ENEMYCONFIG } from '../../configs/enemies/enemy.config';
import { EnemyCharacteristics } from './enemy.characteristics';
import { speedPerPoint } from '../../consts/consts';
import { MEnemyMoveDefault } from '../../core/modules/movement/enemy/MEnemyMoveDefault';
import { MEnemyMove } from '../../core/modules/movement/enemy/MEnemyMove.type';

export interface EnemyParams {
  position: Position;
  size: number;
  velocity: Velocity;
  color?: { hue: number };
}

export class Enemy extends GameObject<CircleShape> {
  public readonly defaultColor: HSLA;
  public currentColor: HSLA;
  public readonly defaultSize: number;
  private _velocity: Velocity;

  protected EnemyMovement: MEnemyMove;
  public Characteristics: EnemyCharacteristics;

  constructor(params: EnemyParams) {
    const { position, size, velocity, color } = params;

    super(position, { shape: 'circle', size });

    const enemyColor = ENEMYCONFIG.defaultColor.clone();
    if (color !== undefined) {
      enemyColor.setHue = color.hue;
      enemyColor.setSaturation = 100;
    }

    this.defaultColor = enemyColor.clone();
    this.currentColor = enemyColor.clone();
    this.defaultSize = size;
    this._velocity = velocity;

    this.EnemyMovement = new MEnemyMoveDefault(this);
    this.Characteristics = new EnemyCharacteristics({ enemy: this });
  }

  public override onUpdate(deltaTime: number): void {
    this.Characteristics.onUpdate();

    this.currentColor = this.Characteristics.getColor();

    // If is not freezed, update position
    if (
      this.Characteristics.MStatus.isAppliedStatusByName('stunned') === false
    ) {
      this.prevPosition = { x: this.position.x, y: this.position.y };

      // Гениально посчитал velocity. Переделать нужно
      const defaultSpeed =
        Math.abs(this.velocity.x) + Math.abs(this.velocity.y);
      const currentSpeed = defaultSpeed + this.Characteristics.speedChange;

      const currentVelocity = {
        x: (this.velocity.x / defaultSpeed) * currentSpeed,
        y: (this.velocity.y / defaultSpeed) * currentSpeed,
      };

      this.position.x += currentVelocity.x * speedPerPoint * deltaTime;
      this.position.y += currentVelocity.y * speedPerPoint * deltaTime;
    }

    this.objectModel.size = this.defaultSize * this.Characteristics.sizeScale;
  }

  public override afterUpdate(deltaTime: number): void {
    this.EnemyMovement.afterUpdate(deltaTime);
  }

  public override onRender(ctx: CanvasRenderingContext2D, hue?: number): void {
    drawCircle(ctx, {
      position: this.position,
      size: this.objectModel.size,
      fill: { color: this.currentColor },
      stroke: {
        color: ENEMYCONFIG.strokeColor,
        width: ENEMYCONFIG.strokeWidth,
      },
    });
  }

  public set setVelocity(v: Velocity) {
    this._velocity = v;
  }

  public get velocity(): Velocity {
    return { ...this._velocity };
  }
}
