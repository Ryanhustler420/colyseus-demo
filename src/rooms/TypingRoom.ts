import { Room, Client } from "@colyseus/core";
import { TypingRoomState } from "./schema/TypingRoomState";

export class TypingRoom extends Room<TypingRoomState> {
  state = new TypingRoomState();

  onCreate (options: any) {
    this.onMessage("message", (client, message) => {
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
