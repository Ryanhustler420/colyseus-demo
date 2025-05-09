import cors from "cors";
import config from "@colyseus/tools";
import { RedisDriver, RedisPresence } from "colyseus";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport"

/**
 * Import your Room files
 */
import { Room33Room } from "./rooms/Room33Room";
import { TypingRoom } from "./rooms/TypingRoom";

export default config({

    options: {
        presence: new RedisPresence("redis://default:QBXjdPGbY2FmkFhSCCU4CwEPTykkQNt9@redis-12768.c239.us-east-1-2.ec2.redns.redis-cloud.com:12768"),
        driver: new RedisDriver("redis://default:QBXjdPGbY2FmkFhSCCU4CwEPTykkQNt9@redis-12768.c239.us-east-1-2.ec2.redns.redis-cloud.com:12768")
    },

    initializeTransport: () => {
        return new uWebSocketsTransport({
            sendPingsAutomatically: true,
        });
    },

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('room_33', Room33Room, { }).enableRealtimeListing();
        gameServer.define('typing_room', TypingRoom, { });
    },

    initializeExpress: (app) => {
        app.use(cors({
            origin: "*"
        }))

        /**
         * Bind your custom express routes here:
         * Read more: https://expressjs.com/en/starter/basic-routing.html
         */
        app.get("/hello_world", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });

        /**
         * Use @colyseus/playground
         * (It is not recommended to expose this route in a production environment)
         */
        if (process.env.NODE_ENV !== "production") {
            app.use("/", playground());
        }

        /**
         * Use @colyseus/monitor
         * It is recommended to protect this route with a password
         * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
         */
        app.use("/monitor", monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});
