import { GameObject } from "./common/GameObject";
import { Character } from "../character/character";

export class GameObjectsManager {
  public player: Character | undefined;
  public items: GameObject[];

  constructor() {
    this.items = [];
  }

  public getPlayer(): Character | undefined {
    return this.player;
  }

  public setPlayer(player: Character | undefined) {
    this.player = player;
  }

  public addItem(item: GameObject) {
    this.items.push(item);
  }

  public removeItem(id: number) {
    this.items = this.items.filter((item) => item.id !== id);
  }
}
