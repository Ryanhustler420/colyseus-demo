import { Room, Client, matchMaker } from "@colyseus/core";
import { Room33RoomState } from "./schema/Room33RoomState";

export class Room33Room extends Room<Room33RoomState> {
  private liveClients: Client[] = [];

  state = new Room33RoomState();

  onCreate (options: any) {
    this.onMessage("message", async (client, message) => {/* */});
  }

  async onJoin (client: Client, options: any) {
    this.liveClients.push(client);
    // this.presence.set(`client#${client.sessionId}`)

    if (this.liveClients.length >= 3) {
      const players = this.liveClients.splice(0, 3);
      this.createGameRoom(players);
    }
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  createGameRoom(players: Client[]) {
    this.clock.setTimeout(async () => {
      const room = await matchMaker.createRoom("typing_room", {
        entry_fee: 33
      });

      players.forEach((player) => {
        player.send("match_found", { roomId: room.roomId });
      });
    }, 100);
  }

}
