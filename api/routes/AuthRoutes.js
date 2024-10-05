import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";

export const AuthRouter = Router()

AuthRouter.post('/authorize', AuthController.authorize)
AuthRouter.post('/login', AuthController.login)
AuthRouter.post('/session', AuthController.session)
AuthRouter.post('/user/edit', AuthController.edit)
AuthRouter.post('/register', AuthController.register)
AuthRouter.post('/logout', AuthController.logout)