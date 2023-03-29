import { Component, Input } from '@angular/core';
import { GameObject } from 'src/shared/game-state/game-object';
import { GameObjectType } from 'src/shared/game-state/game-object-type';

@Component({
  selector: 'app-game-object',
  templateUrl: './game-object.component.html',
  styleUrls: ['./game-object.component.scss']
})
export class GameObjectComponent {
  @Input()
  gameObject!: GameObject;

  public getBackgroundColor(): string {
    switch(this.gameObject.type) {
      case GameObjectType.rock: return 'grey';
      case GameObjectType.tree: return 'green';
      case GameObjectType.player: return 'black';
      default:
        throw new Error('Unknown game object type: "' + this.gameObject.type + '".');
    }
  }
}
