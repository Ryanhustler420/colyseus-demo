import { Room, Client } from "@colyseus/core";
import { Room33RoomState } from "./schema/Room33RoomState";

export class Room33Room extends Room<Room33RoomState> {
  state = new Room33RoomState();

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
