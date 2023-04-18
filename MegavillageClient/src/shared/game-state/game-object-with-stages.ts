import { GameObject } from './game-object';

export interface GameObjectWithStages extends GameObject {
  maxStages: number;
  currentStage: number;
  timeUntilNextStage: number;
  totalTimePerStage: number;
}
