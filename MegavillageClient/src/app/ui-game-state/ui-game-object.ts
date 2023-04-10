import { GameObject } from 'src/shared/game-state/game-object';
import { GameObjectType } from 'src/shared/game-state/game-object-type';
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
}
