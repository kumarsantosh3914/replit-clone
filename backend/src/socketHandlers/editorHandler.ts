import { Socket } from "socket.io";
import fs from "fs/promises";

export function registerEditorHandlers(socket: Socket): void {
    socket.on("writeFile", async ({ data, pathToFileOrFolder }: { data: string, pathToFileOrFolder: string }) => {
        try {
            await fs.writeFile(pathToFileOrFolder, data);
            socket.emit("writeFileSuccess", {
                data: "File written successfully",
            });
        } catch (error) {
            console.error("Error writing the file", error);
            socket.emit("error", {
                data: "Error writing the file",
            });
        }
    });

    socket.on("createFile", async ({ pathToFileOrFolder }: { pathToFileOrFolder: string }) => {
        try {
            // Check if file already exists
            try {
                await fs.stat(pathToFileOrFolder);
                socket.emit("error", {
                    data: "File already exists",
                });
                return;
            } catch (err) {
                // File does not exist, proceed to create
            }

            await fs.writeFile(pathToFileOrFolder, "");
            socket.emit("createFileSuccess", {
                data: "File created successfully",
            });
        } catch (error) {
            console.error("Error creating the file", error);
            socket.emit("error", {
                data: "Error creating the file",
            });
        }
    });

    socket.on("readFile", async ({ pathToFileOrFolder }: { pathToFileOrFolder: string }) => {
        try {
            const content = await fs.readFile(pathToFileOrFolder, "utf-8");
            socket.emit("readFileSuccess", {
                value: content,
                path: pathToFileOrFolder,
            });
        } catch (error) {
            console.error("Error reading the file", error);
            socket.emit("error", {
                data: "Error reading the file",
            });
        }
    });

    socket.on("deleteFile", async ({ pathToFileOrFolder }: { pathToFileOrFolder: string }) => {
        try {
            await fs.unlink(pathToFileOrFolder);
            socket.emit("deleteFileSuccess", {
                data: "File deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting the file", error);
            socket.emit("error", {
                data: "Error deleting the file",
            });
        }
    });

    socket.on("createFolder", async ({ pathToFileOrFolder }: { pathToFileOrFolder: string }) => {
        try {
            await fs.mkdir(pathToFileOrFolder, { recursive: true });
            socket.emit("createFolderSuccess", {
                data: "Folder created successfully",
            });
        } catch (error) {
            console.error("Error creating the folder", error);
            socket.emit("error", {
                data: "Error creating the folder",
            });
        }
    });

    socket.on("deleteFolder", async ({ pathToFileOrFolder }: { pathToFileOrFolder: string }) => {
        try {
            await fs.rm(pathToFileOrFolder, { recursive: true, force: true });
            socket.emit("deleteFolderSuccess", {
                data: "Folder deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting the folder", error);
            socket.emit("error", {
                data: "Error deleting the folder",
            });
        }
    });
}