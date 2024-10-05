import { Router } from "express";
import { LinkController } from "../controllers/LinkController.js";

export const LinkRouter = Router()

LinkRouter.get('/', LinkController.index)
LinkRouter.post('/', LinkController.create)
LinkRouter.get('/:id', LinkController.find)