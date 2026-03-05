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
import { WebSocketServer } from 'ws';
import { handleContainerCreate, handleTerminalCreation } from './containers/handleContainerCreate';
import { IncomingMessage } from 'http';
import { WebSocket } from 'ws';

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

    let projectId = socket.handshake.query['projectId'];
    console.log("Project id received after connection", projectId);

    if (projectId) {
        var watcher = chokidar.watch(`./projects/${projectId}`, {
            ignored: (path) => path.includes("node_modules"),
            persistent: true,
            awaitWriteFinish: {
                stabilityThreshold: 2000,
            },
            ignoreInitial: true,
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

const webSocketForTerminal = new WebSocketServer({
    noServer: true // we will handle the upgrade event
});

webSocketForTerminal.on("connection", (ws: WebSocket, req: IncomingMessage, container: any) => {
    logger.info(`Terminal connected`);
    handleTerminalCreation(container, ws);
});

server.on("upgrade", (req, tcp, head) => {
    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const isTerminal = url.pathname === "/terminal";

    if (isTerminal) {
        const projectId = url.searchParams.get("projectId");
        logger.info(`Project id received after connection: ${projectId}`);

        handleContainerCreate(projectId, webSocketForTerminal, req, tcp, head);
    }
});

server.listen(serverConfig.PORT, async () => {
    logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
    logger.info(`Current working directory: ${process.cwd()}`);
})