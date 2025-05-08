import { Schema, type } from "@colyseus/schema";

export class TypingRoomState extends Schema {

  @type("string") room_type: string = "Typing Room";
  @type("number") timeout_ms: number = 1000 * 60; // 60 seconds
  @type("number") total_seat: number = 3;

}
