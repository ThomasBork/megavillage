import { Component, Input } from '@angular/core';
import { GameService } from 'src/app/game.service';
import { UIGameObject } from 'src/app/ui-game-state/ui-game-object';
import { UIGameObjectPlayer } from 'src/app/ui-game-state/ui-game-object-player';
import { GameObjectType } from 'src/shared/game-state/game-object-type';

@Component({
  selector: 'app-game-object',
  templateUrl: './game-object.component.html',
  styleUrls: ['./game-object.component.scss']
})
export class GameObjectComponent {
  @Input()
  gameObject!: UIGameObject;

  public constructor(private gameService: GameService) {}

  public getBackgroundColor(): string {
    switch(this.gameObject.getType()) {
      case GameObjectType.rock: return 'grey';
      case GameObjectType.tree: return 'green';
      case GameObjectType.player: return 'black';
      default:
        throw new Error('Unknown game object type: "' + this.gameObject.getType() + '".');
    }
  }

  public getBorder(): string | undefined {
    const isTarget = this.gameService.getGame().getCurrentTargetObject() === this.gameObject;
    if (isTarget) {
      return '2px solid black';
    }
    return undefined;
  }

  public getText(): string {
    if (this.gameObject instanceof UIGameObjectPlayer) {
      const action = this.gameObject.getAction();
      if (action) {
        return 'Performing action: ' + action.type;
      }
      return this.gameObject.getUserName();
    }
    return this.gameObject.getId().toString();
  }
}
