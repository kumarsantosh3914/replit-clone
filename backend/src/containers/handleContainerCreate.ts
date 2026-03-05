import Docker from 'dockerode';
import { Socket } from 'socket.io';
import logger from '../config/logger.config';

const docker = new Docker();

export const handleContainerCreate = async (projectId: any, socket: Socket) => {
    logger.info(`Project id received after connection`, projectId);
    try {
        const container = await docker.createContainer({
            Image: "sandbox", // name of the which is written in the Dockerfile
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Cmd: ['/bin/bash'],
            Tty: true,
            User: "sandbox",
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

        logger.info(`Container created successfully`, container.id);
        await container.start();
        logger.info(`Container started successfully`, container.id);

        // Attach to the container's streams
        container.attach({ stream: true, stdin: true, stdout: true, stderr: true }, (err, stream) => {
            if (err || !stream) {
                logger.error("Error attaching to container stream", err);
                return;
            }

            logger.info("Attached to container stream");

            // Handle output from container to socket
            stream.on("data", (chunk) => {
                socket.emit("shell-output", chunk.toString());
            });

            // Handle input from socket to container
            socket.on("shell-input", (data) => {
                stream.write(data);
            });

            // Handle socket disconnect
            socket.on("disconnect", () => {
                logger.info("Terminal socket disconnected, stopping container...");
                container.stop().then(() => container.remove()).catch(err => logger.error("Error cleaning up container", err));
            });
        });

    } catch (error) {
        logger.error(`Error creating container`, error);
    }
}