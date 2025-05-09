import cors from "cors";
import config from "@colyseus/tools";
import { matchMaker, RedisDriver, RedisPresence } from "colyseus";
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
        devMode: false,
        gracefullyShutdown: true, // default
        // presence: new RedisPresence("redis://default:QBXjdPGbY2FmkFhSCCU4CwEPTykkQNt9@redis-12768.c239.us-east-1-2.ec2.redns.redis-cloud.com:12768"),
        // driver: new RedisDriver("redis://default:QBXjdPGbY2FmkFhSCCU4CwEPTykkQNt9@redis-12768.c239.us-east-1-2.ec2.redns.redis-cloud.com:12768"),
        selectProcessIdToCreateRoom: async function (roomName: string, clientOptions: any) {
            return (await matchMaker.stats.fetchAll())
                .sort((p1, p2) => p1.roomCount > p2.roomCount ? 1 : -1)[0] // might produce error if rooms are empty
                .processId;
        }
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

        // gameServer.removeRoomType("room_99"); // usefull sometimes
        // gameServer.gracefullyShutdown();

        gameServer.define('room_33', Room33Room, { pool_size: 33 })
            .sortBy({ clients: -1 })
            .enableRealtimeListing()
            .filterBy([ "entryFee" ]); // https://docs.colyseus.io/server#definition-options
        gameServer.define('typing_room', TypingRoom, { theme: 'black_forest' });

        // Make sure to never call the `simulateLatency()` method in production.
        // if (process.env.NODE_ENV !== "production") { gameServer.simulateLatency(200); }

        gameServer.onBeforeShutdown(async () => { /* ... custom logic */ });
        gameServer.onShutdown(async () => { /* ... custom logic */ });
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
