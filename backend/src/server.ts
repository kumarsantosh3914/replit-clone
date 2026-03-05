import express from 'express';
import { Express } from 'express';
import cors from 'cors';
import { serverConfig } from './config';
import v1Router from './routers/v1/index.router';
import v2Router from './routers/v2/index.router';
import { appErrorHandler, genericErrorHandler } from './middlewares/error.middleware';
import { attachCorrelationIdMiddleware } from './middlewares/correlation.middleware';
import logger from './config/logger.config';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import chokidar from 'chokidar';
import { registerEditorHandlers } from './socketHandlers/editorHandler';
import { handleContainerCreate } from './containers/handleContainerCreate';

const app: Express = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

const editorNamespace = io.of('/editor');
editorNamespace.on("connection", (socket: Socket) => {
    console.log("editor connected");

    // somehow we will get the project id from the client
    let projectId = socket.handshake.query['projectId'];
    console.log("Project id received after connection", projectId);

    if (projectId) {
        var watcher = chokidar.watch(`./projects/${projectId}`, {
            ignored: (path) => path.includes("node_modules"),
            persistent: true, // keeps the watcher in running state till the time app is running
            awaitWriteFinish: {
                stabilityThreshold: 2000, // Ensures stability of files before triggering event
            },
            ignoreInitial: true, //. Ignores the intial files in the directory
        });

        watcher.on("all", (event, path) => {
            console.log(event, path);
        });
    }

    registerEditorHandlers(socket);
})

// Middleware to parse JSON request bodies
app.use(express.json());

// Allow cross-origin requests from the frontend dev server
app.use(cors({ origin: '*' }));

// Regestering all the routers and their corresponding routes with out app server object.
app.use(attachCorrelationIdMiddleware);
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);

app.use(appErrorHandler);
// Middleware to handle errors
app.use(genericErrorHandler);

const terminalNamespace = io.of('/terminal');
terminalNamespace.on("connection", (socket: Socket) => {
    logger.info(`Terminal connected`);

    let projectId = socket.handshake.query['projectId'];

    socket.on("disconnect", () => {
        logger.info(`Terminal disconnected`);
    });

    handleContainerCreate(projectId, socket);
})

server.listen(serverConfig.PORT, async () => {
    logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
    logger.info(`Current working directory: ${process.cwd()}`);
})