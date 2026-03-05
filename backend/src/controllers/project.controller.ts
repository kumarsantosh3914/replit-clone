import util from "util";
import child_process from "child_process";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import directoryTree from "directory-tree";

const execPromisified = util.promisify(child_process.exec);

export const createProjectController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Create a unique id and then inside the project directory create a new folder with that id
        const projectId = uuidv4();
        console.log("New Project ID: ", projectId);

        // recursive: true ensures the base `projects/` folder is created if it doesn't exist yet
        await fs.mkdir(`./projects/${projectId}`, { recursive: true });

        // -y flag makes npm create vite run non-interactively (no prompts)
        await execPromisified('npm create vite@latest sandbox -- --template react -y', {
            cwd: `./projects/${projectId}`
        });

        res.status(200).json({
            message: "Project created successfully",
            data: projectId,
        });
    } catch (error) {
        next(error); // forwards to your genericErrorHandler middleware
    }
}

export const getProjectTreeController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId } = req.params;
        // Scan the directory for the specific project
        const tree = directoryTree(`./projects/${projectId}`);

        res.status(200).json({
            message: "Successfully fetched the tree",
            success: true,
            data: tree,
        });
    } catch (error) {
        next(error);
    }
}