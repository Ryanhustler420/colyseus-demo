import { Room, Client, matchMaker, AuthContext, RoomException } from "@colyseus/core";
import { Room33RoomState } from "./schema/Room33RoomState";

export class Room33Room extends Room<Room33RoomState> {
  private liveClients: Client[] = [];

  state = new Room33RoomState();

  onAuth(client: Client<any, any>, options: any, context: AuthContext) {
    // only specific user can enter this
    // client.userData = { team: (this.clients.length % 2 === 0) ? "red" : "blue" };
    return { userId: "123" };
  }

  onCreate (options: any) {
    this.setMetadata({ info: "This room is for ₹33 betting only, choose other room", friendlyFire: false });
    if (options.entryFee != 33) { /* disconnect this user */ }
    this.onMessage("message", async (client, message) => {/* */});
  }

  async onJoin (client: Client, options: any) {
    // runs after a successful onAuth, use it like this -> client.auth.userId
    if (options.entryFee != 33) { /* disconnect this user */ }
    this.liveClients.push(client);
    
    // this.presence.set("arbitrary-key", "value");
    // this.presence.publish("event-name-from-another-room", { hello: "world" });
    // this.presence.subscribe("event-name-from-another-room", (payload) => { console.log("Received event from another room!", payload); });
    // The presence is used as a shared in-memory database for your cluster, and for pub/sub operations between rooms.

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

  onUncaughtException(error: RoomException<this>, methodName: "onCreate" | "onAuth" | "onJoin" | "onLeave" | "onDispose" | "onMessage" | "setSimulationInterval" | "setInterval" | "setTimeout"): void {
      console.error("An error ocurred in", methodName, ":", error);
      // err.cause // original unhandled error
      // err.message // original error message
  }

  onBeforePatch(state: Room33RoomState): void | Promise<any> {
    /*
     * Here you can mutate something in the state just before it is encoded &
     * synchronized with all clients
     */
  }

  createGameRoom(players: Client[]) {
    this.clock.setTimeout(async () => {
      const room = await matchMaker.createRoom("typing_room", {
        entry_fee: 33
      });

      players.forEach((player) => {
        player.send("match_found", { roomId: room.roomId });
        // player.error(code, payload);
        // player.leave(code?: number);
      });
    }, 100);
  }

}
