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
    if (this.keyboardService.isButtonPressed('a')) {
      x -= 1;
    }
    if (this.keyboardService.isButtonPressed('d')) {
      x += 1;
    }
    if (this.keyboardService.isButtonPressed('w')) {
      y -= 1;
    }
    if (this.keyboardService.isButtonPressed('s')) {
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
