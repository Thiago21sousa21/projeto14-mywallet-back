import { Router } from "express";
import { createRegistration, signin } from "../controllers/usersControllers.js";
import { validationFormUser } from "../middlewares/userMiddlewares/validationFormUser.js";
import { siginSchema, signupSchema } from "../schemas/usersSchemas.js";
const usersRoutes = Router();

usersRoutes.post('/cadastro', validationFormUser(signupSchema) ,  createRegistration);
usersRoutes.post('/',validationFormUser(siginSchema), signin);

export default usersRoutes;