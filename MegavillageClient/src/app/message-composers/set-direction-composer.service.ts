import { Injectable } from '@angular/core';
import { ClientMessageContainer } from 'src/shared/messages/client/client-message-container';
import { ClientMessageSetDirection } from 'src/shared/messages/client/client-message-set-direction';
import { ClientMessageType } from 'src/shared/messages/client/client-message-type';
import { KeyboardService } from '../keyboard.service';

@Injectable({
  providedIn: 'root'
})
export class SetDirectionComposerService {
  public constructor(private keyboardService: KeyboardService) { }

  public compose(): ClientMessageContainer<ClientMessageSetDirection> {
    let x = 0;
    let y = 0;
    if (this.keyboardService.isButtonPressed('a') || this.keyboardService.isButtonPressed('ArrowLeft')) {
      x -= 1;
    }
    if (this.keyboardService.isButtonPressed('d') || this.keyboardService.isButtonPressed('ArrowRight')) {
      x += 1;
    }
    if (this.keyboardService.isButtonPressed('w') || this.keyboardService.isButtonPressed('ArrowUp')) {
      y -= 1;
    }
    if (this.keyboardService.isButtonPressed('s') || this.keyboardService.isButtonPressed('ArrowDown')) {
      y += 1;
    }
    return {
      type: ClientMessageType.setDirection,
      message: {
        newDirection: {
          x: x,
          y: y
        }
      }
    };
  }
}
