import { GameObject } from 'src/shared/game-state/game-object';
import { GameObjectType } from 'src/shared/game-state/game-object-type';
import { Item } from 'src/shared/game-state/item';
import { Vector2 } from 'src/shared/game-state/vector2';

export class UIGameObject {
  protected serverState: GameObject;
  public constructor(serverState: GameObject) {
    this.serverState = serverState;
  }
  public getId(): number {
    return this.serverState.id;
  }
  public getPosition(): Vector2 {
    return this.serverState.position;
  }
  public setPosition(position: Vector2): void {
    this.serverState.position = position;
  }
  public getSize(): Vector2 {
    return this.serverState.size;
  }
  public getType(): GameObjectType {
    return this.serverState.type;
  }
  public getMinX(): number {
    return this.getPosition().x - this.getSize().x / 2;
  }
  public getMaxX(): number {
    return this.getPosition().x + this.getSize().x / 2;
  }
  public getMinY(): number {
    return this.getPosition().y - this.getSize().y / 2;
  }
  public getMaxY(): number {
    return this.getPosition().y + this.getSize().y / 2;
  }
  public getIsBlockingMovement(): boolean {
    return this.serverState.blocksMovement;
  }
  public getItems(): (Item | null)[] {
    return this.serverState.items;
  }
  public getItem(itemId: number): Item {
    const item = this.getItems().find((i) => i !== null && i.id === itemId);
    if (!item) {
      throw new Error ('Could not find item with id: "' + itemId + '".');
    }
    return item;
  }
  public getItemAtIndex(index: number): Item | null {
    return this.serverState.items[index];
  }
  public setItem(item: Item, index: number): void {
    this.serverState.items[index] = item;
  }
  public removeItem(item: Item): void {
    const items = this.serverState.items;
    const index = items.indexOf(item);
    if (index < 0) {
      throw new Error('Item with id = "' + item.id + '" was not found on game object with id = "' + this.getId() + '".');
    }
    items[index] = null;
  }
  public getMaxItemCount(): number {
    return this.serverState.maxItemCount;
  }
}
