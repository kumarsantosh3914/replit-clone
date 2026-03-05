import Docker from 'dockerode';
import { WebSocket, WebSocketServer } from 'ws';
import logger from '../config/logger.config';

const docker = new Docker();

export const handleContainerCreate = async (
    projectId: any,
    terminalSocket: WebSocketServer,
    req: any,
    tcpSocket: any,
    head: any
) => {
    logger.info(`Project id received for container create: ${projectId}`);
    try {
        const container = await docker.createContainer({
            Image: "sandbox",
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Cmd: ['/bin/bash'],
            Tty: true,
            User: "sandbox",
            Volumes: {
                "/home/sandbox/app": {}
            },
            Env: ["HOST=0.0.0.0"],
            ExposedPorts: {
                "5173/tcp": {}
            },
            HostConfig: {
                Binds: [
                    `${process.cwd()}/projects/${projectId}:/home/sandbox/app`
                ],
                PortBindings: {
                    "5173/tcp": [
                        {
                            "HostPort": "0"
                        }
                    ]
                },
            }
        });

        logger.info(`Container created successfully: ${container.id}`);
        await container.start();
        logger.info(`Container started successfully`);

        // Upgrade the connection to websocket
        terminalSocket.handleUpgrade(req, tcpSocket, head, (ws) => {
            logger.info("Connection upgraded to websocket");

            // Re-emit connection for the WebSocketServer to handle
            terminalSocket.emit("connection", ws, req, container);
        });

    } catch (error) {
        logger.error(`Error creating container:`, error);
    }
}

export const handleTerminalCreation = (container: any, ws: WebSocket) => {
    container.exec({
        Cmd: ["/bin/bash"],
        User: "sandbox",
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
    }, (err: any, exec: any) => {
        if (err) {
            logger.error("Error creating exec:", err);
            return;
        }

        exec.start({ hijack: true, stdin: true }, (err: any, stream: any) => {
            if (err) {
                logger.error("Error starting exec:", err);
                return;
            }

            // Stream processing
            processStreamOutput(stream, ws);

            // Stream writing
            ws.on("message", (data: any) => {
                const message = data.toString();
                if (message === "getPort") {
                    container.inspect((err: any, data: any) => {
                        if (err) {
                            logger.error("Error inspecting container:", err);
                            return;
                        }
                        const portInfo = data.NetworkSettings.Ports;
                        logger.info("Container port info:", portInfo);
                        ws.send(JSON.stringify({ type: "port", data: portInfo }));
                    });
                    return;
                }
                stream.write(data);
            });

            ws.on("close", async () => {
                logger.info("Terminal WebSocket closed, removing container...");
                try {
                    await container.stop();
                    await container.remove();
                    logger.info("Container removed successfully");
                } catch (removeErr) {
                    logger.error("Error removing container:", removeErr);
                }
            });
        });
    });
}

function processStreamOutput(stream: any, ws: WebSocket) {
    // Docker streams with TTY enabled are simpler. 
    // We just write raw data to the WebSocket.
    stream.on("data", (data: any) => {
        ws.send(data);
    });

    stream.on("end", () => {
        logger.info("Stream ended");
    });

    stream.on("error", (err: any) => {
        logger.error("Stream error:", err);
    });
}

export const listContainer = async () => {
    const containers = await docker.listContainers();
    logger.info("Active containers:", containers);
    containers.forEach((containerInfo) => {
        logger.info(`Ports for ${containerInfo.Id}:`, containerInfo.Ports);
    });
}