import util from "util";
import child_process from "child_process";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";

const execPromisified = util.promisify(child_process.exec);

export const createProjectController = async (req: Request, res: Response, next: NextFunction) => {
    // Create a unique id and then inside the project directory create a new folder with that id
    const projectId = uuidv4();
    console.log("New Project ID: ", projectId);

    await fs.mkdir(`./projects/${projectId}`);

    // After this call the npm create vite command in the newly created project folder
    await execPromisified('npm create vite@latest sandbox -- --template react', {
        cwd: `./projects/${projectId}`
    });

    res.status(200).json({
        message: "Project created successfully",
        data: projectId,
    });
}