import { ResourceType } from './resource-type';

export interface GameResource {
  resourceType: ResourceType;
  quantity: number;
}