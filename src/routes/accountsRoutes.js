import { Router } from "express";
import { historicTransactions, newTransaction } from "../controllers/accountsControllers.js";


const accountRoutes = Router();

accountRoutes.post('/nova-transacao/:tipo', newTransaction );
accountRoutes.get('/home', historicTransactions);

export default accountRoutes;