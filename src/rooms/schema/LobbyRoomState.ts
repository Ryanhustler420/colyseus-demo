import { Client } from "@colyseus/core";
import { Schema, type, MapSchema } from "@colyseus/schema";

export class LobbyRoomState extends Schema {

  @type("string") room_type: string = "Lobby";
  @type([]) clients: [] = [];

}
