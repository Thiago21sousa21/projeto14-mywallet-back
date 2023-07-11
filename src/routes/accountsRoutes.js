import { Router } from "express";
import { historicTransactions, newTransaction } from "../controllers/accountsControllers.js";
import { validationFormTransaction } from "../middlewares/accountMiddlewares/validationTransactionSchema.js";


const accountRoutes = Router();

accountRoutes.post('/nova-transacao/:tipo', validationFormTransaction ,newTransaction );
accountRoutes.get('/home', historicTransactions);

export default accountRoutes;