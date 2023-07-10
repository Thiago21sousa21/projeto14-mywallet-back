import { Router } from "express";
import { createRegistration, signin } from "../controllers/usersControllers.js";

const usersRoutes = Router();

usersRoutes.post('/cadastro',  createRegistration);
usersRoutes.post('/', signin);

export default usersRoutes;