import { Socket } from "socket.io";
import fs from "fs";
import path from "path";

export function registerEditorHandlers(socket: Socket): void {
    // Fetch file content when a file is opened in the editor
    socket.on(
        "fetchFileContent",
        ({ pathToFileOrFolder }: { pathToFileOrFolder: string }) => {
            try {
                const absolutePath = path.resolve(pathToFileOrFolder);
                const content = fs.readFileSync(absolutePath, "utf-8");
                socket.emit("fetchFileContent", { content });
            } catch (error) {
                socket.emit("error", {
                    message: `Could not read file: ${pathToFileOrFolder}`,
                });
            }
        }
    );

    // Save file content when the editor emits a change
    socket.on(
        "updateFileContent",
        ({
            pathToFileOrFolder,
            content,
        }: {
            pathToFileOrFolder: string;
            content: string;
        }) => {
            try {
                const absolutePath = path.resolve(pathToFileOrFolder);
                fs.writeFileSync(absolutePath, content, "utf-8");
                socket.emit("updateFileContent", { success: true });
            } catch (error) {
                socket.emit("error", {
                    message: `Could not write file: ${pathToFileOrFolder}`,
                });
            }
        }
    );
}