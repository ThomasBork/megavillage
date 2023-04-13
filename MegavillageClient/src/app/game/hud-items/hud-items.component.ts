import { Component, Input } from '@angular/core';
import { UIGameObjectPlayer } from 'src/app/ui-game-state/ui-game-object-player';

@Component({
  selector: 'app-hud-items',
  templateUrl: './hud-items.component.html',
  styleUrls: ['./hud-items.component.scss']
})
export class HudItemsComponent {
  @Input()
  public player!: UIGameObjectPlayer;
}
