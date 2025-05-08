import { Room, Client } from "@colyseus/core";
import { LobbyRoomState } from "./schema/LobbyRoomState";

export class LobbyRoom extends Room<LobbyRoomState> {
  state = new LobbyRoomState();

  onCreate (options: any) {
    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
