export interface ISkill {
  onUpdate: (deltaTime: number) => void;
  cooldownPersentage: number;
}
