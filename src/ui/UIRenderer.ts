import { levelManager } from "../core/global";

export class UIRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.getElementById("interface")! as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;

    window.addEventListener("resize", this.setCanvasSize.bind(this));
    this.setCanvasSize();
  }

  public render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderCharacterDescription();
    this.renderLvlDescription();
  }

  private renderCharacterDescription() {
    const height = 120;
    const width = 650;
    const position = {
      x: this.ctx.canvas.width / 2 - width / 2,
      y: this.canvas.height - height,
    };

    this.ctx.fillStyle = "#000d";
    this.ctx.fillRect(position.x, position.y, width, height);

    this.ctx.strokeStyle = "#555d";
    this.ctx.beginPath();
    this.ctx.moveTo(position.x + height + 20, position.y + height);
    this.ctx.lineTo(position.x + height + 20, position.y);
    this.ctx.stroke();
  }

  private renderLvlDescription() {
    this.ctx.fillStyle = "#fff";
    this.ctx.strokeStyle = "#666";
    this.ctx.lineWidth = 2.5;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.ctx.font = "bold 42px sans-serif";
    this.ctx.fillText(
      `Central Core: Area ${levelManager.currentLevel} (${levelManager.currentStage})`,
      this.ctx.canvas.width / 2,
      40
    );
    this.ctx.strokeText(
      `Central Core: Area ${levelManager.currentLevel} (${levelManager.currentStage})`,
      this.ctx.canvas.width / 2,
      40
    );
  }

  private setCanvasSize() {
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
  }
}
