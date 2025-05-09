import { Room, Client } from "@colyseus/core";
import { TypingRoomState } from "./schema/TypingRoomState";

export class TypingRoom extends Room<TypingRoomState> {
  private players: Client[] = [];

  state = new TypingRoomState();
  maxClients: number = 3;

  onCreate (options: any) {
    this.onMessage("message", (client, message) => {/* */});
  }

  onJoin (client: Client, options: any) {    
    this.players.push(client);
    this.broadcast("start_game", { msg: "Typing game has started!" });

    if (this.players.length >= this.maxClients) this.lock();

    this.clock.setTimeout(() => {
      const winner = this.players[Math.floor(Math.random() * this.maxClients)];
      this.broadcast("game_over", { winner: winner });
      this.disconnect();
    }, this.state.timeout_ms);
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
