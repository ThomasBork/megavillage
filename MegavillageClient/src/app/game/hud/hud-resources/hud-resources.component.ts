import { Component, Input } from '@angular/core';
import { GameResource } from 'src/shared/game-state/game-resource';

@Component({
  selector: 'app-hud-resources',
  templateUrl: './hud-resources.component.html',
  styleUrls: ['./hud-resources.component.scss']
})
export class HudResourcesComponent {
  @Input()
  public resources!: GameResource[];

  public getResourceImagePath(resource: GameResource): string {
      return 'assets/images/items/' + resource.resourceType.toString() + '.png';
  }
}
