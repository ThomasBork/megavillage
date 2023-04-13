import { Item } from './item';
import { ResourceType } from './resource-type';

export interface ItemResourceStack extends Item {
  resourceType: ResourceType;
  quantity: number;
  maxQuantity: number;
}