import { Component, Input } from '@angular/core';
import { Item } from 'src/shared/game-state/item';
import { ItemResourceStack } from 'src/shared/game-state/item-resource-stack';
import { ItemType } from 'src/shared/game-state/item-type';

@Component({
  selector: 'app-hud-item',
  templateUrl: './hud-item.component.html',
  styleUrls: ['./hud-item.component.scss']
})
export class HudItemComponent {
  @Input()
  public item!: Item | null;

  public isResourceStack(): boolean {
    return this.item !== null && this.item.type === ItemType.resourceStack;
  }

  public getResourceQuantity(): number {
    return (this.item as ItemResourceStack).quantity;
  }

  public getImagePath(): string {
    if (this.item === null) {
      throw new Error ('Tried to get image path of an empty item slot.');
    }
    if (this.isResourceStack()) {
      return 'assets/images/items/' + (this.item as ItemResourceStack).resourceType.toString() + '.png';
    }
    return 'assets/images/items/' + this.item.type.toString() + '.png';
  }
}
