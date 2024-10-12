import { Router } from "express";
import { LinkController } from "../controllers/LinkController.js";

export const LinkRouter = Router()

LinkRouter.post('/', LinkController.index)
LinkRouter.post('/create', LinkController.create)
LinkRouter.get('/:id', LinkController.find)
LinkRouter.delete('/:id', LinkController.delete)