import { Room, Client } from "@colyseus/core";
import { TypingRoomState } from "./schema/TypingRoomState";

export class TypingRoom extends Room<TypingRoomState> {
  private players: Client[] = [];

  state = new TypingRoomState();
  maxClients: number = 3;

  onCreate (options: any) {
    // this.setSeatReservationTime (300);
    this.onMessage("message", (client, message) => {/* do what ever you want to do with received data */}, (payload: any) => {
        if (typeof(payload.x) !== "number" || typeof(payload.y) !== "number") {
          throw new Error("Invalid payload");
        }
        return payload;
    });
  }

  onJoin (client: Client, options: any) {    
    this.players.push(client);
    this.broadcast("start_game", { msg: "Typing game has started!" }); // Send a message to all connected clients.

    if (this.players.length >= this.maxClients) {
      this.lock();
      // this.roomName
      // this is not required here since the maxClient is already there to stop new client
      // Some matchmakers will prioritize unlocked rooms. Locking a room lets you signal “we're good here” to the matchmaking system, even if maxClients hasn’t been reached.
    }

    // It is recommended to use the clock instance for setTimeout and setInterval methods, as timers and intervals are automatically cleared when the room is disposed - preventing memory leaks.
    this.clock.setTimeout(() => {
      const winner = this.players[Math.floor(Math.random() * this.maxClients)];
      this.broadcast("game_over", { winner: winner });
      this.disconnect(); // Disconnect all clients, then dispose.
    }, this.state.timeout_ms);
  }

  async onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");

    // flag client as inactive for other users
    // this.state.players.get(client.sessionId).connected = false;
 
    try {
        // if (consented) throw new Error("consented leave");
        // await this.allowReconnection(client, 20); // allow disconnected client to reconnect into this room until 20 seconds
 
        // client returned! let's re-activate it.
        // this.state.players.get(client.sessionId).connected = true;
    } catch (e) {
        // 20 seconds expired. let's remove the client.
        // this.state.players.delete(client.sessionId);
    }

    // this.unlock (); // based on your logic, you can unlock room so new client can come here
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
