import { ResourceType } from '../../game-state/resource-type';

export interface ServerMessageGameResourceQuantityChanged {
  resourceType: ResourceType
  oldQuantity: number;
  newQuantity: number;
}
