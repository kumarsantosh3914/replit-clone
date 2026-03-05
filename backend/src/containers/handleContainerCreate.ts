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
            Volumes: {
                "home/sandbox/app": {}
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

        logger.info(`Container created successfully`, container.id);

        container.exec({
            Cmd: ["/bin/bash"],
            User: "sandbox",
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
        }, (err, exec) => {
            if (err) {
                logger.error("Error creating exec", err);
                return;
            }

            exec?.start({ hijack: true }, (err, stream) => {
                if (err) {
                    logger.error("Error starting exec", err);
                    return;
                }

                processStream(stream, socket);
                socket.on("shell-input", (data) => {
                    logger.info("Shell input received", data);
                    stream?.write("pwd\n", (err) => {
                        if (err) {
                            logger.error("Error writing to stream", err);
                            return;
                        } else {
                            logger.info("Successfully wrote to stream");
                        }
                    });
                })
            })
        })
        await container.start();
        logger.info(`Container started successfully`, container.id);
    } catch (error) {
        logger.error(`Error creating container`, error);
    }
}

function processStream(stream: any, socket: Socket) {
    let buffer = Buffer.from("");
    stream.on("data", (data: any) => {
        buffer = Buffer.concat([buffer, data]);
        logger.info("Stream data received", buffer.toString());
        socket.emit("shell-output", buffer.toString());
        buffer = Buffer.from("");
    })

    stream.on("end", () => {
        logger.info("Stream ended");
        socket.emit("shell-output", "\nStream ended");
    })

    stream.on("error", (err: any) => {
        logger.error("Stream error", err);
        socket.emit("shell-output", "\nStream error");
    })

    logger.info("Stream processed successfully", stream);
}