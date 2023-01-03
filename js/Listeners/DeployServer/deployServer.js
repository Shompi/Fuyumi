"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const stats_1 = require("./Routes/stats");
const fastify_1 = __importDefault(require("fastify"));
let deployed = false;
const SERVER = (0, fastify_1.default)();
const PORT = 2289;
module.exports = class DeployServer extends discord_akairo_1.Listener {
    constructor() {
        super('deployServer', {
            emitter: 'client',
            event: 'deployServer',
        });
    }
    async exec(client) {
        if (deployed)
            return console.log("Fastify api already deployed. Ignoring...");
        console.log("Starting fastify server on port" + PORT);
        // Route declaration
        console.log("Creating route /fuyumi/stats...");
        SERVER.get('/fuyumi/stats', async (req, reply) => (0, stats_1.StatsRequestHandler)(req, reply, client));
        console.log("OK");
        // END Route declaration
        const SUCCESS = await SERVER.listen({ port: PORT }).catch(err => console.error(err));
        if (!SUCCESS)
            return console.log("Ocurrió un error al intentar iniciar el servidor.");
        deployed = true;
        console.log("Server initiated!", SUCCESS);
    }
};
