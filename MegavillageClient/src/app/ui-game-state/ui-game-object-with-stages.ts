import { GameObjectWithStages } from 'src/shared/game-state/game-object-with-stages';
import { UIGameObject } from './ui-game-object';

export class UIGameObjectWithStages extends UIGameObject {
  public constructor(serverState: GameObjectWithStages) {
    super(serverState);
  }
  public getCurrentStage(): number {
    return this.getServerStateWithStages().currentStage;
  }
  public setCurrentStage(currentStage: number) {
    this.getServerStateWithStages().currentStage = currentStage;
  }
  private getServerStateWithStages(): GameObjectWithStages {
    return this.serverState as GameObjectWithStages;
  }
}
