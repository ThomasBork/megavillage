import { Injectable } from '@nestjs/common';
import { Player } from 'src/shared/game-state/player';
import { ServerMessageContainer } from 'src/shared/messages/server/server-message-container';
import { ServerMessagePlayerJoined } from 'src/shared/messages/server/server-message-player-joined';
import { ServerMessageType } from 'src/shared/messages/server/server-message-type';

@Injectable()
export class PlayerJoinedComposer {
  public compose(player: Player): ServerMessageContainer<ServerMessagePlayerJoined> {
    return {
      type: ServerMessageType.playerJoined,
      message: {
        player: player,
      },
    };
  }
}
