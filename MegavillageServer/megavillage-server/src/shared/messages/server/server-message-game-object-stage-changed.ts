export interface ServerMessageGameObjectStageChanged {
  gameObjectId: number;
  oldStage: number;
  newStage: number;
  timeToNextStage: number;
}
