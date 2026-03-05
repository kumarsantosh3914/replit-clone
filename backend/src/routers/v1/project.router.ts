import express from 'express';
import { createProjectController, getProjectTreeController } from '../../controllers/project.controller';

const projectRouter = express.Router();

projectRouter.post('/', createProjectController);
projectRouter.get('/:projectId/tree', getProjectTreeController);

export default projectRouter;