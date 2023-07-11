import { Router } from "express";
import usersRoutes from "./usersRoutes.js";
import accountRoutes from "./accountsRoutes.js";

const indexRoutes = Router();

indexRoutes.use(usersRoutes);
indexRoutes.use(accountRoutes);

export default indexRoutes;