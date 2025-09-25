export interface ISkill {
  onUpdate: (deltaTime: number) => void;
  cooldownPercentage: number;
}
