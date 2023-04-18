import { Component, Input } from '@angular/core';
import { UIGameObjectWithStages } from 'src/app/ui-game-state/ui-game-object-with-stages';

@Component({
  selector: 'app-game-object-with-stages',
  templateUrl: './game-object-with-stages.component.html',
  styleUrls: ['./game-object-with-stages.component.scss']
})
export class GameObjectWithStagesComponent {
  @Input()
  public gameObject!: UIGameObjectWithStages;
  public getImagePath(): string {
    return `assets/images/objects-with-stages/${this.gameObject.getType().toString()}/${this.gameObject.getCurrentStage()}.png`;
  }
}
