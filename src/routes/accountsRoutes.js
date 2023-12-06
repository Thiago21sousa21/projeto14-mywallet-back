import { Router } from "express";
import { historicTransactions, newTransaction } from "../controllers/accountsControllers.js";
import { validationFormTransaction } from "../middlewares/accountMiddlewares/validationFormTransaction.js";
import { validationToken } from "../middlewares/accountMiddlewares/vadidationToken.js";

const accountRoutes = Router();

accountRoutes.post('/nova-transacao/:typeTransaction', validationFormTransaction, validationToken ,newTransaction );
accountRoutes.get('/home',validationToken, historicTransactions);

export default accountRoutes;